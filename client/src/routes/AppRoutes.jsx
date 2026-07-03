import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AppContext';

// Public
import Landing  from '../pages/Landing';
import Login    from '../pages/Login';
import ErrorPage from '../pages/ErrorPage';

// Patient
import PatientDashboard    from '../pages/patient/PatientDashboard';
import PatientAppointments from '../pages/patient/PatientAppointments';
import { PatientBilling, PatientProfile, BillDetail } from '../pages/patient/PatientOther';

// Doctor
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorSalary    from '../pages/doctor/DoctorSalary';
import DoctorShifts    from '../pages/doctor/DoctorShifts';
import { DoctorPatients, DoctorOperations, DoctorPatientDetail, OperationDetail } from '../pages/doctor/DoctorPatients';

// Nurse
import { NurseDashboard, NurseAssignments, NurseRooms, NurseShifts, RoomDetail } from '../pages/nurse/NursePages';

// Shared
import AppointmentDetail from '../pages/shared/AppointmentDetail';
import ShiftDetail       from '../pages/shared/ShiftDetail';

// Admin
import AdminDashboard    from '../pages/admin/AdminDashboard';
import AdminPhysicians   from '../pages/admin/AdminPhysicians';
import AdminNurses       from '../pages/admin/AdminNurses';
import AdminPatients     from '../pages/admin/AdminPatients';
import AdminAppointments from '../pages/admin/AdminAppointments';
import { AdminDepartments, AdminProcedures } from '../pages/admin/AdminDeptProc';
import AdminRecordDetail from '../pages/admin/AdminRecordDetail';

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function ShiftsSwitch() {
  const { user } = useAuth();
  if (user?.role === 'nurse') return <NurseShifts />;
  return <DoctorShifts />;
}

function RoleSwitch() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'admin':   return <AdminDashboard />;
    case 'doctor':  return <DoctorDashboard />;
    case 'nurse':   return <NurseDashboard />;
    case 'patient': return <PatientDashboard />;
    default:        return <Navigate to="/login" replace />;
  }
}

export default function AppRoutes() {
  return (
    <Routes>
    
      <Route path="/"      element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route path="/app" element={<RequireAuth><RoleSwitch /></RequireAuth>} />

   
      <Route path="/appointments"    element={<RequireAuth><PatientAppointments /></RequireAuth>} />
      <Route path="/appointments/:id" element={<RequireAuth><AppointmentDetail /></RequireAuth>} />
      <Route path="/billing"      element={<RequireAuth><PatientBilling /></RequireAuth>} />
      <Route path="/billing/:id"  element={<RequireAuth><BillDetail /></RequireAuth>} />
      <Route path="/profile"      element={<RequireAuth><PatientProfile /></RequireAuth>} />

      <Route path="/patients"     element={<RequireAuth><DoctorPatients /></RequireAuth>} />
      <Route path="/patients/:ssn" element={<RequireAuth><DoctorPatientDetail /></RequireAuth>} />
      <Route path="/operations"   element={<RequireAuth><DoctorOperations /></RequireAuth>} />
      <Route path="/operations/:id" element={<RequireAuth><OperationDetail /></RequireAuth>} />
      <Route path="/salary"       element={<RequireAuth><DoctorSalary /></RequireAuth>} />
      <Route path="/shifts"       element={<RequireAuth><ShiftsSwitch /></RequireAuth>} />
      <Route path="/shifts/:id"   element={<RequireAuth><ShiftDetail /></RequireAuth>} />

   
      <Route path="/assignments" element={<RequireAuth><NurseAssignments /></RequireAuth>} />
      <Route path="/rooms"       element={<RequireAuth><NurseRooms /></RequireAuth>} />
      <Route path="/rooms/:id"   element={<RequireAuth><RoomDetail /></RequireAuth>} />

      <Route path="/admin/physicians"   element={<RequireAuth><AdminPhysicians /></RequireAuth>} />
      <Route path="/admin/nurses"       element={<RequireAuth><AdminNurses /></RequireAuth>} />
      <Route path="/admin/patients"     element={<RequireAuth><AdminPatients /></RequireAuth>} />
      <Route path="/admin/departments"  element={<RequireAuth><AdminDepartments /></RequireAuth>} />
      <Route path="/admin/procedures"   element={<RequireAuth><AdminProcedures /></RequireAuth>} />
      <Route path="/admin/appointments" element={<RequireAuth><AdminAppointments /></RequireAuth>} />


      <Route path="/admin/:resource/:id" element={<RequireAuth><AdminRecordDetail /></RequireAuth>} />

      <Route path="*" element={<ErrorPage code={404} />} />
    </Routes>
  );
}