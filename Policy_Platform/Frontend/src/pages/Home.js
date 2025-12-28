import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import QuizCard from '../components/QuizCard.js'
import { status as quizStatusApi } from '../api/quiz.js'
import { getTree, getReadPolicies, getCompanyStats } from '../api/policies.js'

export default function Home(){
  const { user } = useAuth()
   const { logout } = useAuth();

  const nav = useNavigate()
  const [quizStatus, setQuizStatus] = useState(null)
  const [stats, setStats] = useState({ totalPolicies: 0, readByUser: 0, companyAvg: 0 })
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(()=>{
    document.title = 'Home — Policy Platform'
    load()
  },[])

  async function load(){
    try {
      const [qRes, treeRes, readRes, companyRes] = await Promise.all([
        quizStatusApi(),
        getTree(),
        getReadPolicies(),
        getCompanyStats()
      ])

      setQuizStatus(qRes.data)

      const all = treeRes.data || []
      const files = all.filter(p => p.type === 'FILE')
      const readByUser = readRes.data.length
      const avg = companyRes.data.reduce((acc, c) => acc + c.avg, 0) / (companyRes.data.length || 1)

      setStats({
        totalPolicies: files.length,
        readByUser,
        companyAvg: Math.round(avg)
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleStart = () => nav('/quiz')
  const handleRetake = () => nav('/quiz')

  // styles for layout
  const styles = {
    layout: { display:'flex', minHeight:'100vh', width:'100%', fontFamily:'Segoe UI, sans-serif' },
    navbar: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', borderBottom:'1px solid #ddd' },
    sidebar: (open)=>({
  width: open ? 200 : 60,
  background:'#2c3e50',
  color:'#fff',
  padding: open ? '16px 12px' : '16px 6px',
  transition:'width 0.3s',
  flexShrink:0,
  display:'flex',
  flexDirection:'column',
  gap:'12px',   // this alone gives 1 line space
  alignItems: open ? 'flex-start' : 'center'
}),
sideItem:{
  cursor:'pointer',
  fontWeight:500,
  whiteSpace:'nowrap',
  overflow:'hidden',
  textOverflow:'ellipsis'
},
    container:{ flex:1, minWidth:0, padding:'24px 40px', background:'#f6f8fa', color:'#24292f', boxSizing:'border-box' },
    card:{ background:'#fff', border:'1px solid #d0d7de', borderRadius:8, padding:16, boxShadow:'0 1px 3px rgba(27,31,35,0.1)', marginBottom:16, width:'100%' },
    muted:{ color:'#6e7781', fontSize:13 },
    btn:{ padding:'6px 12px', borderRadius:6, border:'none', cursor:'pointer', fontSize:14, fontWeight:500, background:'#0969da', color:'#fff', marginLeft:8 }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={{ fontWeight:600 }}>Policy Platform</div>
        <div>
          <span style={{ marginRight:12 }}>{user?.name || 'User'}</span>
          <button style={styles.btn} onClick={()=>nav('/user')}>Profile</button>
          <button style={{...styles.btn, background:'#cf222e'}} onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={styles.layout}>
        {/* SIDEBAR */}
        <div style={styles.sidebar(sidebarOpen)}>
          <div style={{ marginBottom:20, cursor:'pointer' }} onClick={()=>setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '⏴' : '⏵'}
          </div>
          <div style={styles.sideItem} onClick={()=>nav('/user')}>🏠 {sidebarOpen && 'Dashboard'}</div>
          <div style={styles.sideItem} onClick={()=>nav('/policies')}>📄 {sidebarOpen && 'View Policies'}</div>
          <div style={styles.sideItem} onClick={()=>nav('/pending')}>⏳ {sidebarOpen && 'Pending Policies'}</div>
          <div style={styles.sideItem} onClick={()=>nav('/quiz')}>📝 {sidebarOpen && 'Quiz'}</div>
        </div>

        {/* MAIN CONTENT */}
        <main style={styles.container}>
          <div style={{ display:'grid', gap:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <h1 style={{ margin:0 }}>Welcome back, {user?.name || 'User'}</h1>
                <div style={styles.muted}>
                  Last visited: {user?.lastVisitedAt ? new Date(user.lastVisitedAt).toLocaleString() : '—'}
                </div>
              </div>

              <div style={{ width:400 }}>
                <QuizCard status={quizStatus} onStart={handleStart} onRetake={handleRetake} />
              </div>
            </div>

            <div style={styles.card}>
              <h3>Policy Reading Stats</h3>
              <div style={{ ...styles.muted, marginTop:8 }}>
                You have read {stats.readByUser}/{stats.totalPolicies} policies since the last update.
              </div>

              <div style={{ marginTop:12 }}>
                <div style={{ display:'flex', gap:8 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700 }}>{stats.readByUser}</div>
                    <div style={styles.muted}>You've read</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700 }}>{stats.companyAvg}</div>
                    <div style={styles.muted}>Company avg %</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700 }}>{stats.totalPolicies}</div>
                    <div style={styles.muted}>Total policies</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
