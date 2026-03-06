import React, { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { loginUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { updateUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Show success message if coming from registration
  const registered = location.state?.registered

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please fill in both fields.')
      return
    }
    setLoading(true)
    try {
      const res = await loginUser(email, password)
      // Backend returns { error: true, message: '...' } on bad credentials (status 400)
      if (res.data?.error) {
        setError(res.data.message || 'Login failed.')
        return
      }
      // Login success — cookie is set by browser automatically
      await updateUser()
      navigate('/home')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      setError(msg)
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

        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>Welcome back</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', marginBottom: 28 }}>
          Sign in to your account
        </p>

        {registered && (
          <div className="alert alert-success">
            Account created! Please sign in.
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: 20, marginTop: -8 }}>
            <Link to="/reset-password" style={{ fontSize: 13 }}>Forgot password?</Link>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--text-muted)' }}>
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
