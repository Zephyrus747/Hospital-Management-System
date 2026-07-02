import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';
import { dashboardService } from '../../services/api';
import Loader from '../../components/Loader';

export default function DoctorShifts() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.doctor(user.employeeId).then(setData).finally(() => setLoading(false));
  }, [user.employeeId]);

  if (loading) return <Loader />;
  const { dutyShifts, profile } = data;

  return (
    <div>
      <div className="page-head">
        <div><span className="eyebrow">Career</span><h1>Duty Shifts</h1><p>Rotational schedule for Dr. {profile.Name}</p></div>
      </div>
      {dutyShifts.length === 0
        ? <div className="empty-state">No shifts recorded.</div>
        : (
          <div className="shift-grid">
            {dutyShifts.map(s => (
              <Link to={`/shifts/${s.id}`} className="shift-card" key={s.id} style={{ display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className="sh-type">{s.shiftType}</span>
                  <span className="badge badge-info">Physician</span>
                </div>
                <div className="sh-time">{s.joining} → {s.leaving}</div>
                <div className="sh-date">{s.date}</div>
              </Link>
            ))}
          </div>
        )
      }
    </div>
  );
}