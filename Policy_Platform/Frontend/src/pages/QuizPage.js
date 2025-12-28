import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { status, current, submit } from '../api/quiz.js'

export default function QuizPage(){
  const [st, setSt] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState([])
  const [message, setMessage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const nav = useNavigate()

  useEffect(()=>{ loadStatus() },[])
  const loadStatus = async ()=> { const { data } = await status(); setSt(data) }

  const start = async ()=> {
    const { data } = await current()
    setQuiz(data)
    setAnswers(Array(data.questions.length).fill(null))
  }

  const submitQuiz = async ()=> {
    const { data } = await submit(answers)
    setMessage(data.passed ? `✅ Passed (score ${data.score})` : `❌ Failed (score ${data.score})`)
    await loadStatus()
    setQuiz(null)
  }

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
      gap:'12px',
      alignItems: open ? 'flex-start' : 'center',
      minHeight:'100vh'
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
    },
    card:{
      background:'#fff',
      padding:'18px 22px',
      borderRadius:'12px',
      boxShadow:'0 4px 12px rgba(0,0,0,0.08)',
      marginTop:'12px'
    },
    btn:(primary=true)=>({
      background: primary ? '#2563eb' : '#64748b',
      color:'#fff',
      border:'none',
      padding:'8px 16px',
      borderRadius:'8px',
      fontSize:'14px',
      fontWeight:600,
      cursor:'pointer',
      transition:'background 0.2s ease'
    })
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

      {/* Main Content */}
      <div style={styles.main}>
        <h2 style={{marginBottom:'20px',color:'#1e293b',fontSize:'24px',fontWeight:700}}>Quiz</h2>

        {/* Status card */}
        <div style={{...styles.card,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{color:'#475569',fontSize:'14px'}}>
              Last attempt: {st?.lastAttemptAt ? new Date(st.lastAttemptAt).toLocaleString() : '—'}
            </div>
            <div style={{color:'#475569',fontSize:'14px'}}>
              Prev score: {st?.previousScore ?? '—'}
            </div>
          </div>
          <div>
            <button 
              style={styles.btn(true)} 
              onClick={start} 
              disabled={!st?.canStart}
              onMouseOver={e=>e.currentTarget.style.background="#1e40af"}
              onMouseOut={e=>e.currentTarget.style.background="#2563eb"}
            >
              Start test
            </button>
            <button 
              style={{...styles.btn(false),marginLeft:8}} 
              onClick={start} 
              disabled={!st?.canRetake}
              onMouseOver={e=>e.currentTarget.style.background="#475569"}
              onMouseOut={e=>e.currentTarget.style.background="#64748b"}
            >
              Retake
            </button>
          </div>
        </div>

        {/* Quiz area */}
        {quiz && (
          <div style={{marginTop:12}}>
            {quiz.questions.map((q, i)=>(
              <div key={i} style={styles.card}>
                <div style={{fontWeight:700,fontSize:'16px',color:'#0f172a'}}>{i+1}. {q.q}</div>
                <div style={{marginTop:8}}>
                  {q.options.map((opt, oi)=>(
                    <label 
                      key={oi} 
                      style={{
                        display:'block',
                        marginTop:6,
                        padding:'6px 10px',
                        borderRadius:'8px',
                        background: answers[i]===oi ? '#dbeafe' : 'transparent',
                        cursor:'pointer',
                        transition:'background 0.2s ease'
                      }}
                    >
                      <input 
                        type="radio" 
                        name={`q${i}`} 
                        checked={answers[i]===oi} 
                        onChange={()=>setAnswers(a=>{const b=[...a]; b[i]=oi; return b})} 
                        style={{marginRight:'8px'}}
                      /> 
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div style={{marginTop:12}}>
              <button 
                style={styles.btn(true)} 
                onClick={submitQuiz}
                onMouseOver={e=>e.currentTarget.style.background="#1e40af"}
                onMouseOut={e=>e.currentTarget.style.background="#2563eb"}
              >
                Submit
              </button>
              {message && (
                <div style={{marginTop:12,fontSize:'15px',fontWeight:600,color: message.startsWith("✅") ? "green" : "red"}}>
                  {message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
