import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';
import { dashboardService, patientService, refService } from '../../services/api';
import Loader from '../../components/Loader';
import { fmt, isBlank, toNum } from '../../utils/helpers';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';

const ROOM_OPTIONS = ['A', 'B', 'C', 'D'];
const randomRoom = () => ROOM_OPTIONS[Math.floor(Math.random() * ROOM_OPTIONS.length)];

export default function PatientAppointments() {
  const { user } = useAuth();
  const isPatient = user.role === 'patient';

  const [appts, setAppts] = useState([]);
  const [physicians, setPhysicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [showBook, setShowBook] = useState(false);
  const [form, setForm] = useState({ Physician: '', Starto: '', Endo: '', ExaminationRoom: '', VisitType: 'OPD' });
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [dash, docs] = await Promise.all([
        isPatient ? dashboardService.patient(user.ssn) : dashboardService.doctor(user.employeeId),
        refService.physicians(),
      ]);
      setAppts(dash.appointments);
      setPhysicians(docs);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [user.ssn, user.employeeId]);

  const pagination = usePagination(appts, 5);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const startEdit = (a) => {
    setEditTarget(a.AppointmentID);
    setShowBook(false);
    setForm({ Physician: a.Physician, Starto: a.Starto, Endo: a.Endo, ExaminationRoom: a.ExaminationRoom, VisitType: a.VisitType || 'OPD' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBlank(form.Physician) || isBlank(form.Starto) || isBlank(form.Endo)) {
      setStatus({ state: 'error', msg: 'All fields are required.' }); return;
    }
    setStatus({ state: 'loading', msg: '' });
    try {
      if (editTarget) {
        await patientService.editAppointment(editTarget, { ...form, Physician: toNum(form.Physician), ExaminationRoom: form.ExaminationRoom || randomRoom() });
        setStatus({ state: 'success', msg: 'Appointment updated.' });
        setEditTarget(null);
      } else {
        const maxId = Math.max(0, ...appts.map(a => a.AppointmentID)) + 1;
        await patientService.bookAppointment({
          AppointmentID: maxId,
          Patient: user.ssn,
          Physician: toNum(form.Physician),
          Starto: form.Starto.replace('T', ' '),
          Endo: form.Endo.replace('T', ' '),
          ExaminationRoom: randomRoom(),
          VisitType: form.VisitType,
        });
        setStatus({ state: 'success', msg: 'Appointment booked!' });
        setShowBook(false);
      }
      setForm({ Physician: '', Starto: '', Endo: '', ExaminationRoom: '', VisitType: 'OPD' });
      load();
    } catch (err) { setStatus({ state: 'error', msg: err.message }); }
  };

  if (loading) return <Loader label="Loading appointments…" />;

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">{isPatient ? 'Patient portal' : 'Doctor portal'}</span>
          <h1>Appointments</h1>
          <p>{isPatient ? 'View, book, or modify your appointments.' : 'View your scheduled appointments.'}</p>
        </div>
        {isPatient && (
          <button className="btn btn-primary" onClick={() => { setShowBook(true); setEditTarget(null); setStatus({ state: 'idle', msg: '' }); }}>
            + Book appointment
          </button>
        )}
      </div>

      {isPatient && (showBook || editTarget) && (
        <div className="form-card" style={{ marginBottom: 28 }}>
          <div className="sec-title"><span className="dot"/>{editTarget ? 'Edit appointment' : 'Book new appointment'}</div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field span-2">
                <label>Physician</label>
                <select value={form.Physician} onChange={set('Physician')}>
                  <option value="">— Select physician —</option>
                  {physicians.map(p => <option key={p.EmployeeID} value={p.EmployeeID}>{p.Name} — {p.Position}</option>)}
                </select>
              </div>
              <div className="field"><label>Start time</label><input type="datetime-local" value={form.Starto} onChange={set('Starto')}/></div>
              <div className="field"><label>End time</label><input type="datetime-local" value={form.Endo} onChange={set('Endo')}/></div>
              <div className="field">
                <label>Visit type</label>
                <select value={form.VisitType} onChange={set('VisitType')}>
                  <option value="OPD">OPD (Outpatient)</option>
                  <option value="Admission">Admission (Inpatient)</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={status.state === 'loading'}>
                {status.state === 'loading' ? 'Saving…' : editTarget ? 'Update' : 'Book'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => { setEditTarget(null); setShowBook(false); }}>Cancel</button>
            </div>
            {status.state !== 'idle' && <div className={`form-msg ${status.state === 'success' ? 'success' : 'error'}`}>{status.msg}</div>}
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table className="dt">
          <thead><tr><th>ID</th><th>Date / Time</th><th>Room</th><th>Physician</th><th>Type</th><th>Actions</th></tr></thead>
          <tbody>
            {pagination.pageItems.map(a => {
              const doc = physicians.find(p => p.EmployeeID === a.Physician);
              return (
                <tr key={a.AppointmentID}>
                  <td className="mono">#{a.AppointmentID}</td>
                  <td className="mono">{fmt.dt(a.Starto)}</td>
                  <td>{a.ExaminationRoom}</td>
                  <td>{doc?.Name || `#${a.Physician}`}</td>
                  <td>{a.VisitType === 'Admission' ? <span className="badge badge-danger">Admission</span> : <span className="badge badge-info">OPD</span>}</td>
                  <td>
                    <Link to={`/appointments/${a.AppointmentID}`} className="btn btn-ghost btn-xs" style={{ marginRight: 6 }}>View</Link>
                    {isPatient && <button className="btn btn-ghost btn-xs" onClick={() => startEdit(a)}>Edit</button>}
                  </td>
                </tr>
              );
            })}
            {appts.length === 0 && <tr><td colSpan={6} className="text-dim" style={{padding:20,textAlign:'center'}}>No appointments yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <Pagination {...pagination} pageSize={5} />
    </div>
  );
}