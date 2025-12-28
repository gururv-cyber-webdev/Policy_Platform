import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../api/auth.js';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    employeeId: '',
    dateOfJoining: '',
    companyEmail: '',
    password: '',
    q1: '',
    a1: '',
    q2: '',
    a2: ''
  });

  const [idProof, setIdProof] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const update = key => e => setForm(s => ({ ...s, [key]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');

    if (!form.name.trim() || !form.companyEmail.trim() || !form.password.trim()) {
      setMsg('Name, email, and password are required');
      return;
    }

    try {
      const fd = new FormData();
      const payload = {
        name: form.name.trim(),
        age: form.age ? Number(form.age) : undefined,
        employeeId: form.employeeId.trim() || undefined,
        dateOfJoining: form.dateOfJoining || undefined,
        companyEmail: form.companyEmail.trim(),
        password: form.password,
        securityQuestions: [
          { question: form.q1 || 'Q1', answer: form.a1 || 'A1' },
          { question: form.q2 || 'Q2', answer: form.a2 || 'A2' }
        ]
      };

      fd.append('data', JSON.stringify(payload));
      if (idProof) fd.append('idProof', idProof);
      if (profilePic) fd.append('profilePic', profilePic);

      const { data } = await apiRegister(fd);
      alert(data.message);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setMsg(err.response?.data?.message || 'Registration failed');
    }
  };

  // Shared styles
  const inputStyle = {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    transition: 'border 0.2s',
  };

  const inputFocus = e => (e.target.style.border = '1px solid #2563eb');
  const inputBlur = e => (e.target.style.border = '1px solid #cbd5e1');

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #2c3e50, #4ca1af)', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{
        width: '100%',
        maxWidth: 900,
        background: '#fff',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ marginBottom: '8px', fontSize: '28px', color: '#1e293b', fontWeight: 700 }}>Register</h2>
        <p style={{ marginBottom: '20px', color: '#475569', fontSize: '14px' }}>Fill in the details to create your account</p>

        <form 
          onSubmit={handleSubmit} 
          style={{ 
            display: 'grid', 
            gap: '14px', 
            gridTemplateColumns: '1fr 1fr' 
          }}
        >
          <input placeholder="Name" value={form.name} onChange={update('name')} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>
          <input placeholder="Age" value={form.age} onChange={update('age')} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>
          <input placeholder="Employee ID" value={form.employeeId} onChange={update('employeeId')} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>
          <input type="date" value={form.dateOfJoining} onChange={update('dateOfJoining')} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>
          <input placeholder="Company Email" value={form.companyEmail} onChange={update('companyEmail')} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>
          <input type="password" placeholder="Password" value={form.password} onChange={update('password')} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>
          <input placeholder="Security Question 1" value={form.q1} onChange={update('q1')} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>
          <input placeholder="Answer 1" value={form.a1} onChange={update('a1')} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>
          <input placeholder="Security Question 2" value={form.q2} onChange={update('q2')} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>
          <input placeholder="Answer 2" value={form.a2} onChange={update('a2')} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}/>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
  <label style={{ fontSize: '13px', color: '#475569' }}>Company ID Proof</label>
  <input 
    type="file" 
    onChange={e => setIdProof(e.target.files[0])} 
    style={{
      fontSize: '13px',
      padding: '6px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
       background: 'linear-gradient(135deg, #2c3e50, #4ca1af)',
      color: '#475569',
      cursor: 'pointer'
    }} 
  />
</div>

<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
  <label style={{ fontSize: '13px', color: '#475569' }}>Profile Picture</label>
  <input 
    type="file" 
    onChange={e => setProfilePic(e.target.files[0])} 
    style={{
      fontSize: '13px',
      padding: '6px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
       background: 'linear-gradient(135deg, #2c3e50, #4ca1af)',
      color: '#475569',
      cursor: 'pointer'
    }} 
  />
</div>


          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <button 
              style={{
                 background: 'linear-gradient(135deg, #2c3e50, #4ca1af)',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(135deg, #2c3e50, #4ca1af)'}
              onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(135deg, #2c3e50, #4ca1af)'}
            >
              Submit
            </button>
            <div style={{ fontSize: '13px', color: '#64748b' }}>After submit, wait for admin approval to login.</div>
          </div>
        </form>

        {msg && <div style={{ color: '#dc2626', marginTop: 12, fontSize: '14px', fontWeight: 500 }}>{msg}</div>}
      </div>
    </div>
  );
}
