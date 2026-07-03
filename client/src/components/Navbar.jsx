import { useLocation } from 'react-router-dom';

const TITLES = {
  '/app': 'Dashboard',
  '/appointments': 'Appointments',
  '/profile': 'My Profile',
  '/billing': 'Billing',
  '/shifts': 'Duty Shifts',
  '/patients': 'My Patients',
  '/salary': 'Salary & Commission',
  '/operations': 'Operations',
  '/assignments': 'Assignments',
  '/rooms': 'Rooms',
  '/admin/physicians': 'Manage Physicians',
  '/admin/nurses': 'Manage Nurses',
  '/admin/patients': 'Manage Patients',
  '/admin/departments': 'Manage Departments',
  '/admin/procedures': 'Manage Procedures',
  '/admin/appointments': 'Manage Appointments',
};

export default function Navbar() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] || 'Meridian HMS';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="flex items-center justify-between px-10 h-16 bg-[#fff] border-b border-[#E2E8F0] sticky top-0 z-50 shadow-[0_1px_4px_rgba(37,99,235,0.06)] font-['Roboto',sans-serif]">
      <div className="font-['Inter',sans-serif] text-lg font-semibold text-[#1E293B]">
        <span className="text-[#64748B] font-normal">Meridian / </span>
        <span className="text-[#1E3A8A]">{title}</span>
      </div>
      <div className="text-sm text-[#64748B]">
        {today}
      </div>
    </header>
  );
}