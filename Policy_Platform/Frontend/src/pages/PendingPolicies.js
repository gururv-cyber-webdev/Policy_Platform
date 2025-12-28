import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPending } from '../api/policies.js'


export default function PendingPolicies(){
  
  const [list, setList] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const nav = useNavigate()

  useEffect(()=>{ load() },[])
  const load = async ()=> {
    const { data } = await getPending()
    setList(data)
  }

  const open = id => window.location.href = `/policies/${id}`

  const styles = {
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
    main:{
      flex:1,
      padding:'30px',
      background:'#f8fafc',
      fontFamily:'Segoe UI, sans-serif'
    }
  }

  return (
    
    <div style={{display:'flex',minHeight:'100vh'}}>
      
      {/* Sidebar */}
      <div style={styles.sidebar(sidebarOpen)}>
        <div 
          style={{cursor:'pointer',marginBottom:'10px'}}
          onClick={()=>setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? '⏴' : '⏵'}
        </div>
        <div style={styles.sideItem} onClick={()=>nav('/user')}>🏠 {sidebarOpen && 'Dashboard'}</div>
        <div style={styles.sideItem} onClick={()=>nav('/policies')}>📄 {sidebarOpen && 'View Policies'}</div>
        <div style={styles.sideItem} onClick={()=>nav('/pending')}>⏳ {sidebarOpen && 'Pending Policies'}</div>
        <div style={styles.sideItem} onClick={()=>nav('/quiz')}>📝 {sidebarOpen && 'Quiz'}</div>
      </div>

      {/* Main content */}
      <div style={styles.main}>
        <h2 style={{marginBottom:'20px',color:'#1e293b',fontSize:'24px',fontWeight:700}}>
          Pending Policies
        </h2>
        
        <div style={{marginTop:12,display:'grid',gap:'16px'}}>
          {!list.length && (
            <div style={{
              background:'#f1f5f9',
              border:'1px dashed #94a3b8',
              padding:'20px',
              borderRadius:'12px',
              color:'#475569',
              textAlign:'center',
              fontSize:'15px'
            }}>
              No pending policies — you're up to date 👍
            </div>
          )}

          {list.map(p => (
            <div key={p._id} style={{
              display:'flex',
              justifyContent:'space-between',
              alignItems:'center',
              padding:'18px 22px',
              borderRadius:'12px',
              background:'#ffffff',
              boxShadow:'0 4px 12px rgba(0,0,0,0.08)',
              transition:'transform 0.2s ease, box-shadow 0.2s ease',
              cursor:'pointer'
            }}
            onMouseOver={e=>{
              e.currentTarget.style.transform="translateY(-3px)"
              e.currentTarget.style.boxShadow="0 6px 16px rgba(0,0,0,0.12)"
            }}
            onMouseOut={e=>{
              e.currentTarget.style.transform="translateY(0px)"
              e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)"
            }}
            >
              <div>
                <div style={{fontWeight:700,fontSize:'16px',color:'#0f172a'}}>{p.name}</div>
                <div style={{color:'#64748b',fontSize:'14px',marginTop:'4px'}}>
                  v{p.currentVersion} • {new Date(p.lastUpdatedAt).toLocaleString()}
                </div>
              </div>
              <div>
                <button 
                  onClick={()=>open(p._id)}
                  style={{
                    background:'#2563eb',
                    color:'#fff',
                    border:'none',
                    padding:'8px 16px',
                    borderRadius:'8px',
                    fontSize:'14px',
                    fontWeight:600,
                    cursor:'pointer',
                    transition:'background 0.2s ease'
                  }}
                  onMouseOver={e=>e.currentTarget.style.background="#1e40af"}
                  onMouseOut={e=>e.currentTarget.style.background="#2563eb"}
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
