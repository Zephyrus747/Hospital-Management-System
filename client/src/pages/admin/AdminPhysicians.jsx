import { useEffect, useState } from "react";
import { refService, adminService } from "../../services/api";
import AdminTable from "../../components/AdminTable";
import Loader from "../../components/Loader";
import { isBlank, toNum, POSITIONS } from "../../utils/helpers";

export default function AdminPhysicians() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    EmployeeID: "",
    Name: "",
    Position: POSITIONS[0],
    SSN: "",
  });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const load = () => {
    setLoading(true);
    refService
      .physicians()
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
      await adminService.addPhysician({
        EmployeeID: toNum(form.EmployeeID),
        Name: form.Name.trim(),
        Position: form.Position,
        SSN: toNum(form.SSN),
      });
      setStatus({ state: "success", msg: "Physician added." });
      setForm({ EmployeeID: "", Name: "", Position: POSITIONS[0], SSN: "" });
      load();
    } catch (err) {
      setStatus({ state: "error", msg: err.message });
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="eyebrow">Admin / manage</span>
          <h1>Physicians</h1>
        </div>
      </div>

      <form
        className="form-card"
        style={{ marginBottom: 28 }}
        onSubmit={handleAdd}
      >
        <div className="sec-title">
          <span className="dot" />
          Add physician
        </div>
        <div className="form-grid">
          <div className="field">
            <label>Employee ID</label>
            <input
              type="number"
              placeholder="e.g. 10"
              value={form.EmployeeID}
              onChange={set("EmployeeID")}
            />
          </div>
          <div className="field">
            <label>SSN</label>
            <input
              type="number"
              placeholder="e.g. 101010101"
              value={form.SSN}
              onChange={set("SSN")}
            />
          </div>
          <div className="field span-2">
            <label>Full name</label>
            <input
              placeholder="e.g. Sarah Newman"
              value={form.Name}
              onChange={set("Name")}
            />
          </div>
          <div className="field span-2">
            <label>Position</label>
            <select value={form.Position} onChange={set("Position")}>
              {POSITIONS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={status.state === "loading"}
          >
            {status.state === "loading" ? "Adding…" : "+ Add physician"}
          </button>
        </div>
        {status.msg && (
          <div
            className={`form-msg ${status.state === "success" ? "success" : "error"}`}
          >
            {status.msg}
          </div>
        )}
      </form>

      {loading ? (
        <Loader />
      ) : (
        <AdminTable
          resource="physicians"
          idField="EmployeeID"
          rows={rows}
          onRefresh={load}
          columns={[
            { key: "EmployeeID", label: "ID", mono: true },
            { key: "Name", label: "Name" },
            {
              key: "Position",
              label: "Position",
              render: (v) => <span className="badge badge-info">{v}</span>,
            },
            { key: "SSN", label: "SSN", mono: true },
          ]}
          editFields={[
            { key: "Name", label: "Full name" },
            {
              key: "Position",
              label: "Position",
              options: POSITIONS.map((p) => ({ value: p, label: p })),
            },
          ]}
        />
      )}
    </div>
  );
}
