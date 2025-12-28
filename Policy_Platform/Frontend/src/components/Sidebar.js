import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

export default function Sidebar(){
  const { logout } = useAuth()
  const { pathname } = useLocation()
  const item = (to, label) => <Link to={to} style={{display:'block',padding:'8px 10px',borderRadius:8, background: pathname===to? '#071a2b':''}}>{label}</Link>
  return (
    <div className="sidebar">
      <div style={{fontWeight:800,marginBottom:12}}>Policy Platform</div>
      {item('/user','Dashboard')}
      {item('/policies','View Policies')}
      {item('/pending','Pending Policies')}
      {item('/quiz','Quiz')}
      <div style={{height:12}}></div>
      <button className="btn secondary" onClick={logout} style={{width:'100%'}}>Logout</button>
    </div>
  )
}
