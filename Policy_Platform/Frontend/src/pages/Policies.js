import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTree } from '../api/policies.js'
import PolicyCard from '../components/PolicyCard.js'
import SearchBar from './SearchBar.js'

export default function Policies() {
  const [tree, setTree] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const nav = useNavigate()

  useEffect(() => { load() }, [])
  const load = async () => {
    const { data } = await getTree()
    setTree(data)
  }

  const openFromSearch = (id) => window.location.href = `/policies/${id}`

  // 🔹 Styles
  const styles = {
    sidebar: (open) => ({
      width: open ? 200 : 60,
      background: '#2c3e50',
      color: '#fff',
      padding: open ? '16px 12px' : '16px 6px',
      transition: 'width 0.3s',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      alignItems: open ? 'flex-start' : 'center',
      minHeight: '100vh'
    }),
    sideItem: {
      cursor: 'pointer',
      fontWeight: 500,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    main: {
      flex: 1,
      padding: '30px',
      background: '#f8fafc',
      fontFamily: 'Segoe UI, sans-serif'
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* Sidebar */}
      <div style={styles.sidebar(sidebarOpen)}>
        <div
          style={{ cursor: 'pointer', marginBottom: '10px' }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? '⏴' : '⏵'}
        </div>
        <div style={styles.sideItem} onClick={() => nav('/user')}>🏠 {sidebarOpen && 'Dashboard'}</div>
        <div style={styles.sideItem} onClick={() => nav('/policies')}>📄 {sidebarOpen && 'View Policies'}</div>
        <div style={styles.sideItem} onClick={() => nav('/pending')}>⏳ {sidebarOpen && 'Pending Policies'}</div>
        <div style={styles.sideItem} onClick={() => nav('/quiz')}>📝 {sidebarOpen && 'Quiz'}</div>
      </div>

      {/* Main content */}
      <div style={styles.main}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>Policies</h2>
          
        </div>

        {/* Search Bar */}
        <div style={{ marginTop: 16 }}>
          <SearchBar onPick={openFromSearch} />
        </div>

        {/* Policies grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginTop: 20
        }}>
          {tree.filter(x => x.type === 'FILE').map(p =>
            <PolicyCard
              key={p._id}
              p={p}
              onOpen={(id) => window.location.href = `/policies/${id}`}
            />
          )}
        </div>

      </div>
    </div>
  )
}
