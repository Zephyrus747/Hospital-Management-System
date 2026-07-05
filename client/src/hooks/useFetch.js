import { useEffect, useState, useCallback } from 'react';

/**
 * useFetch — runs an async fetcher and tracks its loading/success/error state.
 * The fetcher can reject with an Error that has a `.status` (e.g. 404, 400, 500)
 * so callers can pass that straight into <ErrorPage code={error.status} />.
 *
 * @param {() => Promise<any>} fetcher  async function returning the data
 * @param {Array} deps                  dependency array; re-fetches when these change
 * @returns {{ status: 'loading'|'success'|'error', data: any, error: (Error & { status?: number })|null, refetch: () => void }}
 */
export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  const run = useCallback(() => {
    let cancelled = false;
    setState({ status: 'loading', data: null, error: null });
    fetcher()
      .then((data) => { if (!cancelled) setState({ status: 'success', data, error: null }); })
      .catch((error) => { if (!cancelled) setState({ status: 'error', data: null, error }); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { ...state, refetch: run };
}