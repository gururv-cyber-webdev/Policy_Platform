import React from 'react'

export default function PolicyCard({ p, onOpen }) {
  return (
    <div 
      style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 18px',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        marginBottom: '12px',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)'}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>{p.name}</div>
        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
          v{p.currentVersion} • {p.type}
        </div>
      </div>

      <div>
        <button 
          onClick={() => onOpen(p._id)}
          style={{
            padding: '6px 14px',
            fontSize: '13px',
            borderRadius: '8px',
            border: '1px solid #3b82f6',
            backgroundColor: '#3b82f6',
            color: '#fff',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.borderColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
        >
          Open
        </button>
      </div>
    </div>
  )
}
