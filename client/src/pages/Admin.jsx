import { useEffect, useState } from 'react';
import { api } from '../api';

const d = s => new Date(s).toISOString().slice(0, 10);

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [err, setErr] = useState('');

  const load = async () => {
    setStats(await api('/leaves/stats/summary'));
    setLeaves(await api('/leaves'));
  };
  useEffect(() => { load(); }, []);

  const decide = async (id, status) => {
    try { await api(`/leaves/${id}/status`, 'PATCH', { status }); setErr(''); load(); }
    catch (x) { setErr(x.message); }
  };

  if (!stats) return <p className="center">Loading...</p>;
  const pending = leaves.filter(l => l.status === 'Pending');

  return (
    <>
      <div className="card"><h3>Admin Dashboard</h3>
        <div className="grid">
          <div className="stat"><b>{stats.employees}</b>Employees</div>
          <div className="stat"><b>{stats.pending}</b>Pending</div>
          <div className="stat"><b>{stats.approved}</b>Approved</div>
          <div className="stat"><b>{stats.rejected}</b>Rejected</div>
          <div className="stat"><b>{stats.onLeave}</b>On leave today</div>
        </div>
      </div>

      <div className="card"><h3>Pending Requests</h3>
        {err && <p className="err">{err}</p>}
        <div className="scroll"><table>
          <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Action</th></tr></thead>
          <tbody>
            {pending.map(l => (
              <tr key={l._id}><td>{l.user?.name}</td><td>{l.type}</td><td>{d(l.from)} → {d(l.to)}</td><td>{l.days}</td><td>{l.reason}</td>
                <td><button className="green" onClick={() => decide(l._id, 'Approved')}>Approve</button>{' '}
                  <button className="red" onClick={() => decide(l._id, 'Rejected')}>Reject</button></td></tr>
            ))}
            {!pending.length && <tr><td colSpan="6">No pending requests</td></tr>}
          </tbody>
        </table></div>
      </div>

      <div className="card"><h3>Employee Balances</h3>
        <div className="scroll"><table>
          <thead><tr><th>Employee</th><th>Casual</th><th>Sick</th><th>Earned</th></tr></thead>
          <tbody>{stats.balances.map(u => (
            <tr key={u._id}><td>{u.name}</td><td>{u.balance.Casual}/12</td><td>{u.balance.Sick}/10</td><td>{u.balance.Earned}/15</td></tr>
          ))}</tbody>
        </table></div>
      </div>

      <div className="card"><h3>All Leave History</h3>
        <div className="scroll"><table>
          <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Status</th></tr></thead>
          <tbody>{leaves.map(l => (
            <tr key={l._id}><td>{l.user?.name}</td><td>{l.type}</td><td>{d(l.from)} → {d(l.to)}</td><td>{l.days}</td>
              <td><span className={`badge ${l.status}`}>{l.status}</span></td></tr>
          ))}</tbody>
        </table></div>
      </div>
    </>
  );
}
