import { useState, useCallback } from "react";

/**
 * useForm — controlled form state plus a `set(field)` factory that returns an
 * onChange-compatible handler (also accepts a raw value directly, not just an event).
 *
 * @param {object} initialValues
 * @returns {{ form: object, set: (key: string) => (eventOrValue: any) => void, setForm: Function, reset: (values?: object) => void }}
 */
export function useForm(initialValues = {}) {
  const [form, setForm] = useState(initialValues);

  const set = useCallback(
    (key) => (eventOrValue) => {
      const value =
        eventOrValue && eventOrValue.target
          ? eventOrValue.target.value
          : eventOrValue;
      setForm((f) => ({ ...f, [key]: value }));
    },
    [],
  );

  const reset = useCallback(
    (values = initialValues) => setForm(values),
    [initialValues],
  );

  return { form, set, setForm, reset };
}
