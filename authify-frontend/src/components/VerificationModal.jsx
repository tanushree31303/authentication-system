import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendVerifyOtp, verifyOtp } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function VerificationModal({ onClose }) {
  const [phase, setPhase] = useState('prompt') // 'prompt' | 'otp' | 'done'
  const [otp, setOtp] = useState('')
  const [sendLoading, setSendLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const { updateUser, user } = useAuth()
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    setMessage(null)
    setSendLoading(true)
    try {
      await sendVerifyOtp()
      setPhase('otp')
      setMessage({ type: 'success', text: `OTP sent to ${user?.email}` })
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
      setPhase('done')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP.'
      setMessage({ type: 'error', text: msg })
    } finally {
      setVerifyLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        {phase === 'prompt' && (
          <>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✉️</div>
            <h2>Verify Your Email</h2>
            <p>
              Your account was created! Verify your email <strong>{user?.email}</strong> now to unlock all features.
            </p>
            {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleSendOtp} disabled={sendLoading}>
                {sendLoading ? <span className="spinner" /> : 'Verify Email Now'}
              </button>
              <button className="btn btn-outline" onClick={onClose}>
                Skip for Later
              </button>
            </div>
          </>
        )}

        {phase === 'otp' && (
          <>
            <h2>Enter OTP</h2>
            <p>We sent a verification code to your email.</p>
            {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
            <form onSubmit={handleVerify} noValidate>
              <div className="form-group">
                <label className="form-label">OTP</label>
                <input
                  className="form-input" type="text"
                  placeholder="Enter OTP" value={otp}
                  onChange={e => setOtp(e.target.value)} maxLength={10} autoFocus
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" disabled={verifyLoading}>
                  {verifyLoading ? <span className="spinner" /> : 'Verify'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => { setPhase('prompt'); setOtp(''); setMessage(null) }}>
                  Resend
                </button>
              </div>
            </form>
          </>
        )}

        {phase === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h2>Email Verified!</h2>
            <p>Your account is now fully verified.</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={onClose}>
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
