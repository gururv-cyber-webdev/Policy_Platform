import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
// import UserPage from './pages/UserPage'
import Policies from './pages/Policies'
import PolicyDetails from './pages/PolicyDetails'
import PendingPolicies from './pages/PendingPolicies'
import QuizPage from './pages/QuizPage'
import Reports from './pages/Reports'
import GuardedRoute from './components/GuardedRoute'

export default function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin-protected routes */}
      <Route element={<GuardedRoute roles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Employee/Admin-protected routes */}
      <Route element={<GuardedRoute roles={['EMPLOYEE', 'ADMIN']} />}>
        <Route path="/user" element={<Home />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/policies/:id" element={<PolicyDetails />} />
        <Route path="/pending" element={<PendingPolicies />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}
