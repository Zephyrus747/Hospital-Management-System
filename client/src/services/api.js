import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  r => r,
  err => {
    const e = new Error(err.response?.data?.message || err.message || 'API error');
    e.status = err.response?.status || (err.request ? 503 : 500);
    return Promise.reject(e);
  }
);

export default api;

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authService = {
  login: async (username, password) => {
    const { data } = await api.post('/api/auth/login', { username, password });
    return data.user;
  },
};

// ── Role dashboards ───────────────────────────────────────────────────────────
export const dashboardService = {
  patient:  ssn   => api.get(`/api/patient/${ssn}/dashboard`).then(r => r.data),
  doctor:   empId => api.get(`/api/doctor/${empId}/dashboard`).then(r => r.data),
  nurse:    empId => api.get(`/api/nurse/${empId}/dashboard`).then(r => r.data),
};

// ── Admin / generic CRUD ──────────────────────────────────────────────────────
export const adminService = {
  list:   resource       => api.get(`/${resource}`).then(r => r.data),
  get:    (resource, id) => api.get(`/api/admin/${resource}/${id}`).then(r => r.data),
  update: (resource, id, body) => api.put(`/api/admin/${resource}/${id}`, body).then(r => r.data),
  delete: (resource, id)       => api.delete(`/api/admin/${resource}/${id}`).then(r => r.data),

  // POST convenience (using existing spec endpoints)
  addPhysician:  body => api.post('/api/physician/post', body).then(r => r.data),
  addNurse:      body => api.post('/api/nurse', body).then(r => r.data),
  addPatient:    body => api.post('/api/patient', body).then(r => r.data),
  addDepartment: body => api.post('/api/department', body).then(r => r.data),
  addProcedure:  body => api.post('/api/procedure', body).then(r => r.data),
};

// ── Doctor — scoped patient lookup ────────────────────────────────────────────
export const doctorService = {
  patientDetail: (empId, ssn) => api.get(`/api/patient/physician/${empId}/${ssn}`).then(r => r.data),
};

// ── Patient self-service ──────────────────────────────────────────────────────
export const patientService = {
  bookAppointment:  body           => api.post('/api/appointment/', body).then(r => r.data),
  editAppointment:  (id, body)     => api.put(`/api/patient/appointment/${id}`, body).then(r => r.data),
};

// ── Reference data ────────────────────────────────────────────────────────────
export const refService = {
  physicians:  () => api.get('/physicians').then(r => r.data),
  nurses:      () => api.get('/nurses').then(r => r.data),
  patients:    () => api.get('/patients').then(r => r.data),
  departments: () => api.get('/api/department/').then(r => r.data),
  procedures:  () => api.get('/api/procedure/').then(r => r.data),
  appointments:() => api.get('/api/appointment').then(r => r.data),
  medications: () => api.get('/medications').then(r => r.data),
  rooms:       () => api.get('/rooms').then(r => r.data),
  salaries:    () => api.get('/salaries').then(r => r.data),
  billing:     () => api.get('/billing').then(r => r.data),
};