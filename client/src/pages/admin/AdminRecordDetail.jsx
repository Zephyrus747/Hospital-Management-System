import { useParams, Link } from "react-router-dom";
import { adminService } from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import ErrorPage from "../ErrorPage";

const RESOURCE_META = {
  physicians: {
    label: "Physician",
    idField: "EmployeeID",
    listPath: "/admin/physicians",
  },
  nurses: { label: "Nurse", idField: "EmployeeID", listPath: "/admin/nurses" },
  patients: { label: "Patient", idField: "SSN", listPath: "/admin/patients" },
  departments: {
    label: "Department",
    idField: "DepartmentID",
    listPath: "/admin/departments",
  },
  procedures: {
    label: "Procedure",
    idField: "Code",
    listPath: "/admin/procedures",
  },
  appointments: {
    label: "Appointment",
    idField: "AppointmentID",
    listPath: "/admin/appointments",
  },
};

// "ExaminationRoom" -> "Examination Room"
const splitLabel = (key) => key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");

export default function AdminRecordDetail() {
  const { resource, id } = useParams();
  const meta = RESOURCE_META[resource];

  const {
    status,
    data: record,
    error,
  } = useFetch(() => {
    if (!meta) {
      const e = new Error(`"${resource}" is not a recognized resource type.`);
      e.status = 400;
      return Promise.reject(e);
    }
    return adminService.get(resource, id);
  }, [resource, id]);

  if (status === "loading") return <Loader />;
  if (status === "error")
    return <ErrorPage code={error?.status || 500} message={error?.message} />;

  return (
    <div>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-[6px] block font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
            Admin / {meta.label}
          </span>
          <h1 className="m-0 font-[var(--font-d)] text-[28px] font-bold tracking-[-0.01em] text-[var(--text)]">
            {meta.label} #{record[meta.idField]}
          </h1>
        </div>

        <div>
          <Link
            to={meta.listPath}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-[var(--border-2)] bg-transparent px-[18px] py-[10px] text-[14px] font-medium leading-none text-[var(--text)] transition duration-150 hover:border-[var(--accent-bdr)] hover:text-[var(--accent)] active:translate-y-px"
          >
            ← Back to {meta.label.toLowerCase()}s
          </Link>
        </div>
      </div>

      <div className="max-w-[640px] rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-5">
        {Object.entries(record).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 border-b border-[var(--border)] py-3 last:border-b-0"
          >
            <span className="text-[13px] text-[var(--text-dim)]">
              {splitLabel(key)}
            </span>
            <span className="text-right text-[14px] font-semibold text-[var(--text)]">
              {value === null || value === undefined || value === ""
                ? "—"
                : typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
