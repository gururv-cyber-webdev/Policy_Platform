// frontend/src/api/auth.js (or admin.js)
import api from './axiosInstance.js'

// Get current logged-in user
export const me = () => api.get('/users/me')

// Get all unapproved users (admin)
export const unapproved = () => api.get('/admin/unapproved-users')

// Approve a user by ID (admin)
export const approveUser = (id) => api.post(`/admin/approve/${id}`)

// Download dashboard report (returns full URL for direct download)
export const downloadReport = () => {
  // Use CRA environment variable fallback
  const baseURL = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api'
  return `${baseURL}/reports/dashboard.csv`
}

export function getUserStats() {
  return api.get('/admin/user-stats');
}
