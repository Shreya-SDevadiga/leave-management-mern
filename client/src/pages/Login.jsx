import { useState } from 'react';
import { api } from '../api';

export default function Login({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setErr('');
    try {
      const { token } = await api(`/auth/${mode}`, 'POST', f);
      localStorage.setItem('token', token);
      onAuth();
    } catch (x) { setErr(x.message); }
  };

  return (
    <form className="card login" onSubmit={submit}>
      <h2>{mode === 'login' ? 'Sign in' : 'Employee registration'}</h2>
      {mode === 'register' && <input placeholder="Full name" value={f.name} onChange={set('name')} required />}
      <input type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
      <input type="password" placeholder="Password" value={f.password} onChange={set('password')} required />
      <button>{mode === 'login' ? 'Login' : 'Register'}</button>
      {err && <p className="err">{err}</p>}
      <p className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'New employee? Register' : 'Back to login'}
      </p>
      <small>Admin and employee both log in here. Role decides the dashboard.</small>
    </form>
  );
}
