import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as apiLogin } from '../api/auth.js'
import useAuth from '../hooks/useAuth.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [focused, setFocused] = useState(null) // track which input is focused
  const [btnHover, setBtnHover] = useState(false) // track button hover
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setErr('')
    try {
      const { data } = await apiLogin(email, password)
      login(data.token, data.user)
      if (data.user.role === 'ADMIN') nav('/admin')
      else nav('/user')
    } catch (err) {
      setErr(err.response?.data?.message || 'Login failed')
    }
  }

  // ========= STYLES =========
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2c3e50, #4ca1af)',
      fontFamily: 'Segoe UI, sans-serif',
    },
    card: {
      width: 400,
      background: '#fff',
      padding: '32px 28px',
      borderRadius: 12,
      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
      textAlign: 'center',
    },
    title: { margin: 0, fontSize: 26, fontWeight: 600, color: '#2c3e50' },
    muted: { color: '#6b7280', fontSize: 14, marginTop: 6 },
    form: { marginTop: 20, display: 'grid', gap: 14 },
    input: isFocused => ({
      padding: '12px 14px',
      border: '1px solid #d1d5db',
      borderRadius: 8,
      fontSize: 15,
      outline: 'none',
      transition: 'border 0.2s, box-shadow 0.2s',
      ...(isFocused && {
        border: '1px solid #4ca1af',
        boxShadow: '0 0 0 3px rgba(76,161,175,0.25)',
      }),
    }),
    btn: {
      padding: '12px',
      border: 'none',
      borderRadius: 8,
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      background: 'linear-gradient(135deg, #2c3e50, #4ca1af)',
      color: '#fff',
      transition: 'background 0.2s',
    },
    secondary: {
      background: '#e5e7eb',
      color: '#111827',
      fontWeight: 500,
    },
    error: { color: '#dc2626', marginTop: 10, fontSize: 14 },
    footer: {
      marginTop: 16,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 14,
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign in</h2>
        <div style={styles.muted}>Use your company email</div>

        <form onSubmit={submit} style={styles.form}>
          <input
            style={styles.input(focused === 'email')}
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
          />
          <input
            style={styles.input(focused === 'password')}
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocused('password')}
            onBlur={() => setFocused(null)}
          />
          <button
            type="submit"
            style={styles.btn}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            Sign in
          </button>
        </form>

        {err && <div style={styles.error}>{err}</div>}

        <div style={styles.footer}>
          <div style={styles.muted}>New user?</div>
          <Link to="/register">
            <button style={{ ...styles.btn, ...styles.secondary }}>
              Register now
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
