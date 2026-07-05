import { useEffect, useState } from "react";
import { refService, adminService } from "../../services/api";
import AdminTable from "../../components/AdminTable";
import Loader from "../../components/Loader";
import { isBlank, toNum } from "../../utils/helpers";

export default function AdminNurses() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    EmployeeID: "",
    Name: "",
    Position: "Nurse",
    Registered: "1",
    SSN: "",
  });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const load = () => {
    setLoading(true);
    refService
      .nurses()
      .then(setRows)
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if ([form.EmployeeID, form.Name, form.Position, form.SSN].some(isBlank)) {
      setStatus({ state: "error", msg: "All fields required." });
      return;
    }
    setStatus({ state: "loading", msg: "" });
    try {
      await adminService.addNurse({
        EmployeeID: toNum(form.EmployeeID),
        Name: form.Name.trim(),
        Position: form.Position,
        Registered: toNum(form.Registered),
        SSN: toNum(form.SSN),
      });
      setStatus({ state: "success", msg: "Nurse added." });
      setForm({
        EmployeeID: "",
        Name: "",
        Position: "Nurse",
        Registered: "1",
        SSN: "",
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
            Nurses
          </h1>
        </div>
      </div>

      <form
        className="mb-7 max-w-[660px] rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[26px]"
        onSubmit={handleAdd}
      >
        <div className="mb-[14px] flex items-center gap-[10px] font-[var(--font-d)] text-[15px] font-semibold text-[var(--text)]">
          <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--accent)]" />
          Add nurse
        </div>

        <div className="mt-[18px] grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Employee ID
            </label>
            <input
              type="number"
              placeholder="e.g. 104"
              value={form.EmployeeID}
              onChange={set("EmployeeID")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              SSN
            </label>
            <input
              type="number"
              placeholder="e.g. 444444441"
              value={form.SSN}
              onChange={set("SSN")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-[6px] max-[560px]:col-span-1">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Full name
            </label>
            <input
              placeholder="e.g. Maya Patel"
              value={form.Name}
              onChange={set("Name")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Position
            </label>
            <input
              placeholder="e.g. Head Nurse"
              value={form.Position}
              onChange={set("Position")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-dim)]">
              Registered
            </label>
            <select
              value={form.Registered}
              onChange={set("Registered")}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[13px] py-[10px] text-[14px] text-[var(--text)] outline-none transition duration-150 focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-transparent bg-[var(--accent)] px-[18px] py-[10px] text-[14px] font-semibold leading-none tracking-[0.04em] text-white uppercase transition duration-150 active:translate-y-px hover:bg-[var(--accent-b)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={status.state === "loading"}
          >
            {status.state === "loading" ? "Adding…" : "+ Add nurse"}
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
          resource="nurses"
          idField="EmployeeID"
          rows={rows}
          onRefresh={load}
          columns={[
            { key: "EmployeeID", label: "ID", mono: true },
            { key: "Name", label: "Name" },
            { key: "Position", label: "Position" },
            {
              key: "Registered",
              label: "Registered",
              render: (v) => (
                <span
                  className={`inline-flex items-center gap-[5px] rounded-[99px] px-[9px] py-[3px] text-[11px] font-semibold tracking-[0.02em] ${
                    Number(v)
                      ? "bg-[var(--success-soft)] text-[var(--success)]"
                      : "bg-[var(--surface-3)] text-[var(--text-dim)]"
                  }`}
                >
                  {Number(v) ? "Yes" : "No"}
                </span>
              ),
            },
          ]}
          editFields={[
            { key: "Name", label: "Full name" },
            { key: "Position", label: "Position" },
            {
              key: "Registered",
              label: "Registered",
              options: [
                { value: "1", label: "Yes" },
                { value: "0", label: "No" },
              ],
            },
          ]}
        />
      )}
    </div>
  );
}
