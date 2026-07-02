import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { refService } from "../../services/api";
import Loader from "../../components/Loader";

export default function AdminDashboard() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      refService.physicians(),
      refService.nurses(),
      refService.patients(),
      refService.departments(),
      refService.procedures(),
      refService.appointments(),
    ])
      .then(
        ([
          physicians,
          nurses,
          patients,
          departments,
          procedures,
          appointments,
        ]) => {
          setCounts({
            physicians: physicians.length,
            nurses: nurses.length,
            patients: patients.length,
            departments: departments.length,
            procedures: procedures.length,
            appointments: appointments.length,
          });
        },
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading admin panel…" />;

  const tiles = [
    {
      label: "Physicians",
      value: counts.physicians,
      to: "/admin/physicians",
      color: "var(--info)",
    },
    {
      label: "Nurses",
      value: counts.nurses,
      to: "/admin/nurses",
      color: "var(--success)",
    },
    {
      label: "Patients",
      value: counts.patients,
      to: "/admin/patients",
      color: "var(--warn)",
    },
    {
      label: "Departments",
      value: counts.departments,
      to: "/admin/departments",
      color: "var(--accent-b)",
    },
    {
      label: "Procedures",
      value: counts.procedures,
      to: "/admin/procedures",
      color: "var(--danger)",
    },
    {
      label: "Appointments",
      value: counts.appointments,
      to: "/admin/appointments",
      color: "var(--text-dim)",
    },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">Admin panel</span>
          <h1>Master control</h1>
          <p>Add, edit, or remove any record across the entire system.</p>
        </div>
      </div>

      <div className="stat-grid">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to} className="stat-tile">
            <span
              className="st-dot"
              style={{
                background: t.color,
                boxShadow: `0 0 0 4px ${t.color}22`,
              }}
            />
            <div className="st-label">{t.label}</div>
            <div className="st-value">{t.value}</div>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="sec-title" style={{ marginBottom: 16 }}>
          <span className="dot" />
          Quick actions
        </div>
        <div className="flex-row gap-14">
          <Link to="/admin/physicians" className="btn btn-ghost">
            + Add physician
          </Link>
          <Link to="/admin/nurses" className="btn btn-ghost">
            + Add nurse
          </Link>
          <Link to="/admin/patients" className="btn btn-ghost">
            + Add patient
          </Link>
          <Link to="/admin/departments" className="btn btn-ghost">
            + Add department
          </Link>
          <Link to="/admin/procedures" className="btn btn-ghost">
            + Add procedure
          </Link>
        </div>
      </div>
    </div>
  );
}
