import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { sendResetOtp, resetPassword } from '../services/authService'

const STEP = { EMAIL: 0, RESET: 1, DONE: 2 }

export default function ResetPassword() {
  const [step, setStep] = useState(STEP.EMAIL)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setMessage(null)
    if (!email.trim()) { setMessage({ type: 'error', text: 'Please enter your email.' }); return }
    setLoading(true)
    try {
      await sendResetOtp(email)
      setMessage({ type: 'success', text: 'OTP sent to your email!' })
      setStep(STEP.RESET)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Check the email address.'
      setMessage({ type: 'error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setMessage(null)
    if (!otp.trim()) { setMessage({ type: 'error', text: 'Please enter the OTP.' }); return }
    if (!newPassword || newPassword.length < 6) { setMessage({ type: 'error', text: 'Password must be at least 6 characters.' }); return }
    if (newPassword !== confirmPassword) { setMessage({ type: 'error', text: 'Passwords do not match.' }); return }
    setLoading(true)
    try {
      await resetPassword(email, otp, newPassword)
      setStep(STEP.DONE)
    } catch (err) {
      const msg = err.response?.data?.message || 'Reset failed. Check your OTP and try again.'
      setMessage({ type: 'error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="card page-animate">
        <div className="brand">
          <div className="brand-icon">🔑</div>
          <div className="brand-name">Authify</div>
        </div>

        {/* Step dots */}
        <div className="stepper">
          <div className={`step-dot ${step >= STEP.EMAIL ? 'active' : ''}`} />
          <div className={`step-dot ${step >= STEP.RESET ? 'active' : ''}`} />
        </div>

        {step === STEP.EMAIL && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>Reset Password</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', marginBottom: 28 }}>
              Enter your email to receive a reset OTP
            </p>
            {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
            <form onSubmit={handleSendOtp} noValidate>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input" type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Send OTP'}
              </button>
            </form>
          </>
        )}

        {step === STEP.RESET && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>Set New Password</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', marginBottom: 28 }}>
              OTP sent to <strong>{email}</strong>
            </p>
            {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
            <form onSubmit={handleReset} noValidate>
              <div className="form-group">
                <label className="form-label">OTP</label>
                <input
                  className="form-input" type="text" placeholder="Enter OTP from your email"
                  value={otp} onChange={e => setOtp(e.target.value)} maxLength={10}
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  className="form-input" type="password" placeholder="Min. 6 characters"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  className="form-input" type="password" placeholder="Repeat new password"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password"
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Reset Password'}
              </button>
              <button
                type="button" className="btn btn-outline" style={{ marginTop: 10 }}
                onClick={() => { setStep(STEP.EMAIL); setMessage(null) }}
              >
                ← Back
              </button>
            </form>
          </>
        )}

        {step === STEP.DONE && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--success-light)', border: '2px solid var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: 28,
            }}>✓</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Password Reset!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>
              Your password has been updated successfully.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </div>
        )}

        {step !== STEP.DONE && (
          <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--text-muted)' }}>
            Remember your password? <Link to="/login">Sign in</Link>
          </p>
        )}
      </div>
    </div>
  )
}
