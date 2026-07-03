import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';
import { dashboardService } from '../../services/api';
import Loader from '../../components/Loader';
import { fmt } from '../../utils/helpers';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.patient(user.ssn)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user.ssn]);

  const apptPagination = usePagination(data?.appointments || [], 5);
  const billPagination = usePagination(data?.billing || [], 5);

  if (loading) return <Loader label="Loading your portal…" />;
  if (error) return <div className="form-msg error">{error}</div>;

  const { profile, primaryCarePhysician: pcp, appointments, billing, prescriptions } = data;
  const totalBill = billing.reduce((s, b) => s + b.total, 0);
  const unpaid = billing.filter(b => !b.paid).length;

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">Patient portal</span>
          <h1>Welcome, {profile.Name.split(' ')[0]}</h1>
          <p>Your health overview — appointments, billing, and prescriptions.</p>
        </div>
        <div className="page-actions">
          <Link to="/appointments" className="btn btn-primary">+ Book appointment</Link>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <span className="st-dot"/>
          <div className="st-label">Appointments</div>
          <div className="st-value">{appointments.length}</div>
        </div>
        <div className="stat-tile">
          <div className="st-label">Total billed</div>
          <div className="st-value text-[22px]">{fmt.currency(totalBill)}</div>
        </div>
        <div className="stat-tile">
          <div className="st-label">Unpaid bills</div>
          <div className={`st-value ${unpaid ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>{unpaid}</div>
        </div>
        <div className="stat-tile">
          <div className="st-label">Prescriptions</div>
          <div className="st-value">{prescriptions.length}</div>
        </div>
      </div>

      {pcp && (
        <div className="card mt-24 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--info-soft)] border border-[var(--info)] flex items-center justify-center font-[family-name:var(--font-d)] font-bold text-[var(--info)] text-base">
            {fmt.initials(pcp.Name)}
          </div>
          <div>
            <div className="text-xs text-[var(--text-faint)] uppercase tracking-[.08em] font-semibold">Primary care physician</div>
            <div className="font-[family-name:var(--font-d)] text-[17px] font-semibold mt-0.5">{pcp.Name}</div>
            <div className="text-[13px] text-[var(--text-dim)]">{pcp.Position}</div>
          </div>
        </div>
      )}

      <div className="sec-title mt-24"><span className="dot"/>Recent appointments</div>
      {appointments.length === 0
        ? <div className="empty-state">No appointments yet. <Link to="/appointments" className="text-[var(--accent-b)]">Book one →</Link></div>
        : (
          <>
            <div className="table-wrap">
              <table className="dt">
                <thead><tr><th>Date</th><th>Room</th><th>Physician #</th><th>Type</th></tr></thead>
                <tbody>
                  {apptPagination.pageItems.map(a => (
                    <tr key={a.AppointmentID}>
                      <td className="mono">{fmt.dt(a.Starto)}</td>
                      <td>{a.ExaminationRoom}</td>
                      <td className="mono">#{a.Physician}</td>
                      <td>{a.VisitType === 'Admission' ? <span className="badge badge-danger">Admission</span> : <span className="badge badge-info">OPD</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mb-2"><Pagination {...apptPagination} pageSize={5} /></div>
          </>
        )
      }

   
      <div className="sec-title mt-24"><span className="dot"/>Billing summary</div>
      {billing.length === 0
        ? <div className="empty-state">No billing records yet.</div>
        : (
          <>
            {billPagination.pageItems.map(b => (
              <div className="card mb-3.5" key={b.id}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-[family-name:var(--font-m)] text-xs text-[var(--text-faint)]">Stay #{b.stayId}</span>
                  <span className={`badge ${b.paid ? 'badge-success' : 'badge-danger'}`}>{b.paid ? 'Paid' : 'Unpaid'}</span>
                </div>
                {b.items.map((item, i) => (
                  <div className="bill-row" key={i}>
                    <span>{item.label}</span>
                    <span className="font-[family-name:var(--font-m)]">{fmt.currency(item.amount)}</span>
                  </div>
                ))}
                <div className="bill-total">
                  <span>Total</span>
                  <span className={b.paid ? 'text-[var(--success)]' : 'text-[var(--danger)]'}>{fmt.currency(b.total)}</span>
                </div>
              </div>
            ))}
            <Pagination {...billPagination} pageSize={5} />
          </>
        )
      }
    </div>
  );
}