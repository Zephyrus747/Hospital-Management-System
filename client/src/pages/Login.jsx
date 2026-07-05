import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";
import { useAuth } from "../context/AppContext";
import loginImg from "../assets/login-img.jpg";
const SHORTCUTS = [
  { label: "Admin", username: "admin", password: "admin123", role: "admin" },
  {
    label: "Doctor",
    username: "jdorian",
    password: "doctor123",
    role: "doctor",
  },
  {
    label: "Nurse",
    username: "cespinosa",
    password: "nurse123",
    role: "nurse",
  },
  {
    label: "Patient",
    username: "jsmith",
    password: "patient123",
    role: "patient",
  },
];

const ROLE_COLORS = {
  admin: "#1E3A8A",
  doctor: "#2563EB",
  nurse: "#16A34A",
  patient: "#DC2626",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await authService.login(form.username, form.password);
      login(user);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillShortcut = (s) =>
    setForm({ username: s.username, password: s.password });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Roboto',sans-serif]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-5">
        <div className="group relative hidden overflow-hidden lg:col-span-2 lg:block">
          <img
            src={loginImg}
            alt="Meridian hospital care"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-linear-to-br from-[#0F172A]/20 via-[#1E3A8A]/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <div className="max-w-sm rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100">
                Meridian HMS
              </p>
              <p className="font-['Inter',sans-serif] text-xl font-bold leading-tight">
                Care, coordination, and hospital operations in one place.
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#1E3A8A_0%,#2563EB_55%,#3B82F6_100%)] px-6 py-10 lg:col-span-3">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
            <div className="absolute bottom-24 right-24 h-56 w-56 rounded-full bg-emerald-300/20 blur-[100px]" />
          </div>

          <div className="relative z-10 w-full max-w-[420px] rounded-[20px] border border-white/20 bg-[#F8FAFC]/95 px-[36px] py-[40px] shadow-[0_20px_60px_rgba(30,58,138,.25)] backdrop-blur-md">
            <div className="mb-7 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#2563EB] font-['Inter',sans-serif] text-[20px] font-extrabold text-white">
                +
              </div>
              <span className="font-['Inter',sans-serif] text-[18px] font-bold text-[#1E3A8A]">
                Meridian HMS
              </span>
            </div>

            <h2 className="m-0 mb-1.5 font-['Inter',sans-serif] text-[24px] font-semibold text-[#1E293B]">
              Sign in
            </h2>
            <p className="m-0 mb-6 text-[14px] leading-[1.5] text-[#64748B]">
              Enter your credentials to access your portal.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">
                    Username
                  </label>
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. jdorian"
                    value={form.username}
                    onChange={set("username")}
                    className="box-border w-full rounded-lg border border-[#E2E8F0] bg-white px-[14px] py-[10px] text-[14px] text-[#1E293B] outline-none transition-colors focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-[#1E293B]">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set("password")}
                    className="box-border w-full rounded-lg border border-[#E2E8F0] bg-white px-[14px] py-[10px] text-[14px] text-[#1E293B] outline-none transition-colors focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-3 rounded-lg border border-[rgba(252,165,165,1)] bg-[#FEF2F2] px-[14px] py-[10px] text-[13px] text-[#DC2626]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-[18px] w-full rounded-lg border-0 bg-[#2563EB] p-3 text-[15px] font-medium text-white transition-colors hover:bg-[#1E3A8A] disabled:cursor-default disabled:opacity-70"
              >
                {loading ? "Signing in…" : "Sign in →"}
              </button>
            </form>

            {/* <div className="mt-[26px]">
              <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
                Quick fill — demo accounts
              </div>

              {SHORTCUTS.map((s) => (
                <div
                  key={s.username}
                  onClick={() => fillShortcut(s)}
                  className="mb-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg border border-[#E2E8F0] bg-white p-[9px_10px] transition-colors hover:border-[#2563EB]"
                >
                  <span
                    className="min-w-[56px] rounded-[6px] px-[10px] py-[3px] text-center text-[11px] font-semibold"
                    style={{
                      background: `${ROLE_COLORS[s.role]}1A`,
                      border: `1px solid ${ROLE_COLORS[s.role]}55`,
                      color: ROLE_COLORS[s.role],
                    }}
                  >
                    {s.label}
                  </span>
                  <span className="font-mono text-[12.5px] text-[#1E293B]">
                    {s.username}
                  </span>
                  <span className="font-mono text-[12.5px] text-[#64748B]">
                    {s.password}
                  </span>
                  <span className="ml-auto text-[11px] text-[#94A3B8]">
                    click to fill
                  </span>
                </div>
              ))}
            </div> */}

            <div className="mt-5 text-center text-[12.5px] text-[#64748B]">
              <Link to="/" className="text-[#2563EB] no-underline">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
