import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

export const getAppointments = () => API.get("/appointments");

export const getAppointment = (id) => API.get(`/appointments/${id}`);

export const getPatients = () => API.get("/patients");

export const getPatient = (ssn) => API.get(`/patients?SSN=${ssn}`);

export const getDoctors = () => API.get("/physicians");

export const getDoctor = (id) => API.get(`/physicians?EmployeeID=${id}`);

export const getNurses = () => API.get("/nurses");

export const getNurse = (id) => API.get(`/nurses?EmployeeID=${id}`);

export const addAppointment = (data) =>
  API.post("/appointments", data);

export const updateAppointment = (id, data) =>
  API.put(`/appointments/${id}`, data);

export const updateAppointmentStatus = (id, status) =>
  API.patch(`/appointments/${id}`, { status });

export const deleteAppointment = (id) =>
  API.delete(`/appointments/${id}`);