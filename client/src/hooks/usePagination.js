import { useState, useMemo, useEffect } from 'react';

/**
 * usePagination — slices an already-loaded array into pages.
 * Automatically clamps back to the last valid page if the source array
 * shrinks (e.g. after a delete) and the current page would go out of bounds.
 *
 * @param {Array} items
 * @param {number} pageSize
 * @returns {{
 *   page: number,
 *   totalPages: number,
 *   pageItems: Array,
 *   total: number,
 *   setPage: (n: number) => void,
 *   next: () => void,
 *   prev: () => void,
 *   hasNext: boolean,
 *   hasPrev: boolean,
 * }}
 */
export function usePagination(items = [], pageSize = 5) {
  const [page, setPageRaw] = useState(1);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPageRaw(totalPages);
  }, [page, totalPages]);

  const setPage = (n) => setPageRaw(Math.min(Math.max(1, n), totalPages));
  const next = () => setPage(page + 1);
  const prev = () => setPage(page - 1);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return {
    page,
    totalPages,
    pageItems,
    total,
    setPage,
    next,
    prev,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}