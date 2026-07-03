import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

export const getNurse = (id) =>
  API.get(`/nurses?EmployeeID=${id}`);

export const getPatients = () =>
  API.get("/patients");

export const getPatient = (ssn) =>
  API.get(`/patients?SSN=${ssn}`);

export const getDoctors = () =>
  API.get("/physicians");

export const getDoctor = (id) =>
  API.get(`/physicians?EmployeeID=${id}`);

export const getAppointmentsByNurse = (id) =>
  API.get(`/appointments?PrepNurse=${id}`);

export const getAppointment = (appointmentId) =>
  API.get(`/appointments?AppointmentID=${appointmentId}`);

export const getPrescriptionsByPatient = (ssn) =>
  API.get(`/prescribes?Patient=${ssn}`);

export const getMedication = (code) =>
  API.get(`/medications?Code=${code}`);

export const getDutyShiftByNurse = (id) =>
  API.get(`/duty_shifts?personId=${id}`);