export default function Footer() {
  return (
    <footer className="px-7 pt-3 pb-[22px] text-[var(--text-faint)] text-xs border-t border-[var(--border)] flex justify-between items-start gap-2 flex-wrap">
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