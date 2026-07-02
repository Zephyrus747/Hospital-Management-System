import { useEffect, useState } from "react";
import { refService, adminService } from "../../services/api";
import AdminTable from "../../components/AdminTable";
import Loader from "../../components/Loader";
import { fmt } from "../../utils/helpers";

export default function AdminAppointments() {
  const [rows, setRows] = useState([]);
  const [physicians, setPhysicians] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      refService.appointments(),
      refService.physicians(),
      refService.patients(),
    ])
      .then(([a, p, pts]) => {
        setRows(a);
        setPhysicians(p);
        setPatients(pts);
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const docName = (id) =>
    physicians.find((p) => p.EmployeeID === id)?.Name || `#${id}`;
  const ptName = (id) => patients.find((p) => p.SSN === id)?.Name || `#${id}`;

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">Admin / manage</span>
          <h1>Appointments</h1>
          <p>
            View and edit all scheduled appointments. To add, use the patient
            portal.
          </p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <AdminTable
          resource="appointments"
          idField="AppointmentID"
          rows={rows}
          onRefresh={load}
          columns={[
            { key: "AppointmentID", label: "ID", mono: true },
            { key: "Patient", label: "Patient", render: (v) => ptName(v) },
            { key: "Physician", label: "Physician", render: (v) => docName(v) },
            {
              key: "Starto",
              label: "Start",
              mono: true,
              render: (v) => fmt.dt(v),
            },
            { key: "ExaminationRoom", label: "Room" },
            {
              key: "VisitType",
              label: "Type",
              render: (v) =>
                v === "Admission" ? (
                  <span className="badge badge-danger">Admission</span>
                ) : (
                  <span className="badge badge-info">OPD</span>
                ),
            },
          ]}
          editFields={[
            { key: "ExaminationRoom", label: "Examination room" },
            {
              key: "VisitType",
              label: "Visit type",
              options: [
                { value: "OPD", label: "OPD (Outpatient)" },
                { value: "Admission", label: "Admission (Inpatient)" },
              ],
            },
          ]}
        />
      )}
    </div>
  );
}
