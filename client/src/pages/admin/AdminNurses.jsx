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
      <div className="page-head">
        <div>
          <span className="eyebrow">Admin / manage</span>
          <h1>Nurses</h1>
        </div>
      </div>

      <form
        className="form-card"
        style={{ marginBottom: 28 }}
        onSubmit={handleAdd}
      >
        <div className="sec-title">
          <span className="dot" />
          Add nurse
        </div>
        <div className="form-grid">
          <div className="field">
            <label>Employee ID</label>
            <input
              type="number"
              placeholder="e.g. 104"
              value={form.EmployeeID}
              onChange={set("EmployeeID")}
            />
          </div>
          <div className="field">
            <label>SSN</label>
            <input
              type="number"
              placeholder="e.g. 444444441"
              value={form.SSN}
              onChange={set("SSN")}
            />
          </div>
          <div className="field span-2">
            <label>Full name</label>
            <input
              placeholder="e.g. Maya Patel"
              value={form.Name}
              onChange={set("Name")}
            />
          </div>
          <div className="field">
            <label>Position</label>
            <input
              placeholder="e.g. Head Nurse"
              value={form.Position}
              onChange={set("Position")}
            />
          </div>
          <div className="field">
            <label>Registered</label>
            <select value={form.Registered} onChange={set("Registered")}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={status.state === "loading"}
          >
            {status.state === "loading" ? "Adding…" : "+ Add nurse"}
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
                  className={`badge ${Number(v) ? "badge-success" : "badge-neutral"}`}
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
