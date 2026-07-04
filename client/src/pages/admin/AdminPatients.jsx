import { useEffect, useState } from "react";
import { refService, adminService } from "../../services/api";
import AdminTable from "../../components/AdminTable";
import Loader from "../../components/Loader";
import { isBlank, toNum, fmt } from "../../utils/helpers";

export default function AdminPatients() {
  const [rows, setRows] = useState([]);
  const [physicians, setPhysicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    SSN: "",
    Name: "",
    Address: "",
    Phone: "",
    InsuranceID: "",
    PCP: "",
  });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const load = () => {
    setLoading(true);
    Promise.all([refService.patients(), refService.physicians()])
      .then(([p, docs]) => {
        setRows(p);
        setPhysicians(docs);
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
      await adminService.addPatient({
        SSN: toNum(form.SSN),
        Name: form.Name.trim(),
        Address: form.Address.trim(),
        Phone: form.Phone.trim(),
        InsuranceID: toNum(form.InsuranceID),
        PCP: toNum(form.PCP),
      });
      setStatus({ state: "success", msg: "Patient added." });
      setForm({
        SSN: "",
        Name: "",
        Address: "",
        Phone: "",
        InsuranceID: "",
        PCP: "",
      });
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
            Patients
          </h1>
        </div>
      </div>

      <form
        className="mb-7 max-w-[660px] rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[26px]"
        onSubmit={handleAdd}
      >
        <div className="mb-[14px] flex items-center gap-[10px] font-[var(--font-d)] text-[15px] font-semibold text-[var(--text)]">
          <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--accent)]" />
          Add patient
        </div>

        <div className="mt-[18px] grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              SSN
            </label>
            <input
              type="number"
              placeholder="e.g. 100000010"
              value={form.SSN}
              onChange={set("SSN")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Insurance ID
            </label>
            <input
              type="number"
              placeholder="e.g. 12345678"
              value={form.InsuranceID}
              onChange={set("InsuranceID")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-[6px] max-[560px]:col-span-1">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Full name
            </label>
            <input
              placeholder="e.g. Alex Kim"
              value={form.Name}
              onChange={set("Name")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-[6px] max-[560px]:col-span-1">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Address
            </label>
            <input
              placeholder="e.g. 99 Maple Ave"
              value={form.Address}
              onChange={set("Address")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Phone
            </label>
            <input
              placeholder="e.g. 555-0199"
              value={form.Phone}
              onChange={set("Phone")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Primary care physician
            </label>
            <select
              value={form.PCP}
              onChange={set("PCP")}
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
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-transparent bg-[var(--accent)] px-[18px] py-[10px] text-[14px] font-semibold leading-none tracking-[0.04em] text-white uppercase transition duration-150 active:translate-y-px hover:bg-[var(--accent-b)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={status.state === "loading"}
          >
            {status.state === "loading" ? "Adding…" : "+ Add patient"}
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
          resource="patients"
          idField="SSN"
          rows={rows}
          onRefresh={load}
          columns={[
            { key: "SSN", label: "SSN", mono: true },
            { key: "Name", label: "Name" },
            { key: "Phone", label: "Phone", mono: true },
            { key: "Address", label: "Address" },
            {
              key: "PCP",
              label: "PCP",
              render: (v) =>
                physicians.find((p) => p.EmployeeID === v)?.Name || `#${v}`,
            },
          ]}
          editFields={[
            { key: "Name", label: "Full name" },
            { key: "Address", label: "Address" },
            { key: "Phone", label: "Phone" },
          ]}
        />
      )}
    </div>
  );
}
