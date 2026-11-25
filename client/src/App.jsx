import { useEffect, useState } from 'react';
import { api } from './api';
import Login from './pages/Login';
import Employee from './pages/Employee';
import Admin from './pages/Admin';

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const refresh = async () => {
    try { setUser(await api('/auth/me')); } catch { localStorage.removeItem('token'); setUser(null); }
  };
  useEffect(() => {
    (localStorage.getItem('token') ? refresh() : Promise.resolve()).finally(() => setReady(true));
  }, []);

  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  if (!ready) return <p className="center">Loading...</p>;

  return (
    <>
      <header>
        <b>Leave Management System</b>
        {user && <span>{user.name} ({user.role}) <button className="gray" onClick={logout}>Logout</button></span>}
      </header>
      <main>
        {!user ? <Login onAuth={refresh} />
          : user.role === 'admin' ? <Admin />
          : <Employee user={user} refreshUser={refresh} />}
      </main>
    </>
  );
}
