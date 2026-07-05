
import { useEffect, useState } from "react";
import {
  getNurse,
  getPatients,
  getDoctors,
  getAppointmentsByNurse,
  getDutyShiftByNurse,
} from "../../services/nurseService";

const NurseDashboard = () => {
  const nurseId = 101;

  const [nurse, setNurse] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [shift, setShift] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const nurseRes = await getNurse(nurseId);
      setNurse(nurseRes.data[0]);

      const patientRes = await getPatients();
      setPatients(patientRes.data);

      const doctorRes = await getDoctors();
      setDoctors(doctorRes.data);

      const appointmentRes = await getAppointmentsByNurse(nurseId);
      setAppointments(appointmentRes.data);

      const shiftRes = await getDutyShiftByNurse(nurseId);
      if (shiftRes.data.length) setShift(shiftRes.data[0]);
    } catch (err) {
      console.log(err);
    }
  };

  if (!nurse) return <div>Loading...</div>;

  const firstAppointment = appointments[0];
  const doctor = firstAppointment
    ? doctors.find(d => d.EmployeeID === firstAppointment.Physician)
    : null;
  const patient = firstAppointment
    ? patients.find(p => p.SSN === firstAppointment.Patient)
    : null;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg mb-6 flex justify-between">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {nurse.Name}</h1>
          <p className="mt-2 text-blue-100">Manage patients, appointments and shift information.</p>
        </div>
        <button className="bg-red-500 px-4 py-2 rounded-lg">Logout</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">Nurse Information</h2>
          <p><b>ID:</b> {nurse.EmployeeID}</p>
          <p><b>Name:</b> {nurse.Name}</p>
          <p><b>Position:</b> {nurse.Position}</p>
          <p><b>Registered:</b> {nurse.Registered ? "Yes" : "No"}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">Current Shift</h2>
          {shift ? (
            <>
              <p><b>Date:</b> {shift.date}</p>
              <p><b>Joining:</b> {shift.joining}</p>
              <p><b>Leaving:</b> {shift.leaving}</p>
              <p><b>Shift:</b> {shift.shiftType}</p>
            </>
          ) : <p>No Shift Assigned</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4 border-b pb-2">Today's Appointment</h2>
        {firstAppointment ? (
          <>
            <p><b>Patient:</b> {patient?.Name}</p>
            <p><b>Doctor:</b> Dr. {doctor?.Name}</p>
            <p><b>Time:</b> {firstAppointment.Starto}</p>
            <p><b>Room:</b> {firstAppointment.ExaminationRoom}</p>
            <p><b>Visit:</b> {firstAppointment.VisitType}</p>
          </>
        ) : <p>No Appointment Assigned</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <div className="bg-blue-600 text-white rounded-xl p-5">
          <h3>Assigned Patients</h3>
          <p className="text-3xl font-bold">{patients.length}</p>
        </div>
        <div className="bg-green-600 text-white rounded-xl p-5">
          <h3>Appointments</h3>
          <p className="text-3xl font-bold">{appointments.length}</p>
        </div>
        <div className="bg-orange-500 text-white rounded-xl p-5">
          <h3>Doctors</h3>
          <p className="text-3xl font-bold">{doctors.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">Today's Schedule</h2>
        <table className="w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2">Patient</th>
              <th className="p-2">Doctor</th>
              <th className="p-2">Time</th>
              <th className="p-2">Room</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => {
              const p = patients.find(x => x.SSN === a.Patient);
              const d = doctors.find(x => x.EmployeeID === a.Physician);
              return (
                <tr key={a.AppointmentID} className="border-b">
                  <td className="p-2">{p?.Name}</td>
                  <td className="p-2">{d?.Name}</td>
                  <td className="p-2">{a.Starto}</td>
                  <td className="p-2">{a.ExaminationRoom}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NurseDashboard;