import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser, loginUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const { updateUser } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return }
    setFieldErrors({})
    setLoading(true)
    try {
      await registerUser(name, email, password)
      // Auto-login after registration then go to home to show verification modal
      try {
        await loginUser(email, password)
        await updateUser()
        navigate('/home', { state: { showVerifyModal: true } })
      } catch {
        // If auto-login fails, just redirect to login
        navigate('/login', { state: { registered: true } })
      }
    } catch (err) {
      const data = err.response?.data
      let msg = 'Registration failed. Please try again.'
      if (typeof data === 'string') msg = data
      else if (data?.message) msg = data.message
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="card page-animate">
        <div className="brand">
          <div className="brand-icon">A</div>
          <div className="brand-name">Authify</div>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>Create account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', marginBottom: 28 }}>
          Join Authify today
        </p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className={`form-input${fieldErrors.name ? ' error' : ''}`}
              type="text" placeholder="John Doe"
              value={name} onChange={e => setName(e.target.value)}
              autoComplete="name"
            />
            {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className={`form-input${fieldErrors.email ? ' error' : ''}`}
              type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
            {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className={`form-input${fieldErrors.password ? ' error' : ''}`}
              type="password" placeholder="Min. 6 characters"
              value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
