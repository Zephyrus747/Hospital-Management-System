import { useState } from 'react';
import { adminService } from '../services/api';
import { useForm } from '../hooks/useForm';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { useConfirm } from '../hooks/useConfirm';
import { usePagination } from '../hooks/usePagination';
import Pagination from './Pagination';

/**
 * Generic admin resource table.
 *
 * Props:
 *   resource   – json-server resource name (e.g. "physicians")
 *   idField    – primary key field name (e.g. "EmployeeID")
 *   rows       – array of records
 *   columns    – [{ key, label, mono?, badge? }]
 *   onRefresh  – callback to re-fetch after mutation
 *   editFields – [{ key, label, type?, options? }]  – fields shown in edit form
 */
export default function AdminTable({ resource, idField, rows, columns, onRefresh, editFields = [] }) {
  const [editId, setEditId] = useState(null);
  const { form, set, setForm, reset: resetForm } = useForm({});
  const { state, msg, run, reset: resetStatus } = useAsyncAction();
  const confirm = useConfirm();
  const pagination = usePagination(rows, 5);

  const startEdit = (row) => {
    setEditId(row[idField]);
    const initial = {};
    editFields.forEach(f => { initial[f.key] = row[f.key] ?? ''; });
    setForm(initial);
    resetStatus();
  };

  const handleSave = () => {
    run(() => adminService.update(resource, editId, form), 'Saved.')
      .then(() => { setEditId(null); onRefresh(); })
      .catch(() => { /* error is already reflected in `state`/`msg` above */ });
  };

  const handleDelete = (id) => {
    confirm('Delete this record? This cannot be undone.', () => {
      adminService.delete(resource, id).then(onRefresh).catch((err) => alert(err.message));
    });
  };

  const msgStateClasses =
    state === 'success'
      ? 'bg-[var(--success-soft)] text-[var(--success)] border border-[rgba(22,163,74,0.25)]'
      : state === 'error'
      ? 'bg-[var(--danger-soft)] text-[var(--danger)] border border-[rgba(220,38,38,0.25)]'
      : '';

  return (
    <>
      {/* edit drawer */}
      {editId !== null && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-[26px] max-w-[660px] mb-6">
          <div className="flex items-center gap-[10px] [font-family:var(--font-d)] text-[15px] font-semibold mb-[14px] text-[var(--text)]">
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--accent)] shrink-0" />
            Edit record #{editId}
          </div>
          <div className="grid grid-cols-2 max-[560px]:grid-cols-1 gap-4 mt-[18px]">
            {editFields.map(f => (
              <div
                className={`flex flex-col gap-[6px]${editFields.length === 1 ? ' col-span-full' : ''}`}
                key={f.key}
              >
                <label className="text-xs text-[var(--text-dim)] font-semibold tracking-[0.04em] uppercase">
                  {f.label}
                </label>
                {f.options ? (
                  <select
                    className="bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-[13px] py-[10px] text-[var(--text)] text-sm outline-none transition-colors duration-150 focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
                    value={form[f.key] ?? ''}
                    onChange={set(f.key)}
                  >
                    {f.options.map(o => (
                      <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="bg-[var(--surface)] border border-[var(--border)] rounded-[6px] px-[13px] py-[10px] text-[var(--text)] text-sm outline-none transition-colors duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
                    type={f.type || 'text'}
                    value={form[f.key] ?? ''}
                    onChange={set(f.key)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6 items-center flex-wrap">
            <button
              className="inline-flex items-center justify-center gap-2 px-[18px] py-[10px] rounded-[6px] font-semibold text-sm uppercase tracking-[0.04em] border border-transparent cursor-pointer transition-all duration-150 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap leading-none bg-[var(--accent)] text-white hover:bg-[var(--accent-b)] disabled:hover:bg-[var(--accent)]"
              onClick={handleSave}
              disabled={state === 'loading'}
            >
              {state === 'loading' ? 'Saving…' : 'Save changes'}
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 px-[18px] py-[10px] rounded-[6px] font-medium text-sm border border-[var(--border-2)] cursor-pointer transition-all duration-150 active:translate-y-px whitespace-nowrap leading-none bg-transparent text-[var(--text)] hover:border-[var(--accent-bdr)] hover:text-[var(--accent)]"
              onClick={() => { setEditId(null); resetForm(); }}
            >
              Cancel
            </button>
          </div>
          {msg && (
            <div className={`text-[13px] px-[14px] py-[10px] rounded-[6px] mt-[14px] ${msgStateClasses}`}>
              {msg}
            </div>
          )}
        </div>
      )}

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden overflow-x-auto">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr>
              {columns.map(c => (
                <th
                  key={c.key}
                  className="text-left px-4 py-[11px] bg-[var(--surface-2)] text-[var(--text-dim)] text-[11px] uppercase tracking-[0.07em] border-b border-[var(--border)] whitespace-nowrap"
                >
                  {c.label}
                </th>
              ))}
              <th className="text-left px-4 py-[11px] bg-[var(--surface-2)] text-[var(--text-dim)] text-[11px] uppercase tracking-[0.07em] border-b border-[var(--border)] whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pagination.pageItems.map(row => (
              <tr
                key={row[idField]}
                className="last:[&>td]:border-b-0 hover:[&>td]:bg-[var(--surface-2)]"
              >
                {columns.map(c => (
                  <td
                    key={c.key}
                    className={`px-4 py-3 border-b border-[var(--border)] text-[var(--text)] ${c.mono ? '[font-family:var(--font-m)] text-xs' : ''}`}
                  >
                    {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                  </td>
                ))}
                <td className="px-4 py-3 border-b border-[var(--border)] text-[var(--text)]">
                  <div className="flex items-center flex-wrap gap-[6px]">
                    {editFields.length > 0 && (
                      <button
                        className="inline-flex items-center justify-center gap-2 px-[9px] py-[4px] rounded-[4px] font-medium text-[11.5px] border border-[var(--border-2)] cursor-pointer transition-all duration-150 active:translate-y-px whitespace-nowrap leading-none bg-transparent text-[var(--text)] hover:border-[var(--accent-bdr)] hover:text-[var(--accent)]"
                        onClick={() => startEdit(row)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="inline-flex items-center justify-center gap-2 px-[9px] py-[4px] rounded-[4px] font-medium text-[11.5px] border cursor-pointer transition-all duration-150 active:translate-y-px whitespace-nowrap leading-none bg-[var(--danger-soft)] text-[var(--danger)] border-[rgba(220,38,38,0.25)] hover:bg-[var(--danger)] hover:text-white"
                      onClick={() => handleDelete(row[idField])}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="p-6 text-center text-[var(--text-dim)]">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination {...pagination} pageSize={5} />
    </>
  );
}