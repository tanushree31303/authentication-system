// Backend runs on port 8081 with context-path /api/v1.0
// CORS is configured on backend for http://localhost:5173
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1.0'
