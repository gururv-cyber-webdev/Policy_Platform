import React from 'react'

export default function QuizCard({ status = {}, onStart, onRetake }) {
  // status fields expected: { status, previousScore, lastAttemptAt, canStart, canRetake }
  const last = status?.lastAttemptAt ? new Date(status.lastAttemptAt).toLocaleString() : '—'
  const score = status?.previousScore ?? '—'
  const st = status?.status ?? 'NOT_ATTEMPTED'

  const cardStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderRadius: '12px',
    background: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'default'
  }

  const statusColor =
    st === 'PASSED' ? '#22c55e' : st === 'FAILED' ? '#ef4444' : '#f59e0b'

  const btnBase = {
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s ease, transform 0.2s ease'
  }

  const btnPrimary = {
    ...btnBase,
    background: '#2563eb',
    color: '#fff'
  }

  const btnSecondary = {
    ...btnBase,
    background: '#64748b',
    color: '#fff'
  }

  return (
    <div
      style={cardStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
      }}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#0f172a' }}>📝 Quiz</div>
        <div style={{ marginTop: 8, fontSize: 14, color: '#475569' }}>
          Status:{' '}
          <strong style={{ color: statusColor, fontWeight: 700 }}>{st}</strong>
        </div>
        <div style={{ marginTop: 6, fontSize: 14, color: '#475569' }}>
          Last attempt: {last}
        </div>
        <div style={{ marginTop: 6, fontSize: 14, color: '#475569' }}>
          Previous score: <span style={{ fontWeight: 600 }}>{score}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={onStart}
          disabled={!status?.canStart}
          style={{
            ...btnPrimary,
            opacity: status?.canStart ? 1 : 0.5
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = status?.canStart ? '#1e40af' : '#2563eb')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = '#2563eb')
          }
        >
          Start test
        </button>

        <button
          onClick={onRetake}
          disabled={!status?.canRetake}
          style={{
            ...btnSecondary,
            opacity: status?.canRetake ? 1 : 0.5
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = status?.canRetake ? '#475569' : '#64748b')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = '#64748b')
          }
        >
          Retake
        </button>
      </div>
    </div>
  )
}
