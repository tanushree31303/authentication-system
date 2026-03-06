import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">A</div>
          <span className="logo-text">Authify</span>
        </div>

        <div className="header-right">
          <div className="avatar-wrap">
            <div className="avatar">{initials}</div>
            <div className="avatar-info">
              <span className="avatar-name">{user?.name || user?.email}</span>
              <span className={`badge ${user?.isAccountVerified ? 'badge-verified' : 'badge-unverified'}`}>
                {user?.isAccountVerified ? '✓ Verified' : '✗ Not Verified'}
              </span>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
