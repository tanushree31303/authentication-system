import axios from 'axios'
import { API_BASE_URL } from '../util/constants'

// withCredentials: true is REQUIRED so the browser sends the JWT HttpOnly cookie
// on every request to the backend
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
