import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendVerifyOtp, verifyOtp } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function EmailVerify() {
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sendLoading, setSendLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'success'|'error', text }
  const { updateUser, user } = useAuth()
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    setMessage(null)
    setSendLoading(true)
    try {
      await sendVerifyOtp()
      setOtpSent(true)
      setMessage({ type: 'success', text: `OTP sent to ${user?.email}. Check your inbox.` })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP.'
      setMessage({ type: 'error', text: msg })
    } finally {
      setSendLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!otp.trim()) { setMessage({ type: 'error', text: 'Please enter the OTP.' }); return }
    setMessage(null)
    setVerifyLoading(true)
    try {
      await verifyOtp(otp)
      await updateUser()
      setMessage({ type: 'success', text: 'Email verified successfully! Redirecting...' })
      setTimeout(() => navigate('/home'), 1500)
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP. Try again.'
      setMessage({ type: 'error', text: msg })
    } finally {
      setVerifyLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="card page-animate">
        <div className="brand">
          <div className="brand-icon">✉</div>
          <div className="brand-name">Verify Email</div>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
          Email Verification
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', marginBottom: 28 }}>
          {user?.email ? `We'll send an OTP to ${user.email}` : 'Verify your email address'}
        </p>

        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        {!otpSent ? (
          <>
            <button className="btn btn-primary" onClick={handleSendOtp} disabled={sendLoading}>
              {sendLoading ? <span className="spinner" /> : 'Send Verification OTP'}
            </button>
            <button className="btn btn-outline" style={{ marginTop: 10 }} onClick={() => navigate('/home')}>
              Back to Home
            </button>
          </>
        ) : (
          <form onSubmit={handleVerify} noValidate>
            <div className="form-group">
              <label className="form-label">Enter OTP</label>
              <input
                className="form-input"
                type="text" placeholder="Enter OTP from your email"
                value={otp} onChange={e => setOtp(e.target.value)}
                maxLength={10} autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={verifyLoading}>
              {verifyLoading ? <span className="spinner" /> : 'Verify OTP'}
            </button>
            <button
              type="button" className="btn btn-outline" style={{ marginTop: 10 }}
              onClick={() => { setOtpSent(false); setOtp(''); setMessage(null) }}
            >
              Resend OTP
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
