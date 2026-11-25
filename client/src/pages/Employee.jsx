import { useEffect, useState } from 'react';
import { api } from '../api';

const QUOTA = { Casual: 12, Sick: 10, Earned: 15 };
const d = s => new Date(s).toISOString().slice(0, 10);

export default function Employee({ user, refreshUser }) {
  const [leaves, setLeaves] = useState([]);
  const [f, setF] = useState({ type: 'Casual', from: '', to: '', reason: '' });
  const [msg, setMsg] = useState({ t: '', ok: false });
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const load = () => api('/leaves/mine').then(setLeaves);
  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault();
    try {
      await api('/leaves', 'POST', f);
      setMsg({ t: 'Leave request submitted', ok: true });
      setF({ ...f, from: '', to: '', reason: '' });
      load(); refreshUser();
    } catch (x) { setMsg({ t: x.message, ok: false }); }
  };

  return (
    <>
      <div className="card"><h3>Leave Balance</h3>
        <div className="grid">
          {Object.keys(QUOTA).map(t => {
            const left = user.balance[t], used = QUOTA[t] - left;
            return (
              <div className="stat" key={t}>
                <b>{left}</b>{t} left<br /><small>{used}/{QUOTA[t]} used</small>
                <div className="bar"><i style={{ width: `${(used / QUOTA[t]) * 100}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>

      <form className="card" onSubmit={submit}>
        <h3>Apply Leave</h3>
        <select value={f.type} onChange={set('type')}>{Object.keys(QUOTA).map(t => <option key={t}>{t}</option>)}</select>
        <label>From</label><input type="date" value={f.from} onChange={set('from')} required />
        <label>To</label><input type="date" value={f.to} onChange={set('to')} required />
        <textarea placeholder="Reason" value={f.reason} onChange={set('reason')} required />
        <button>Submit</button>
        {msg.t && <p className={msg.ok ? 'ok' : 'err'}>{msg.t}</p>}
      </form>

      <div className="card"><h3>Leave History</h3>
        <div className="scroll"><table>
          <thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th></tr></thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l._id}><td>{l.type}</td><td>{d(l.from)}</td><td>{d(l.to)}</td><td>{l.days}</td>
                <td>{l.reason}</td><td><span className={`badge ${l.status}`}>{l.status}</span></td></tr>
            ))}
            {!leaves.length && <tr><td colSpan="6">No leaves yet</td></tr>}
          </tbody>
        </table></div>
      </div>
    </>
  );
}
