import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AppContext';
import { dashboardService } from '../../services/api';
import Loader from '../../components/Loader';
import { fmt } from '../../utils/helpers';

export default function DoctorSalary() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.doctor(user.employeeId).then(setData).finally(() => setLoading(false));
  }, [user.employeeId]);

  if (loading) return <Loader />;
  const { salary, operations, appointments } = data;
  if (!salary) return <div className="empty-state">Salary data not available.</div>;

  return (
    <div>
      <div className="page-head">
        <div><span className="eyebrow">Career</span><h1>Salary & Commission</h1></div>
      </div>
      <div className="stat-grid">
        <div className="stat-tile"><div className="st-label">Base Salary</div><div className="st-value" style={{fontSize:24}}>{fmt.currency(salary.baseSalary)}</div></div>
        <div className="stat-tile"><div className="st-label">Commission Rate</div><div className="st-value">{(salary.commissionRate * 100).toFixed(0)}%</div></div>
        <div className="stat-tile"><div className="st-label">Commission Earned</div><div className="st-value" style={{fontSize:22,color:'var(--success)'}}>{fmt.currency(salary.commissionEarned)}</div></div>
        <div className="stat-tile"><span className="st-dot"/><div className="st-label">Total Compensation</div><div className="st-value" style={{fontSize:22,color:'var(--accent-b)'}}>{fmt.currency(salary.totalCompensation)}</div></div>
      </div>

      <div className="sec-title"><span className="dot"/>Commission breakdown — procedures</div>
      <div className="table-wrap">
        <table className="dt">
          <thead><tr><th>Date</th><th>Procedure</th><th>Cost</th><th>Your commission ({(salary.commissionRate*100).toFixed(0)}%)</th></tr></thead>
          <tbody>
            {operations.map(op => (
              <tr key={op.id}>
                <td className="mono">{fmt.date(op.DateUndergoes)}</td>
                <td>{op.procedureName}</td>
                <td className="mono">{fmt.currency(op.cost)}</td>
                <td className="mono" style={{color:'var(--success)'}}>{fmt.currency(op.cost * salary.commissionRate)}</td>
              </tr>
            ))}
            {operations.length === 0 && <tr><td colSpan={4} style={{textAlign:'center',padding:20,color:'var(--text-dim)'}}>No procedures on record.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="sec-title mt-32"><span className="dot"/>All appointments (checkups + admissions)</div>
      <div className="table-wrap">
        <table className="dt">
          <thead><tr><th>ID</th><th>Date</th><th>Room</th><th>Patient #</th><th>Type</th></tr></thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.AppointmentID}>
                <td className="mono">#{a.AppointmentID}</td>
                <td className="mono">{fmt.dt(a.Starto)}</td>
                <td>{a.ExaminationRoom}</td>
                <td className="mono">#{a.Patient}</td>
                <td>{a.VisitType === 'Admission' ? <span className="badge badge-danger">Admission</span> : <span className="badge badge-info">OPD</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
