import {
  Users,
  Stethoscope,
  CalendarDays,
  Building2,
  Activity,
  Plus,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Patients",
    value: 124,
    icon: <Users size={26} />,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Doctors",
    value: 32,
    icon: <Stethoscope size={26} />,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Appointments",
    value: 48,
    icon: <CalendarDays size={26} />,
    color: "bg-orange-100 text-orange-700",
  },
  {
    title: "Departments",
    value: 8,
    icon: <Building2 size={26} />,
    color: "bg-purple-100 text-purple-700",
  },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Heading */}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Welcome, Admin...</h1>

        <p className="text-slate-500 mt-2">
          Here's an overview of today's hospital activities.
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500 text-sm">{item.title}</p>

                <h2 className="text-4xl font-bold mt-3 text-slate-800">
                  {item.value}
                </h2>
              </div>

              <div
                className={`h-14 w-14 rounded-xl flex items-center justify-center ${item.color}`}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lower Grid */}

      <div className="grid lg:grid-cols-3 gap-6 mt-10">
        {/* Quick Actions */}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-5">
            Quick Actions
          </h2>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white px-5 py-4 rounded-xl transition">
              <span className="flex items-center gap-2">
                <Plus size={18} />
                Add Patient
              </span>

              <ArrowRight size={18} />
            </button>

            <button className="w-full flex items-center justify-between bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-4 rounded-xl transition">
              <span className="flex items-center gap-2">
                <Plus size={18} />
                Add Doctor
              </span>

              <ArrowRight size={18} />
            </button>

            <button className="w-full flex items-center justify-between bg-orange-500 hover:bg-orange-600 text-white px-5 py-4 rounded-xl transition">
              <span className="flex items-center gap-2">
                <Plus size={18} />
                New Appointment
              </span>

              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Activity */}

        <div className="bg-white rounded-2xl shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-blue-600" />

            <h2 className="text-xl font-semibold text-slate-800">
              Recent Activity
            </h2>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between border-b pb-3">
              <div>
                <p className="font-medium text-slate-800">
                  New Patient Registered
                </p>

                <p className="text-sm text-slate-500">Rahul Sharma</p>
              </div>

              <span className="text-sm text-slate-400">10 mins ago</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <div>
                <p className="font-medium text-slate-800">Appointment Booked</p>

                <p className="text-sm text-slate-500">Dr. Amit - Cardiology</p>
              </div>

              <span className="text-sm text-slate-400">35 mins ago</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <div>
                <p className="font-medium text-slate-800">Doctor Added</p>

                <p className="text-sm text-slate-500">Neurology Department</p>
              </div>

              <span className="text-sm text-slate-400">Today</span>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="font-medium text-slate-800">Billing Updated</p>

                <p className="text-sm text-slate-500">Patient #1024</p>
              </div>

              <span className="text-sm text-slate-400">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
