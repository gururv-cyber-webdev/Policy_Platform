import React from 'react'
import Sidebar from '../components/Sidebar.js'
import { downloadReport } from '../api/users.js'

export default function Reports(){
  return (
    <div style={{display:'flex'}}>
      <Sidebar />
      <div className="main container">
        <h2>Download report</h2>
        <div className="card">
          <a className="btn" href={downloadReport()} target="_blank">Download CSV</a>
          <div className="muted" style={{marginTop:8}}>This downloads view logs for building dashboards offline.</div>
        </div>
      </div>
    </div>
  )
}
