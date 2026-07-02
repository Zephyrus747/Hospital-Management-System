import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';
import { dashboardService, doctorService } from '../../services/api';
import Loader from '../../components/Loader';
import ErrorPage from '../ErrorPage';
import { fmt } from '../../utils/helpers';

export function DoctorPatients() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.doctor(user.employeeId).then(setData).finally(() => setLoading(false));
  }, [user.employeeId]);

  if (loading) return <Loader />;
  const { patients, appointments } = data;

  return (
    <div>
      <div className="page-head">
        <div><span className="eyebrow">Doctor portal</span><h1>My Patients</h1><p>All patients assigned to you via appointments.</p></div>
      </div>
      <div className="card-grid" style={{ marginBottom: 28 }}>
        {patients.map(p => {
          const patientAppts = appointments.filter(a => a.Patient === p.SSN);
          const admissions = patientAppts.filter(a => a.VisitType === 'Admission');
          return (
            <Link to={`/patients/${p.SSN}`} className="entity-card" key={p.SSN} style={{ display: 'flex' }}>
              <div className="ec-row">
                <span className="ec-name">{p.Name}</span>
                {admissions.length > 0 && <span className="badge badge-danger">Admitted</span>}
              </div>
              <div className="ec-meta">{p.Phone}</div>
              <div className="ec-meta">{p.Address}</div>
              <div className="ec-row">
                <span className="ec-id">{fmt.ssnMask(p.SSN)}</span>
                <span className="ec-id">{patientAppts.length} appt{patientAppts.length !== 1 ? 's' : ''}</span>
              </div>
            </Link>
          );
        })}
        {patients.length === 0 && <div className="empty-state">No patients yet.</div>}
      </div>
    </div>
  );
}

export function DoctorPatientDetail() {
  const { user } = useAuth();
  const { ssn } = useParams();
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    setState({ status: 'loading', data: null, error: null });
    doctorService.patientDetail(user.employeeId, ssn)
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((error) => setState({ status: 'error', data: null, error }));
  }, [user.employeeId, ssn]);

  if (state.status === 'loading') return <Loader />;
  if (state.status === 'error') {
    return <ErrorPage code={state.error?.status || 404} message={state.error?.message || 'This patient is not under your care, or does not exist.'} />;
  }

  const p = state.data;
  return (
    <div>
      <div className="page-head">
        <div><span className="eyebrow">Doctor portal</span><h1>{p.Name}</h1></div>
        <div className="page-actions"><Link to="/patients" className="btn btn-ghost btn-sm">← Back to patients</Link></div>
      </div>
      <div className="card" style={{ maxWidth: 480 }}>
        <div className="bill-row"><span className="text-dim">SSN</span><span className="mono">{fmt.ssnMask(p.SSN)}</span></div>
        <div className="bill-row"><span className="text-dim">Phone</span><span>{p.Phone}</span></div>
        <div className="bill-row"><span className="text-dim">Address</span><span>{p.Address}</span></div>
        <div className="bill-row"><span className="text-dim">Insurance ID</span><span className="mono">{p.InsuranceID}</span></div>
      </div>
    </div>
  );
}

export function DoctorOperations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.doctor(user.employeeId).then(setData).finally(() => setLoading(false));
  }, [user.employeeId]);

  if (loading) return <Loader />;
  const { operations, generalCheckups, appointments } = data;

  return (
    <div>
      <div className="page-head">
        <div><span className="eyebrow">Doctor portal</span><h1>Operations & Checkups</h1></div>
      </div>
      <div className="stat-grid">
        <div className="stat-tile"><span className="st-dot"/><div className="st-label">Operations (surgical)</div><div className="st-value">{operations.length}</div></div>
        <div className="stat-tile"><div className="st-label">OPD Checkups</div><div className="st-value">{generalCheckups}</div></div>
        <div className="stat-tile"><div className="st-label">Total appointments</div><div className="st-value">{appointments.length}</div></div>
      </div>

      <div className="sec-title mt-24"><span className="dot"/>Surgical operations</div>
      {operations.length === 0
        ? <div className="empty-state">No operations on record.</div>
        : (
          <div className="table-wrap" style={{ marginBottom: 28 }}>
            <table className="dt">
              <thead><tr><th>Date</th><th>Procedure</th><th>Patient #</th><th>Assisting Nurse</th><th>Cost</th></tr></thead>
              <tbody>
                {operations.map(op => (
                  <tr key={op.id} onClick={() => navigate(`/operations/${op.id}`)} style={{ cursor: 'pointer' }}>
                    <td className="mono">{fmt.date(op.DateUndergoes)}</td>
                    <td>{op.procedureName}</td>
                    <td className="mono">#{op.Patient}</td>
                    <td className="mono">{op.AssistingNurse ? `#${op.AssistingNurse}` : '—'}</td>
                    <td className="mono">{fmt.currency(op.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      <div className="sec-title"><span className="dot"/>OPD appointments (general checkups)</div>
      <div className="table-wrap">
        <table className="dt">
          <thead><tr><th>ID</th><th>Date</th><th>Room</th><th>Patient #</th><th>Type</th></tr></thead>
          <tbody>
            {appointments.filter(a => a.VisitType !== 'Admission').map(a => (
              <tr key={a.AppointmentID}>
                <td className="mono">#{a.AppointmentID}</td>
                <td className="mono">{fmt.dt(a.Starto)}</td>
                <td>{a.ExaminationRoom}</td>
                <td className="mono">#{a.Patient}</td>
                <td><span className="badge badge-info">OPD</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OperationDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const [state, setState] = useState({ status: 'loading', op: null });

  useEffect(() => {
    setState({ status: 'loading', op: null });
    dashboardService.doctor(user.employeeId)
      .then((dash) => {
        const op = (dash.operations || []).find((o) => String(o.id) === id);
        setState({ status: op ? 'success' : 'notfound', op });
      })
      .catch(() => setState({ status: 'error', op: null }));
  }, [user.employeeId, id]);

  if (state.status === 'loading') return <Loader />;
  if (state.status === 'notfound') return <ErrorPage code={404} message="Operation not found, or it isn't one of yours." />;
  if (state.status === 'error') return <ErrorPage code={500} />;

  const op = state.op;
  return (
    <div>
      <div className="page-head">
        <div><span className="eyebrow">Doctor portal</span><h1>Operation #{op.id}</h1></div>
        <div className="page-actions"><Link to="/operations" className="btn btn-ghost btn-sm">← Back to operations</Link></div>
      </div>
      <div className="card" style={{ maxWidth: 480 }}>
        <div className="bill-row"><span className="text-dim">Procedure</span><span>{op.procedureName}</span></div>
        <div className="bill-row"><span className="text-dim">Date</span><span className="mono">{fmt.date(op.DateUndergoes)}</span></div>
        <div className="bill-row"><span className="text-dim">Patient</span><span className="mono">#{op.Patient}</span></div>
        <div className="bill-row"><span className="text-dim">Assisting Nurse</span><span className="mono">{op.AssistingNurse ? `#${op.AssistingNurse}` : '—'}</span></div>
        <div className="bill-row"><span className="text-dim">Cost</span><span className="mono">{fmt.currency(op.cost)}</span></div>
      </div>
    </div>
  );
}