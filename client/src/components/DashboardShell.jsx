export default function DashboardShell({ children, className = "" }) {
  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_28%),linear-gradient(135deg,#f8fbff_0%,#eef6ff_42%,#f4fffb_100%)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[12%] h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute bottom-[-40px] right-[10%] h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-[12%] right-[16%] h-56 w-56 rounded-full bg-emerald-300/25 blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.18)_100%)]" />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        <div className="rounded-[28px] border border-white/50 bg-white/45 shadow-[0_10px_30px_rgba(15,23,42,.06),0_24px_80px_rgba(16,185,129,.08)] backdrop-blur-2xl backdrop-saturate-150">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/70" />
          <div className="relative z-10 p-4 md:p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
