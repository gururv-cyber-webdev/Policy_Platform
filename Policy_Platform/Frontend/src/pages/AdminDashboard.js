import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth.js'
import { unapproved, approveUser, getUserStats } from '../api/users.js'
import { getTree, createPolicy, updatePolicy, deletePolicy } from '../api/policies.js'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard(){
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [tree, setTree] = useState([])
  const [selected, setSelected] = useState(null)
  const [name, setName] = useState(''), [type, setType] = useState('FOLDER'), [content, setContent] = useState('')
  const [userStats, setUserStats] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("policies") // default view

  useEffect(()=>{ load() },[])
  const load = async ()=> {
    const u = await unapproved(); setUsers(u.data)
    const t = await getTree(); setTree(t.data)
    const stats = await getUserStats(); setUserStats(stats.data)
  }

  const approve = async (id) => { await approveUser(id); await load() }
  const add = async ()=> { await createPolicy({ name, type, parentId: null, content }); setName(''); setContent(''); await load() }
  const save = async ()=> { if (!selected) return; await updatePolicy(selected._id, { name: selected.name, content }); await load(); alert('Saved'); window.location.reload(); }
  const remove = async (id) => { if (!window.confirm('Delete?')) return; await deletePolicy(id); await load() }

  // ======= Inline styles =======
  const styles = {
    layout: { display:"flex", minHeight:"100vh", width:"100vw", fontFamily:"Segoe UI, sans-serif", margin:0, padding:0, boxSizing:"border-box", flexDirection:"column" },
    navbar: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 20px", borderBottom:"1px solid #ddd" },
    
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
    container: { flex:1, minWidth:0, padding:"24px 32px", background:"#f6f8fa", color:"#24292f", boxSizing:"border-box", height:"100vh", overflowY:"auto" },
    header: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 },
    card: { background:"#fff", border:"1px solid #d0d7de", borderRadius:8, padding:16, boxShadow:"0 1px 3px rgba(27,31,35,0.1)", marginBottom:16, width:"100%" },
    btn: { padding:"8px 16px", borderRadius:6, border:"none", cursor:"pointer", fontSize:14, fontWeight:500, background:"#0969da", color:"#fff" },
    btnDanger: { background:"#cf222e", color:"#fff" },
    btnWarn: { background:"#0969da", color:"#fff" },
    input: { width:"100%", padding:10, border:"1px solid #d0d7de", borderRadius:6, marginTop:8 },
    textarea: { width:"100%", padding:10, border:"1px solid #d0d7de", borderRadius:6, marginTop:8 },
    muted: { color:"#6e7781", fontSize:13 },
    item: { display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8, padding:8, border:"1px solid #eaeef2", borderRadius:6, background:"#f9fafb" },
    policyName: { cursor:"pointer", fontWeight:500, color:"#0969da" },
    table: { width:"100%", borderCollapse:"collapse", marginTop:12 },
    th: { padding:10, textAlign:"left", borderBottom:"1px solid #d0d7de", background:"#f6f8fa", fontWeight:600 },
    td: { padding:10, textAlign:"left", borderBottom:"1px solid #d0d7de" }
  }

  // ---- MAIN CONTENT SWITCH ----
  const renderContent = () => {
    if (activeSection === "policies") {
      return (
        <>
          <div style={styles.card}>
            <h3>Policies</h3>
            <div style={styles.muted}>Click an item to edit</div>
            {tree.map(p => (
              <div key={p._id} style={styles.item}>
                <div style={styles.policyName} onClick={()=>{ setSelected(p); setContent(p.content || '') }}>
                  {p.type==='FOLDER'?'📁':'📄'} {p.name}
                </div>
                <button style={{ ...styles.btn, ...styles.btnWarn }} onClick={()=>remove(p._id)}>Delete</button>
              </div>
            ))}
          </div>

          <div style={styles.card}>
            <h3>Create policy</h3>
            <input style={styles.input} placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
            <select style={styles.input} value={type} onChange={e=>setType(e.target.value)}><option>FOLDER</option><option>FILE</option></select>
            {type==='FILE' && <textarea style={styles.textarea} rows="6" value={content} onChange={e=>setContent(e.target.value)} />}
            <button style={{ ...styles.btn, marginTop: 8 }} onClick={add}>Add</button>
          </div>

          <div style={styles.card}>
            <h3>Edit</h3>
            {selected ? (
              <>
                <div style={styles.muted}>Selected: {selected.name} ({selected.type})</div>
                <input style={styles.input} value={selected.name} onChange={e=>setSelected(s=>({...s, name: e.target.value}))} />
                {selected.type === 'FILE' && <textarea style={styles.textarea} rows="10" value={content} onChange={e=>setContent(e.target.value)} />}
                <button style={{ ...styles.btn, marginTop: 8 }} onClick={save}>Save</button>
                <button style={{ ...styles.btn, marginTop: 8 }} onClick={()=>window.location.reload()}>Cancel</button>
              </>
            ) : <div style={styles.muted}>Select a policy to edit</div>}
          </div>
        </>
      )
    }
    if (activeSection === "unapproved") {
      return (
        <div style={styles.card}>
          <h3>Unapproved users</h3>
          {!users.length && <div style={styles.muted}>No new registrations</div>}
          {users.map(u => (
            <div key={u._id} style={styles.item}>
              <div>
                <div style={{ fontWeight: 700 }}>{u.name}</div>
                <div style={styles.muted}>{u.companyEmail}</div>
              </div>
              <button style={styles.btn} onClick={()=>approve(u._id)}>Approve</button>
            </div>
          ))}
        </div>
      )
    }
    if (activeSection === "stats") {
      return (
        <div style={styles.card}>
          <h3>User Stats</h3>
          {!userStats.length && <div style={styles.muted}>No data</div>}
          {userStats.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Time Spent (mins)</th>
                  <th style={styles.th}>Visits after update</th>
                  <th style={styles.th}>Quiz Score</th>
                </tr>
              </thead>
              <tbody>
                {userStats.map(u => (
                  <tr key={u.id}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{u.timeSpent}</td>
                    <td style={styles.td}>{u.visits}</td>
                    <td style={styles.td}>{u.quizScore ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )
    }
  }

  return (
    <div style={styles.layout}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={{ fontWeight:600 }}>Policy Platform</div>
        <div>
          <span style={{ marginRight:12 }}>Admin</span>
          <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={{ display:"flex", flex:1 }}>
        {/* Sidebar */}
        <div style={styles.sidebar(sidebarOpen)}>
          <button
            onClick={()=>setSidebarOpen(!sidebarOpen)}
            style={{ background:"transparent", border:"none", color:"#fff", cursor:"pointer", marginBottom:20 }}
          >
            {sidebarOpen ? "⏴" : "⏵"}
          </button>
          <div style={styles.sideItem} onClick={()=>setActiveSection("policies")}>📄 {sidebarOpen && "Policies"}</div>
          <div style={styles.sideItem} onClick={()=>setActiveSection("unapproved")}>👥 {sidebarOpen && "Unapproved Users"}</div>
          <div style={styles.sideItem} onClick={()=>setActiveSection("stats")}>📊 {sidebarOpen && "User Stats"}</div>
        </div>

        {/* Main Content */}
        <div style={styles.container}>
          <div style={styles.header}>
            <h2>
              {activeSection === "policies" ? "Policies" : activeSection === "unapproved" ? "Unapproved Users" : "User Stats"}
            </h2>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
