import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

export const getPatient = (ssn) =>API.get(`/patients?SSN=${ssn}`)
export const getAppointments = (ssn) =>API.get(`/appointments?Patient=${ssn}`)
export const getDoctor = (id) =>API.get(`/physicians?EmployeeID=${id}`)
export const getPrescription = (ssn) =>API.get(`/prescribes?Patient=${ssn}`)
export const getMedication = (code) =>API.get(`/medications?Code=${code}`)
export const getBilling = (ssn) =>API.get(`/billing?patient=${ssn}`)
export const getReports = (ssn) =>API.get(`/prescribes?Patient=${ssn}`)
