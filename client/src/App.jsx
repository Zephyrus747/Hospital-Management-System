import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import NurseDashboard from "./pages/nurse/NurseDashboard";
import { PatientDashboard } from "./pages/patient/PatientDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/doctor" element={<DoctorDashboard />} />

        <Route path="/nurse" element={<NurseDashboard />} />

        <Route path="/patient" element={<PatientDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;