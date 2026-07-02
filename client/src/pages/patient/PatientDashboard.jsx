import { useEffect, useState } from "react";
import {getPatient,getAppointments,getDoctor,getReports,getMedication,getBilling} from "../../services/patientService";

export const PatientDashboard = () => {
  const [patient, setPatient] = useState(null)
  const [appointment, setAppointment] = useState([])
  const [doctor, setDoctor] = useState(null)
  const [report, setReport] = useState(null)
  const [medicine, setMedicine] = useState(null)
  const [bill, setBill] = useState(null)

  useEffect(() => {loadDashboard()}, [])

  const loadDashboard = async () => {
    try {
      const ssn = 100000001

      const patientRes = await getPatient(ssn)
      const patientData = patientRes.data[0]
      setPatient(patientData);

      const appointmentRes = await getAppointments(ssn)

      if (appointmentRes.data.length > 0) {
        const appointmentData = appointmentRes.data[0];
        setAppointment(appointmentData);

        const doctorRes = await getDoctor(appointmentData.Physician)
        setDoctor(doctorRes.data[0])
      }

      const reportRes = await getReports(ssn)
      if (reportRes.data.length > 0) {
        const reportData = reportRes.data[0]
        setReport(reportData)
        const medicineRes = await getMedication(reportData.Medication)
        setMedicine(medicineRes.data[0])
      }
      const billRes = await getBilling(ssn)

      if (billRes.data.length > 0) {
        setBill(billRes.data[0])
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (!patient) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg mb-6">
        <h1 className="text-4xl font-bold">Welcome, {patient.Name}</h1>
        <p className="mt-2 text-blue-100">View your appointments, reports and personal information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">My Information</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Patient ID:</span> {patient.SSN}</p>
            <p><span className="font-semibold">Name:</span> {patient.Name}</p>
            <p><span className="font-semibold">Phone:</span> {patient.Phone}</p>
            <p><span className="font-semibold">Address:</span> {patient.Address}</p>
            <p><span className="font-semibold">Insurance ID:</span> {patient.InsuranceID}</p>
            <p><span className="font-semibold">Primary Physician ID:</span> {patient.PCP}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">Upcoming Appointment</h2>

          {appointment ? (
            <div className="space-y-2">
              <p><span className="font-semibold">Doctor:</span> Dr. {doctor?.Name}</p>
              <p><span className="font-semibold">Date:</span> {appointment.Starto}</p>
              <p><span className="font-semibold">End Time:</span> {appointment.Endo}</p>
              <p><span className="font-semibold">Room:</span> {appointment.ExaminationRoom}</p>
              <p><span className="font-semibold">Visit Type:</span> {appointment.VisitType}</p>
            </div>
          ) : ( <p>No Appointment Available</p>
          )}

          <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">View Appointment</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4 border-b pb-2">Latest Medical Report</h2>

        {report ? (
          <div className="space-y-2">
            <p><span className="font-semibold">Medicine:</span> {medicine?.Name}</p>
            <p><span className="font-semibold">Brand:</span> {medicine?.Brand}</p>
            <p><span className="font-semibold">Dose:</span> {report.Dose}</p>
            <p><span className="font-semibold">Prescribed By:</span> Dr. {doctor?.Name}</p>
            <p><span className="font-semibold">Prescription Date:</span> {report.Date}</p>
          </div>
        ) : (
          <p className="text-gray-500">No Medical Report Available</p>
        )}

        <button className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">View Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

        <div className="bg-blue-600 text-white rounded-xl p-5">
          <h3 className="text-lg font-semibold">Appointments</h3>
          <p className="text-3xl font-bold mt-2">{appointment ? 1:0}</p>
        </div>

        <div className="bg-green-600 text-white rounded-xl p-5">
          <h3 className="text-lg font-semibold">Reports</h3>
          <p className="text-3xl font-bold mt-2">{report ? 1:0}</p>
        </div>

        <div className="bg-orange-500 text-white rounded-xl p-5">
          <h3 className="text-lg font-semibold">Billing Status</h3>
          <p className="text-2xl font-bold mt-2">
            {bill ? (bill.paid ? "Paid" : "Pending") : "No Bills"}
          </p>
        </div>
      </div>
    </div>
  )
}