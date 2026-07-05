import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import { fmt } from "../utils/helpers";

const ICONS = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12h4l2-7 4 14 3-9 2 4h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3 10h18M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  bill: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7 8h10M7 12h6M7 16h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7v5l3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  stethoscope: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 3v6a4 4 0 008 0V3M9 13v2a5 5 0 005 5 5 5 0 005-5v-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="19" cy="9" r="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  dollar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  scissors: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3a3 3 0 100 6 3 3 0 000-6zM6 15a3 3 0 100 6 3 3 0 000-6zM20 4L8.12 15.88M15.88 15.88L20 20M20 4l-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  bed: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 18v-7a2 2 0 012-2h14a2 2 0 012 2v7M3 18h18M3 18v2M21 18v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3 13V8h5v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  ),
  nurse: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 10h4M12 8v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  room: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 8h2M13 8h2M9 12h2M13 12h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const NAV = {
  patient: [
    {
      label: "My portal",
      items: [
        { to: "/app", label: "Overview", icon: "dashboard" },
        { to: "/appointments", label: "Appointments", icon: "calendar" },
        { to: "/billing", label: "My Bill", icon: "bill" },
        { to: "/profile", label: "Profile", icon: "user" },
      ],
    },
  ],
  doctor: [
    {
      label: "My workspace",
      items: [
        { to: "/app", label: "Overview", icon: "dashboard" },
        { to: "/patients", label: "My Patients", icon: "bed" },
        { to: "/appointments", label: "Appointments", icon: "calendar" },
        { to: "/operations", label: "Operations", icon: "scissors" },
      ],
    },
    {
      label: "Career",
      items: [
        { to: "/shifts", label: "Duty Shifts", icon: "clock" },
        { to: "/salary", label: "Salary & Commission", icon: "dollar" },
      ],
    },
  ],
  nurse: [
    {
      label: "My workspace",
      items: [
        { to: "/app", label: "Overview", icon: "dashboard" },
        { to: "/assignments", label: "Assignments", icon: "nurse" },
        { to: "/rooms", label: "Rooms & Blocks", icon: "room" },
        { to: "/shifts", label: "Duty Shifts", icon: "clock" },
      ],
    },
  ],
  admin: [
    {
      label: "Overview",
      items: [{ to: "/app", label: "Dashboard", icon: "dashboard" }],
    },
    {
      label: "Manage",
      items: [
        { to: "/admin/physicians", label: "Physicians", icon: "stethoscope" },
        { to: "/admin/nurses", label: "Nurses", icon: "nurse" },
        { to: "/admin/patients", label: "Patients", icon: "bed" },
        { to: "/admin/departments", label: "Departments", icon: "settings" },
        { to: "/admin/procedures", label: "Procedures", icon: "scissors" },
        { to: "/admin/appointments", label: "Appointments", icon: "calendar" },
      ],
    },
  ],
};

const linkBase =
  "flex items-center gap-[10px] px-[10px] py-[9px] rounded-lg text-[13.5px] font-medium transition-all duration-[120ms] cursor-pointer border-none bg-none w-full text-left";
const linkInactive =
  "text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]";
const linkActive =
  "bg-[rgba(30,58,138,0.08)] text-[var(--accent-b)] font-semibold";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const groups = NAV[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar bg-(--surface) border-r border-border flex flex-col px-3 py-4.5 gap-4.5 h-full overflow-hidden">
      <div className="flex items-center gap-2.5 px-1.5 pb-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center [font-family:var(--font-d)] font-bold text-[17px] text-white">
          +
        </div>
        <div>
          <div className="[font-family:var(--font-d)] font-semibold text-sm text-(--accent-b)">
            Meridian HMS
          </div>
          <div className="[font-family:var(--font-m)] text-[10px] text-(--text-faint)">
            ops console
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-4 flex-1 min-h-0">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="text-[10px] uppercase tracking-widest text-(--text-faint) px-2 pb-1.25 font-semibold">
              {g.label}
            </div>
            {g.items.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                {ICONS[icon]}
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-2 border-t border-border pt-3 shrink-0">
        {user && (
          <div className="flex items-center gap-2.5 px-2.5 py-2.5">
            <div className="w-7.5 h-7.5 rounded-full bg-(--accent-soft) border border-(--accent-bdr) flex items-center justify-center text-[11px] font-bold text-(--accent-b)">
              {fmt.initials(user.displayName)}
            </div>
            <div>
              <div className="text-[13px] font-semibold leading-[1.2] text-(--text)">
                {user.displayName}
              </div>
              <div className="text-[11px] text-(--text-faint)">{user.role}</div>
            </div>
          </div>
        )}
        <button
          className={`${linkBase} ${linkInactive}`}
          onClick={handleLogout}
        >
          {ICONS.logout}
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
