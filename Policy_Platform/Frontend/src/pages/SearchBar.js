// small search bar used in Policies.jsx
import React, { useState } from 'react'
import { searchPolicies } from '../api/policies.js'

export default function SearchBar({ onPick }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])

  const doSearch = async (e) => {
    e?.preventDefault()
    if (!q.trim()) return
    const { data } = await searchPolicies(q)
    setResults(data)
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      {/* Search box */}
      <form 
        onSubmit={doSearch} 
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "#f9f9f9",
          padding: "10px",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        <input 
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
            outline: "none",
            transition: "0.2s",
          }}
          onFocus={(e)=> e.target.style.border = "1px solid #007bff"}
          onBlur={(e)=> e.target.style.border = "1px solid #ccc"}
          placeholder="🔍 Search policies..." 
          value={q} 
          onChange={e=>setQ(e.target.value)} 
        />
        <button 
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "0.2s",
          }}
          onMouseEnter={(e)=> e.target.style.background = "#0056b3"}
          onMouseLeave={(e)=> e.target.style.background = "#007bff"}
        >
          Search
        </button>
      </form>

      {/* Results */}
      <div style={{ marginTop: "15px" }}>
        {results.map(r => (
          <div 
            key={r.id} 
            style={{
              marginTop: "12px",
              padding: "14px",
              borderRadius: "12px",
              background: "#ffffff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              transition: "0.3s",
            }}
          >
            <div style={{ fontWeight: "700", fontSize: "16px", color: "#333" }}>
              {r.name} <span style={{ color: "#777", fontWeight: "400" }}>({r.type})</span>
            </div>
            <div style={{ marginTop: "6px", color: "#666", fontSize: "14px" }}>
              {r.snippet}...
            </div>
            <div style={{ marginTop: "10px" }}>
              <button 
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "0.2s",
                }}
                onMouseEnter={(e)=> e.target.style.background = "#1e7e34"}
                onMouseLeave={(e)=> e.target.style.background = "#28a745"}
                onClick={()=>onPick(r.id)}
              >
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
