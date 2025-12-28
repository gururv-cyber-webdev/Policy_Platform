import api from './axiosInstance.js'
export const ask = (question, context) => api.post('/ai/ask', { question, context })
