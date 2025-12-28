import api from './axiosInstance.js'
export const status = () => api.get('/quiz/status')
export const current = () => api.get('/quiz/current')
export const submit = (answers) => api.post('/quiz/submit', { answers })
