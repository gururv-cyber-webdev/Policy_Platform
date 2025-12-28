import api from './axiosInstance.js'
// import axios from 'axios'
export const getTree = () => api.get('/policies/tree')
export const getPolicy = (id) => api.get(`/policies/${id}`)
export const ackPolicy = (id) => api.post(`/policies/${id}/ack`)
export const createPolicy = (payload) => api.post('/admin/policies', payload)
export const updatePolicy = (id, payload) => api.put(`/admin/policies/${id}`, payload)
export const deletePolicy = (id) => api.delete(`/admin/policies/${id}`)
export const searchPolicies = (q) => api.get('/search', { params: { q } })
export const getPending = () => api.get('/pending')
export function getReadPolicies() { return api.get('/policies/read') }
export function getCompanyStats() { return api.get('/policies/company-stats') }

