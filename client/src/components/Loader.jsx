export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-[60px] gap-[14px] text-[var(--text-dim)] text-[13px]">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="17" stroke="var(--border-2)" strokeWidth="2"/>
        <path d="M5 20h7l3-9 5 18 3-13 2 4h8" stroke="var(--accent)" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="stroke-dasharray" values="0,80;80,80" dur="1.1s" repeatCount="indefinite"/>
        </path>
      </svg>
      <span>{label}</span>
    </div>
  );
}