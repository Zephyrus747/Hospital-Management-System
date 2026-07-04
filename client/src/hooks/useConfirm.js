import { useCallback } from 'react';

/**
 * useConfirm — wraps a confirmation prompt behind a hook so the underlying
 * mechanism (currently window.confirm) can be swapped for a custom modal
 * later without touching any of the call sites.
 *
 * @returns {(message: string, onConfirm: () => void) => void}
 */
export function useConfirm() {
  return useCallback((message, onConfirm) => {
    if (window.confirm(message)) onConfirm();
  }, []);
}