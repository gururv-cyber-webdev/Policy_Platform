import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPolicy, ackPolicy } from '../api/policies.js'
import { ask } from '../api/ai.js'

export default function PolicyDetails() {
  const { id } = useParams()
  const [policy, setPolicy] = useState(null)
  const [q, setQ] = useState('')
  const [ans, setAns] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const nav = useNavigate()

  useEffect(() => { if (id) load() }, [id])
  const load = async () => {
    const { data } = await getPolicy(id)
    setPolicy(data)
    try {
      await ackPolicy(id) // auto mark as read
    } catch (e) {
      console.error('Failed to mark read', e)
    }
  }

  const markRead = async () => {
    await ackPolicy(id)
    alert('Marked as read')
  }

  const askAI = async () => {
    if (!q.trim()) return
    const { data } = await ask(q, policy?.content || '')
    setAns(data.answer)
  }

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
      alignItems: open ? 'flex-start' : 'center'
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

  if (!policy) return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={styles.sidebar(sidebarOpen)}>
        <div style={{ cursor: 'pointer', marginBottom: '10px' }} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '⏴' : '⏵'}
        </div>
        <div style={styles.sideItem} onClick={() => nav('/user')}>🏠 {sidebarOpen && 'Dashboard'}</div>
        <div style={styles.sideItem} onClick={() => nav('/policies')}>📄 {sidebarOpen && 'View Policies'}</div>
        <div style={styles.sideItem} onClick={() => nav('/pending')}>⏳ {sidebarOpen && 'Pending Policies'}</div>
        <div style={styles.sideItem} onClick={() => nav('/quiz')}>📝 {sidebarOpen && 'Quiz'}</div>
      </div>

      <div style={styles.main}>
        <div style={{ color: '#64748b', fontSize: '15px' }}>Loading...</div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={styles.sidebar(sidebarOpen)}>
        <div style={{ cursor: 'pointer', marginBottom: '10px' }} onClick={() => setSidebarOpen(!sidebarOpen)}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>{policy.name}</h2>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              v{policy.currentVersion} • Last updated: {new Date(policy.lastUpdatedAt).toLocaleString()}
            </div>
          </div>
          <button
            onClick={markRead}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={e => e.currentTarget.style.background = "#1e40af"}
            onMouseOut={e => e.currentTarget.style.background = "#2563eb"}
          >
            Acknowledge
          </button>
        </div>

        {/* Policy content */}
        <div style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.6,
          fontSize: '15px',
          color: '#334155',
          marginBottom: '20px'
        }}>
          {policy.content || '—'}
        </div>

        {/* AI Assistant */}
        <div style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#1e293b' }}>AI Assistant</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Ask about this policy..."
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "#cbd5e1"}
            />
            <button
              onClick={askAI}
              style={{
                background: '#10b981',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseOver={e => e.currentTarget.style.background = "#059669"}
              onMouseOut={e => e.currentTarget.style.background = "#10b981"}
            >
              Ask
            </button>
          </div>
          {ans && (
            <div style={{
              marginTop: '16px',
              padding: '14px',
              borderRadius: '8px',
              background: '#f1f5f9',
              fontSize: '14px',
              color: '#334155',
              lineHeight: 1.5
            }}>
              {ans}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
