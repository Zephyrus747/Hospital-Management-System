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
      <div className="page-head">
        <div>
          <span className="eyebrow">Admin / manage</span>
          <h1>Patients</h1>
        </div>
      </div>

      <form
        className="form-card"
        style={{ marginBottom: 28 }}
        onSubmit={handleAdd}
      >
        <div className="sec-title">
          <span className="dot" />
          Add patient
        </div>
        <div className="form-grid">
          <div className="field">
            <label>SSN</label>
            <input
              type="number"
              placeholder="e.g. 100000010"
              value={form.SSN}
              onChange={set("SSN")}
            />
          </div>
          <div className="field">
            <label>Insurance ID</label>
            <input
              type="number"
              placeholder="e.g. 12345678"
              value={form.InsuranceID}
              onChange={set("InsuranceID")}
            />
          </div>
          <div className="field span-2">
            <label>Full name</label>
            <input
              placeholder="e.g. Alex Kim"
              value={form.Name}
              onChange={set("Name")}
            />
          </div>
          <div className="field span-2">
            <label>Address</label>
            <input
              placeholder="e.g. 99 Maple Ave"
              value={form.Address}
              onChange={set("Address")}
            />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              placeholder="e.g. 555-0199"
              value={form.Phone}
              onChange={set("Phone")}
            />
          </div>
          <div className="field">
            <label>Primary care physician</label>
            <select value={form.PCP} onChange={set("PCP")}>
              <option value="">— Select —</option>
              {physicians.map((p) => (
                <option key={p.EmployeeID} value={p.EmployeeID}>
                  {p.Name}
                </option>
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
            {status.state === "loading" ? "Adding…" : "+ Add patient"}
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
