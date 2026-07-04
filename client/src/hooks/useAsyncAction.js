import { useState, useCallback } from 'react';

/**
 * useAsyncAction — tracks idle/loading/success/error state for a one-off async
 * action (form submit, save, delete) and exposes a `run(action, successMsg)`
 * function to trigger it. Rethrows on failure so callers can chain `.catch()`
 * if they need to, but the hook's own `state`/`msg` already reflect the outcome.
 *
 * @returns {{ state: 'idle'|'loading'|'success'|'error', msg: string, run: (action: () => Promise<any>, successMsg?: string) => Promise<any>, reset: () => void }}
 */
export function useAsyncAction() {
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  const run = useCallback(async (action, successMsg = '') => {
    setStatus({ state: 'loading', msg: '' });
    try {
      const result = await action();
      setStatus({ state: 'success', msg: successMsg });
      return result;
    } catch (err) {
      setStatus({ state: 'error', msg: err.message || 'Something went wrong.' });
      throw err;
    }
  }, []);

  const reset = useCallback(() => setStatus({ state: 'idle', msg: '' }), []);

  return { ...status, run, reset };
}