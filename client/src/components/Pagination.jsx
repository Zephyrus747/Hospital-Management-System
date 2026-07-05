/**
 * Pagination — renders Prev / page-indicator / Next controls.
 * Pass it the object returned by usePagination() directly.
 * Renders nothing when there's only one page.
 */
export default function Pagination({ page, totalPages, next, prev, hasNext, hasPrev, total, pageSize = 5 }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
      <span className="[font-family:var(--font-m)] text-xs text-[var(--text-faint)]">
        {start}–{end} of {total}
      </span>
      <div className="flex items-center flex-wrap gap-2">
        <button
          className="inline-flex items-center justify-center gap-2 px-[9px] py-[4px] rounded-[4px] font-medium text-[11.5px] border border-[var(--border-2)] cursor-pointer transition-all duration-150 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap leading-none bg-transparent text-[var(--text)] hover:border-[var(--accent-bdr)] hover:text-[var(--accent)] disabled:hover:border-[var(--border-2)] disabled:hover:text-[var(--text)]"
          onClick={prev}
          disabled={!hasPrev}
        >
          ← Prev
        </button>
        <span className="text-[12.5px] text-[var(--text-dim)] min-w-[64px] text-center">
          Page {page} / {totalPages}
        </span>
        <button
          className="inline-flex items-center justify-center gap-2 px-[9px] py-[4px] rounded-[4px] font-medium text-[11.5px] border border-[var(--border-2)] cursor-pointer transition-all duration-150 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap leading-none bg-transparent text-[var(--text)] hover:border-[var(--accent-bdr)] hover:text-[var(--accent)] disabled:hover:border-[var(--border-2)] disabled:hover:text-[var(--text)]"
          onClick={next}
          disabled={!hasNext}
        >
          Next →
        </button>
      </div>
    </div>
  );
}