import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check credentials
    if (email === 'infoniict3@gmail.com' && password === 'Niict1234#') {
      localStorage.setItem('adminToken', 'admin-token');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f9ff 100%)',
    }}>
      <div style={{
        background: 'white',
        padding: '2.5rem 2rem',
        borderRadius: '18px',
        boxShadow: '0 8px 32px rgba(80, 112, 255, 0.15)',
        width: '100%',
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #4a90e2 60%, #2563eb 100%)',
          borderRadius: '50%',
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
        }}>
          <LockOutlinedIcon style={{ color: 'white', fontSize: 36 }} />
        </div>
        <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: 8, color: '#222' }}>Admin Login</h2>
        <p style={{ color: '#666', marginBottom: 24, fontSize: '1rem' }}>Sign in to access the admin dashboard</p>
        {error && <p style={{ color: '#e53e3e', marginBottom: 16, textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: 6, color: '#333', fontWeight: 500 }}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                fontSize: '1rem',
                outline: 'none',
                background: '#f8fafc',
                color: '#222',
                transition: 'border 0.2s',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: 6, color: '#333', fontWeight: 500 }}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                fontSize: '1rem',
                outline: 'none',
                background: '#f8fafc',
                color: '#222',
                transition: 'border 0.2s',
              }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, #4a90e2 60%, #2563eb 100%)',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(80, 112, 255, 0.10)',
              transition: 'background 0.2s',
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 