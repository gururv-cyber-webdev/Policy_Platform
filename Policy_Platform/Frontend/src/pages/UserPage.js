import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.js'
import useAuth from '../hooks/useAuth.js'
import { status } from '../api/quiz.js'

export default function UserPage(){
  const { user } = useAuth()
  const [st, setSt] = useState(null)
  useEffect(()=>{ status().then(r=>setSt(r.data)) },[])

  return (
    <div style={{display:'flex'}}>
      <Sidebar />
      <div className="main container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h2>Welcome, {user?.name}</h2>
            <div className="muted">Last visited: {user?.lastVisitedAt ? new Date(user.lastVisitedAt).toLocaleString() : '—'}</div>
          </div>
        </div>

        <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 320px',gap:12}}>
          <div className="card">
            <h3>Policy Reading Stats</h3>
            <div className="muted">You can view progress charts here (sample)</div>
            <div style={{marginTop:12}}>
              <div className="muted">Your quiz status: {st?.status ?? '—'}</div>
            </div>
          </div>

          <div>
            <div className="card">
              <div style={{fontWeight:700}}>Profile</div>
              <div className="muted">{user?.companyEmail}</div>
              <div className="muted" style={{marginTop:8}}>Quiz: {st?.status ?? '—'}</div>
            </div>
            <div className="card" style={{marginTop:12}}>
              <h3>Quick Actions</h3>
              <div style={{display:'flex',gap:8}}>
                <button className="btn" onClick={()=>window.location.href='/policies'}>View Policies</button>
                <button className="btn secondary" onClick={()=>window.location.href='/quiz'}>Go to Quiz</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
