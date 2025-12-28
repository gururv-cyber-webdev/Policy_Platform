import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

export default function GuardedRoute({ roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN' && !user.isApproved) return <Navigate to="/login" replace />
  return <Outlet />
}
