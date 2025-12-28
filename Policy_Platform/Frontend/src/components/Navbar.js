// frontend/src/components/Navbar.js
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  // CRA-compatible API base
  const apiBase = (process.env.REACT_APP_API_BASE || '').replace('/api', '')

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      background: 'linear-gradient(90deg, rgba(2,6,23,1) 0%, rgba(4,10,24,1) 100%)'
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <Link to="/user" style={{ fontWeight:800, fontSize:18, color: 'var(--accent)' }}>PolicyPlatform</Link>
        <nav style={{ display:'flex', gap:10 }}>
          <Link to="/user" style={{ color:'#cfe8d8' }}>Home</Link>
          <Link to="/policies" style={{ color:'#cfe8d8' }}>Policies</Link>
          <Link to="/pending" style={{ color:'#cfe8d8' }}>Pending</Link>
          <Link to="/quiz" style={{ color:'#cfe8d8' }}>Quiz</Link>
          {user?.role === 'ADMIN' && <Link to="/admin" style={{ color:'#cfe8d8' }}>Admin</Link>}
        </nav>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ textAlign:'right', marginRight:8 }}>
          <div style={{ fontWeight:700 }}>{user?.name || 'Guest'}</div>
          <div style={{ fontSize:12, color:'var(--muted)' }}>{user?.companyEmail || ''}</div>
        </div>

        <img
          src={ user?.profilePicPath ? `${apiBase}/${user.profilePicPath}` : 'https://via.placeholder.com/44' }
          alt="profile"
          width="44"
          height="44"
          style={{ borderRadius:10, objectFit:'cover', border: '1px solid rgba(255,255,255,0.03)' }}
          onClick={() => nav('/user')}
        />

        <button
          onClick={logout}
          className="btn"
          style={{ background:'#ef4444', color:'white', padding:'8px 10px', borderRadius:8 }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
