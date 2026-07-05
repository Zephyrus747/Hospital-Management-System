export default function Footer() {
  return (
    <footer className="px-7 pt-3 pb-[22px] text-[var(--text-faint)] text-xs border-t border-[var(--border)]">
      <div className="mb-2 overflow-hidden rounded-full  bg-[linear-gradient(90deg,rgba(255,255,255,0.28),rgba(255,255,255,0.12))] backdrop-blur-md">
        <div className="ticker-track">
          <span className="ticker-item">
            • Meridian HMS wishes you all a Happy Doctors&apos; Day! •
          </span>
          <span className="ticker-item">
            • Meridian HMS wishes you all a Happy Doctors&apos; Day! •
          </span>
        </div>
      </div>

      <svg
        className="w-full h-[22px] block mb-[6px] [&>path]:stroke-[var(--accent)] [&>path]:stroke-[1.4] [&>path]:fill-none [&>path]:opacity-50"
        viewBox="0 0 600 22"
        preserveAspectRatio="none"
      >
        <path d="M0 11 H230 L242 2 L254 20 L266 11 H600" />
      </svg>

      {/* <span>Meridian HMS — mock console · json-server backend</span> */}
      {/* <span className="font-mono text-[11px] text-[var(--text-faint)]">v2.0.0</span> */}
    </footer>
  );
}
