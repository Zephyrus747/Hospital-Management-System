import { useEffect, useState } from "react";
import { refService, adminService } from "../../services/api";
import AdminTable from "../../components/AdminTable";
import Loader from "../../components/Loader";
import { isBlank, toNum } from "../../utils/helpers";

export function AdminDepartments() {
  const [rows, setRows] = useState([]);
  const [physicians, setPhysicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ DepartmentID: "", Name: "", Head: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const load = () => {
    setLoading(true);
    Promise.all([refService.departments(), refService.physicians()])
      .then(([d, p]) => {
        setRows(d);
        setPhysicians(p);
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (Object.values(form).some(isBlank)) {
      setStatus({ state: "error", msg: "All fields required." });
      return;
    }
    setStatus({ state: "loading", msg: "" });
    try {
      await adminService.addDepartment({
        DepartmentID: toNum(form.DepartmentID),
        Name: form.Name.trim(),
        Head: toNum(form.Head),
      });
      setStatus({ state: "success", msg: "Department added." });
      setForm({ DepartmentID: "", Name: "", Head: "" });
      load();
    } catch (err) {
      setStatus({ state: "error", msg: err.message });
    }
  };

  return (
    <div>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-[6px] block font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
            Admin / manage
          </span>
          <h1 className="m-0 font-[var(--font-d)] text-[28px] font-bold tracking-[-0.01em] text-[var(--text)]">
            Departments
          </h1>
        </div>
      </div>

      <form
        className="mb-7 max-w-[660px] rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[26px]"
        onSubmit={handleAdd}
      >
        <div className="mb-[14px] flex items-center gap-[10px] font-[var(--font-d)] text-[15px] font-semibold text-[var(--text)]">
          <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--accent)]" />
          Add department
        </div>

        <div className="mt-[18px] grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Department ID
            </label>
            <input
              type="number"
              placeholder="e.g. 4"
              value={form.DepartmentID}
              onChange={set("DepartmentID")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Head physician
            </label>
            <select
              value={form.Head}
              onChange={set("Head")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            >
              <option value="">— Select —</option>
              {physicians.map((p) => (
                <option key={p.EmployeeID} value={p.EmployeeID}>
                  {p.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 flex flex-col gap-[6px] max-[560px]:col-span-1">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Department name
            </label>
            <input
              placeholder="e.g. Radiology"
              value={form.Name}
              onChange={set("Name")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-transparent bg-[var(--accent)] px-[18px] py-[10px] text-[14px] font-semibold leading-none tracking-[0.04em] text-white uppercase transition duration-150 active:translate-y-px hover:bg-[var(--accent-b)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={status.state === "loading"}
          >
            {status.state === "loading" ? "Adding…" : "+ Add department"}
          </button>
        </div>

        {status.msg && (
          <div
            className={`mt-[14px] rounded-[6px] border px-[14px] py-[10px] text-[13px] ${
              status.state === "success"
                ? "border-[rgba(22,163,74,.25)] bg-[var(--success-soft)] text-[var(--success)]"
                : "border-[rgba(220,38,38,.25)] bg-[var(--danger-soft)] text-[var(--danger)]"
            }`}
          >
            {status.msg}
          </div>
        )}
      </form>

      {loading ? (
        <Loader />
      ) : (
        <AdminTable
          resource="departments"
          idField="DepartmentID"
          rows={rows}
          onRefresh={load}
          columns={[
            { key: "DepartmentID", label: "ID", mono: true },
            { key: "Name", label: "Name" },
            {
              key: "Head",
              label: "Head",
              render: (v) =>
                physicians.find((p) => p.EmployeeID === v)?.Name || `#${v}`,
            },
          ]}
          editFields={[
            { key: "Name", label: "Department name" },
            {
              key: "Head",
              label: "Head physician ID (EmployeeID)",
              type: "number",
            },
          ]}
        />
      )}
    </div>
  );
}

export function AdminProcedures() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ Code: "", Name: "", Cost: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const load = () => {
    setLoading(true);
    refService
      .procedures()
      .then(setRows)
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (Object.values(form).some(isBlank)) {
      setStatus({ state: "error", msg: "All fields required." });
      return;
    }
    setStatus({ state: "loading", msg: "" });
    try {
      await adminService.addProcedure({
        Code: toNum(form.Code),
        Name: form.Name.trim(),
        Cost: Number(form.Cost),
      });
      setStatus({ state: "success", msg: "Procedure added." });
      setForm({ Code: "", Name: "", Cost: "" });
      load();
    } catch (err) {
      setStatus({ state: "error", msg: err.message });
    }
  };

  return (
    <div>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-[6px] block font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
            Admin / manage
          </span>
          <h1 className="m-0 font-[var(--font-d)] text-[28px] font-bold tracking-[-0.01em] text-[var(--text)]">
            Procedures
          </h1>
        </div>
      </div>

      <form
        className="mb-7 max-w-[660px] rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[26px]"
        onSubmit={handleAdd}
      >
        <div className="mb-[14px] flex items-center gap-[10px] font-[var(--font-d)] text-[15px] font-semibold text-[var(--text)]">
          <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--accent)]" />
          Add procedure
        </div>

        <div className="mt-[18px] grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Code
            </label>
            <input
              type="number"
              placeholder="e.g. 8"
              value={form.Code}
              onChange={set("Code")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Cost (USD)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 1200.00"
              value={form.Cost}
              onChange={set("Cost")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-[6px] max-[560px]:col-span-1">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Procedure name
            </label>
            <input
              placeholder="e.g. Arthroscopic Repair"
              value={form.Name}
              onChange={set("Name")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-transparent bg-[var(--accent)] px-[18px] py-[10px] text-[14px] font-semibold leading-none tracking-[0.04em] text-white uppercase transition duration-150 active:translate-y-px hover:bg-[var(--accent-b)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={status.state === "loading"}
          >
            {status.state === "loading" ? "Adding…" : "+ Add procedure"}
          </button>
        </div>

        {status.msg && (
          <div
            className={`mt-[14px] rounded-[6px] border px-[14px] py-[10px] text-[13px] ${
              status.state === "success"
                ? "border-[rgba(22,163,74,.25)] bg-[var(--success-soft)] text-[var(--success)]"
                : "border-[rgba(220,38,38,.25)] bg-[var(--danger-soft)] text-[var(--danger)]"
            }`}
          >
            {status.msg}
          </div>
        )}
      </form>

      {loading ? (
        <Loader />
      ) : (
        <AdminTable
          resource="procedures"
          idField="Code"
          rows={rows}
          onRefresh={load}
          columns={[
            { key: "Code", label: "Code", mono: true },
            { key: "Name", label: "Procedure" },
            {
              key: "Cost",
              label: "Cost",
              mono: true,
              render: (v) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(v),
            },
          ]}
          editFields={[
            { key: "Name", label: "Procedure name" },
            { key: "Cost", label: "Cost (USD)", type: "number" },
          ]}
        />
      )}
    </div>
  );
}
