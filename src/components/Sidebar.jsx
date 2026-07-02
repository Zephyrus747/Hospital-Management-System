import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-8 text-center border-b border-slate-700 pb-4">
        HMS Portal
      </h2>

      <nav className="space-y-2">

        {/* Existing Links */}

        <Link
          to="/admin"
          className="block p-3 rounded-lg hover:bg-blue-600 transition"
        >
          Dashboard
        </Link>

        <Link
          to="/patients"
          className="block p-3 rounded-lg hover:bg-blue-600 transition"
        >
          Patients
        </Link>

        <Link
          to="/doctors"
          className="block p-3 rounded-lg hover:bg-blue-600 transition"
        >
          Doctors
        </Link>

        <Link
          to="/appointments"
          className="block p-3 rounded-lg hover:bg-blue-600 transition"
        >
          Appointments
        </Link>

        <Link
          to="/departments"
          className="block p-3 rounded-lg hover:bg-blue-600 transition"
        >
          Departments
        </Link>

        <hr className="border-slate-700 my-4" />

        <h3 className="text-sm uppercase text-slate-400 mb-2">
          Doctor Menu
        </h3>

        <Link
          to="/doctor-dashboard"
          className="block p-3 rounded-lg hover:bg-green-600 transition"
        >
          Doctor Dashboard
        </Link>

        <Link
          to="/doctor-patients"
          className="block p-3 rounded-lg hover:bg-green-600 transition"
        >
          Patients List
        </Link>

        <Link
          to="/doctor-appointments"
          className="block p-3 rounded-lg hover:bg-green-600 transition"
        >
          My Appointments
        </Link>

        <Link
          to="/doctor-prescriptions"
          className="block p-3 rounded-lg hover:bg-green-600 transition"
        >
          Prescriptions
        </Link>

        <Link
          to="/doctor-reports"
          className="block p-3 rounded-lg hover:bg-green-600 transition"
        >
          Medical Reports
        </Link>

        <Link
          to="/doctor-profile"
          className="block p-3 rounded-lg hover:bg-green-600 transition"
        >
          My Profile
        </Link>

        <Link
          to="/doctor-settings"
          className="block p-3 rounded-lg hover:bg-green-600 transition"
        >
          Settings
        </Link>

      </nav>
    </aside>
  );
};

export default Sidebar;