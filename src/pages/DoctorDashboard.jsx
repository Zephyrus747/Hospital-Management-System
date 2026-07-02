import { useEffect, useState } from "react";
import {
  getAppointments,
  getPatients,
  getDoctors,
  getNurses,
  updateAppointmentStatus,
} from "../services/doctorService";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        appointmentRes,
        patientRes,
        doctorRes,
        nurseRes,
      ] = await Promise.all([
        getAppointments(),
        getPatients(),
        getDoctors(),
        getNurses(),
      ]);

      setAppointments(appointmentRes.data);
      setPatients(patientRes.data);
      setDoctors(doctorRes.data);
      setNurses(nurseRes.data);

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getPatient = (id) =>
    patients.find((p) => p.SSN === id)?.Name || "Unknown";

  const getDoctor = (id) =>
    doctors.find((d) => d.EmployeeID === id)?.Name || "Unknown";

  const getNurse = (id) => {
    if (!id) return "Not Assigned";
    return nurses.find((n) => n.EmployeeID === id)?.Name || "Unknown";
  };

  const updateStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredAppointments = appointments.filter((item) =>
    getPatient(item.Patient)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalAppointments = appointments.length;

  const opdAppointments = appointments.filter(
    (a) => a.VisitType === "OPD"
  ).length;

  const admissionAppointments = appointments.filter(
    (a) => a.VisitType === "Admission"
  ).length;

  const completedAppointments = appointments.filter(
    (a) => a.status === "Completed"
  ).length;

  if (loading) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        Loading Dashboard...
      </h2>
    );
  }

  return (
    <div
      style={{
        padding: "25px",
        background: "#f3f6fa",
        minHeight: "100vh",
      }}
    >
            <h1
        style={{
          textAlign: "center",
          color: "#1565c0",
          marginBottom: "30px",
        }}
      >
        Doctor Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#1976d2",
            color: "white",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          }}
        >
          <h2>{totalAppointments}</h2>
          <p>Total Appointments</p>
        </div>

        <div
          style={{
            background: "#43a047",
            color: "white",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          }}
        >
          <h2>{opdAppointments}</h2>
          <p>OPD Appointments</p>
        </div>

        <div
          style={{
            background: "#fb8c00",
            color: "white",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          }}
        >
          <h2>{admissionAppointments}</h2>
          <p>Admissions</p>
        </div>

        <div
          style={{
            background: "#8e24aa",
            color: "white",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          }}
        >
          <h2>{completedAppointments}</h2>
          <p>Completed</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search Patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          marginBottom: "25px",
          fontSize: "16px",
          outline: "none",
        }}
      />

      <div
        style={{
          background: "white",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead
            style={{
              background: "#1565c0",
              color: "white",
            }}
          >
            <tr>
              <th style={{ padding: "15px" }}>Appointment ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Nurse</th>
              <th>Room</th>
              <th>Visit Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((appointment) => (
  <tr
    key={appointment.AppointmentID}
    style={{
      textAlign: "center",
      borderBottom: "1px solid #ddd",
    }}
  >
    <td style={{ padding: "15px" }}>
      {appointment.AppointmentID}
    </td>

    <td>{getPatient(appointment.Patient)}</td>

    <td>{getDoctor(appointment.Physician)}</td>

    <td>{getNurse(appointment.PrepNurse)}</td>

    <td>{appointment.ExaminationRoom}</td>

    <td>
      <span
        style={{
          background:
            appointment.VisitType === "Admission"
              ? "#ff9800"
              : "#4caf50",
          color: "white",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "13px",
        }}
      >
        {appointment.VisitType}
      </span>
    </td>

    <td>{appointment.Starto}</td>

    <td>
      <span
        style={{
          padding: "7px 14px",
          borderRadius: "20px",
          color: "white",
          background:
            appointment.status === "Completed"
              ? "#2e7d32"
              : appointment.status === "Cancelled"
              ? "#d32f2f"
              : "#f9a825",
        }}
      >
        {appointment.status || "Pending"}
      </span>
    </td>

    <td>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() =>
            updateStatus(
              appointment.id || appointment.AppointmentID,
              "Completed"
            )
          }
          style={{
            background: "#2e7d32",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Complete
        </button>

        <button
          onClick={() =>
            updateStatus(
              appointment.id || appointment.AppointmentID,
              "Cancelled"
            )
          }
          style={{
            background: "#d32f2f",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Cancel
        </button>

        <button
          onClick={() =>
            updateStatus(
              appointment.id || appointment.AppointmentID,
              "Pending"
            )
          }
          style={{
            background: "#1976d2",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Pending
        </button>
      </div>
    </td>
  </tr>
))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;