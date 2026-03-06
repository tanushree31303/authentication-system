import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import VerificationModal from '../components/VerificationModal'

const features = [
  { icon: '🔒', title: 'Secure Auth', desc: 'JWT-based authentication with HttpOnly cookies to prevent XSS attacks.' },
  { icon: '✉️', title: 'Email Verification', desc: 'OTP-based email verification to ensure account authenticity.' },
  { icon: '🔑', title: 'Password Reset', desc: 'Secure OTP-based password reset flow via email.' },
  { icon: '⚡', title: 'Fast & Reliable', desc: 'Built on Spring Boot with 99.9% uptime guarantee.' },
]

export default function Home() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  // Show verification modal after registration
  useEffect(() => {
    if (location.state?.showVerifyModal && !user?.isAccountVerified) {
      setShowModal(true)
      // Clear state so refreshing doesn't re-show it
      window.history.replaceState({}, '')
    }
  }, [location.state, user])

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <>
      <Header />
      <div className="home-wrap page-animate">

        {/* Hero */}
        <div className="hero">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>{initials}</div>
            <div>
              <h1>Welcome, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
              <p style={{ margin: 0 }}>{user?.email}</p>
            </div>
          </div>
          {!user?.isAccountVerified && (
            <div className="hero-actions">
              <button
                className="btn btn-outline btn-auto"
                style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff', padding: '9px 18px' }}
                onClick={() => setShowModal(true)}
              >
                Verify Email Now
              </button>
            </div>
          )}
        </div>

        {/* Verification banner */}
        {!user?.isAccountVerified && (
          <div className="verify-banner">
            <span style={{ fontSize: 20 }}>⚠️</span>
            <p>Your email is not verified. Verify now to access all features.</p>
            <button className="btn btn-outline btn-auto btn-sm" onClick={() => setShowModal(true)}>
              Verify Now
            </button>
          </div>
        )}

        {/* Profile Card */}
        <div className="profile-card">
          <h2>Account Details</h2>
          <div className="profile-grid">
            <ProfileField label="Name" value={user?.name} />
            <ProfileField label="Email" value={user?.email} />
            <ProfileField label="User ID" value={user?.userId} mono />
            <ProfileField label="Email Status" value={
              <span className={`badge ${user?.isAccountVerified ? 'badge-verified' : 'badge-unverified'}`}>
                {user?.isAccountVerified ? '✓ Verified' : '✗ Not Verified'}
              </span>
            } />
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>

        {/* Features */}
        <div className="features-grid">
          {features.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Security section */}
        <div className="profile-card">
          <h2>Security</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
            Manage your account security settings.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {!user?.isAccountVerified && (
              <button className="btn btn-primary btn-auto btn-sm" onClick={() => navigate('/email-verify')}>
                Verify Email
              </button>
            )}
            <button className="btn btn-outline btn-auto btn-sm" onClick={() => navigate('/reset-password')}>
              Change Password
            </button>
          </div>
        </div>

      </div>

      {showModal && <VerificationModal onClose={() => setShowModal(false)} />}
    </>
  )
}

function ProfileField({ label, value, mono }) {
  return (
    <div className="profile-field">
      <div className="profile-field-label">{label}</div>
      <div className="profile-field-value" style={{ fontFamily: mono ? 'monospace' : 'inherit' }}>
        {value || '—'}
      </div>
    </div>
  )
}
