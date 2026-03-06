import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { checkIsAuthenticated, getProfile } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)         // null = not loaded yet or not logged in
  const [loading, setLoading] = useState(true)   // true while checking auth on mount

  // Called on app load to restore session from cookie
  const loadUser = useCallback(async () => {
    try {
      const authRes = await checkIsAuthenticated()
      if (authRes.data === true) {
        const profileRes = await getProfile()
        setUser(profileRes.data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  // Refresh profile data (e.g. after OTP verification)
  const updateUser = useCallback(async () => {
    try {
      const profileRes = await getProfile()
      setUser(profileRes.data)
    } catch {
      setUser(null)
    }
  }, [])

  // Logout: expire the cookie from client side
  const logout = useCallback(() => {
    document.cookie = 'jwt=; Max-Age=0; path=/'
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading, updateUser, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
