import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white p-6">

      <h2 className="text-2xl font-bold mb-8">
        Admin Panel
      </h2>

      <nav className="space-y-4">

        <Link
          to="/admin"
          className="block hover:bg-slate-700 p-3 rounded-lg transition"
        >
          Dashboard
        </Link>

        <Link
          to="/patients"
          className="block hover:bg-slate-700 p-3 rounded-lg transition"
        >
          Patients
        </Link>

        <Link
          to="/doctors"
          className="block hover:bg-slate-700 p-3 rounded-lg transition"
        >
            Doctors
        </Link>

        <Link
          to="/appointments"
          className="block hover:bg-slate-700 p-3 rounded-lg transition"
        >
          Appointments
        </Link>

        <Link
          to="/departments"
          className="block hover:bg-slate-700 p-3 rounded-lg transition"
        >
          Departments
        </Link>

      </nav>
    </aside>
  );
};

export default Sidebar;