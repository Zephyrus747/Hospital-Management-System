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
      <div className="page-head">
        <div>
          <span className="eyebrow">Admin / manage</span>
          <h1>Departments</h1>
        </div>
      </div>

      <form
        className="form-card"
        style={{ marginBottom: 28 }}
        onSubmit={handleAdd}
      >
        <div className="sec-title">
          <span className="dot" />
          Add department
        </div>
        <div className="form-grid">
          <div className="field">
            <label>Department ID</label>
            <input
              type="number"
              placeholder="e.g. 4"
              value={form.DepartmentID}
              onChange={set("DepartmentID")}
            />
          </div>
          <div className="field">
            <label>Head physician</label>
            <select value={form.Head} onChange={set("Head")}>
              <option value="">— Select —</option>
              {physicians.map((p) => (
                <option key={p.EmployeeID} value={p.EmployeeID}>
                  {p.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="field span-2">
            <label>Department name</label>
            <input
              placeholder="e.g. Radiology"
              value={form.Name}
              onChange={set("Name")}
            />
          </div>
        </div>
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={status.state === "loading"}
          >
            {status.state === "loading" ? "Adding…" : "+ Add department"}
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
      <div className="page-head">
        <div>
          <span className="eyebrow">Admin / manage</span>
          <h1>Procedures</h1>
        </div>
      </div>

      <form
        className="form-card"
        style={{ marginBottom: 28 }}
        onSubmit={handleAdd}
      >
        <div className="sec-title">
          <span className="dot" />
          Add procedure
        </div>
        <div className="form-grid">
          <div className="field">
            <label>Code</label>
            <input
              type="number"
              placeholder="e.g. 8"
              value={form.Code}
              onChange={set("Code")}
            />
          </div>
          <div className="field">
            <label>Cost (USD)</label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 1200.00"
              value={form.Cost}
              onChange={set("Cost")}
            />
          </div>
          <div className="field span-2">
            <label>Procedure name</label>
            <input
              placeholder="e.g. Arthroscopic Repair"
              value={form.Name}
              onChange={set("Name")}
            />
          </div>
        </div>
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={status.state === "loading"}
          >
            {status.state === "loading" ? "Adding…" : "+ Add procedure"}
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
