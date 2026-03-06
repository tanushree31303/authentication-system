import api from './api'

// ── Public endpoints (no auth needed) ────────────────────────────────────────

// POST /api/v1.0/register  — { name, email, password }
export const registerUser = (name, email, password) =>
  api.post('/register', { name, email, password })

// POST /api/v1.0/login  — { email, password }
// Backend sets JWT as HttpOnly cookie in response
export const loginUser = (email, password) =>
  api.post('/login', { email, password })

// POST /api/v1.0/send-reset-otp?email=xxx
export const sendResetOtp = (email) =>
  api.post(`/send-reset-otp?email=${encodeURIComponent(email)}`)

// POST /api/v1.0/reset-password  — { email, otp, newPassword }
export const resetPassword = (email, otp, newPassword) =>
  api.post('/reset-password', { email, otp, newPassword })

// ── Authenticated endpoints (JWT cookie sent automatically) ──────────────────

// GET /api/v1.0/is-authenticated
export const checkIsAuthenticated = () =>
  api.get('/is-authenticated')

// GET /api/v1.0/profile
export const getProfile = () =>
  api.get('/profile')

// POST /api/v1.0/send-otp  — sends OTP to logged-in user's email
export const sendVerifyOtp = () =>
  api.post('/send-otp')

// POST /api/v1.0/verify-otp  — { otp: "123456" }
export const verifyOtp = (otp) =>
  api.post('/verify-otp', { otp })
