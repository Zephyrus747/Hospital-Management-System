import { useEffect, useState } from "react";
import { refService, adminService } from "../../services/api";
import Loader from "../../components/Loader";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionState, setActionState] = useState({
    type: "",
    id: null,
    msg: "",
  });

  const load = () => {
    setLoading(true);
    refService
      .appointments()
      .then(setAppointments)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (appt) => {
    setEditingId(appt.AppointmentID);
    setEditForm({
      Patient: appt.Patient ?? "",
      Physician: appt.Physician ?? "",
      PrepNurse: appt.PrepNurse ?? "",
      Starto: appt.Starto ?? "",
      Endo: appt.Endo ?? "",
      ExaminationRoom: appt.ExaminationRoom ?? "",
    });
    setActionState({ type: "", id: null, msg: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setActionState({ type: "", id: null, msg: "" });
  };

  const set = (key) => (e) =>
    setEditForm((f) => ({
      ...f,
      [key]: e.target.value,
    }));

  const handleSave = async (id) => {
    setActionState({ type: "save", id, msg: "" });
    try {
      await adminService.update("appointments", id, {
        Patient: Number(editForm.Patient),
        Physician: Number(editForm.Physician),
        PrepNurse:
          editForm.PrepNurse === "" ? null : Number(editForm.PrepNurse),
        Starto: editForm.Starto,
        Endo: editForm.Endo,
        ExaminationRoom: editForm.ExaminationRoom,
      });

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.AppointmentID === id
            ? {
                ...appt,
                Patient: Number(editForm.Patient),
                Physician: Number(editForm.Physician),
                PrepNurse:
                  editForm.PrepNurse === "" ? null : Number(editForm.PrepNurse),
                Starto: editForm.Starto,
                Endo: editForm.Endo,
                ExaminationRoom: editForm.ExaminationRoom,
              }
            : appt,
        ),
      );

      setEditingId(null);
      setEditForm({});
      setActionState({ type: "success", id, msg: "Appointment updated." });
    } catch (err) {
      setActionState({
        type: "error",
        id,
        msg: err.message || "Failed to update appointment.",
      });
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this appointment?",
    );
    if (!ok) return;

    setActionState({ type: "delete", id, msg: "" });
    try {
      await adminService.delete("appointments", id);
      setAppointments((prev) =>
        prev.filter((appt) => appt.AppointmentID !== id),
      );
      if (editingId === id) {
        setEditingId(null);
        setEditForm({});
      }
      setActionState({ type: "success", id, msg: "Appointment deleted." });
    } catch (err) {
      setActionState({
        type: "error",
        id,
        msg: err.message || "Failed to delete appointment.",
      });
    }
  };

  if (loading) return <Loader label="Loading appointments…" />;

  return (
    <div>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-[6px] block font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
            Admin / manage
          </span>
          <h1 className="m-0 font-[var(--font-d)] text-[28px] font-bold tracking-[-0.01em] text-[var(--text)]">
            Appointments
          </h1>
        </div>
      </div>

      {actionState.msg && (
        <div
          className={`mb-4 rounded-[6px] border px-[14px] py-[10px] text-[13px] ${
            actionState.type === "success"
              ? "border-[rgba(22,163,74,.25)] bg-[var(--success-soft)] text-[var(--success)]"
              : actionState.type === "error"
                ? "border-[rgba(220,38,38,.25)] bg-[var(--danger-soft)] text-[var(--danger)]"
                : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-dim)]"
          }`}
        >
          {actionState.msg}
        </div>
      )}

      <div className="overflow-x-auto rounded-[16px] border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="bg-[var(--surface-2)]">
              <th className="whitespace-nowrap border-b border-[var(--border)] px-4 py-[11px] text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-dim)]">
                Appointment ID
              </th>
              <th className="whitespace-nowrap border-b border-[var(--border)] px-4 py-[11px] text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-dim)]">
                Patient
              </th>
              <th className="whitespace-nowrap border-b border-[var(--border)] px-4 py-[11px] text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-dim)]">
                Physician
              </th>
              <th className="whitespace-nowrap border-b border-[var(--border)] px-4 py-[11px] text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-dim)]">
                Prep Nurse
              </th>
              <th className="whitespace-nowrap border-b border-[var(--border)] px-4 py-[11px] text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-dim)]">
                Start
              </th>
              <th className="whitespace-nowrap border-b border-[var(--border)] px-4 py-[11px] text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-dim)]">
                End
              </th>
              <th className="whitespace-nowrap border-b border-[var(--border)] px-4 py-[11px] text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-dim)]">
                Room
              </th>
              <th className="whitespace-nowrap border-b border-[var(--border)] px-4 py-[11px] text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-dim)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appt) => {
                const isEditing = editingId === appt.AppointmentID;
                const busy =
                  actionState.id === appt.AppointmentID &&
                  (actionState.type === "save" ||
                    actionState.type === "delete");

                return (
                  <tr
                    key={appt.AppointmentID}
                    className="transition duration-150 hover:bg-[var(--surface-2)]"
                  >
                    <td className="border-b border-[var(--border)] px-4 py-3 font-mono text-[12px] text-[var(--text)]">
                      {appt.AppointmentID}
                    </td>

                    <td className="border-b border-[var(--border)] px-4 py-3 text-[var(--text)]">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.Patient}
                          onChange={set("Patient")}
                          className="w-[110px] rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
                        />
                      ) : (
                        appt.Patient
                      )}
                    </td>

                    <td className="border-b border-[var(--border)] px-4 py-3 text-[var(--text)]">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.Physician}
                          onChange={set("Physician")}
                          className="w-[110px] rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
                        />
                      ) : (
                        appt.Physician
                      )}
                    </td>

                    <td className="border-b border-[var(--border)] px-4 py-3 text-[var(--text)]">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.PrepNurse}
                          onChange={set("PrepNurse")}
                          className="w-[110px] rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
                        />
                      ) : (
                        (appt.PrepNurse ?? "—")
                      )}
                    </td>

                    <td className="border-b border-[var(--border)] px-4 py-3 text-[var(--text)]">
                      {isEditing ? (
                        <input
                          value={editForm.Starto}
                          onChange={set("Starto")}
                          className="w-[180px] rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
                        />
                      ) : (
                        appt.Starto
                      )}
                    </td>

                    <td className="border-b border-[var(--border)] px-4 py-3 text-[var(--text)]">
                      {isEditing ? (
                        <input
                          value={editForm.Endo}
                          onChange={set("Endo")}
                          className="w-[180px] rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
                        />
                      ) : (
                        appt.Endo
                      )}
                    </td>

                    <td className="border-b border-[var(--border)] px-4 py-3 text-[var(--text)]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.ExaminationRoom}
                          onChange={set("ExaminationRoom")}
                          className="w-[100px] rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] outline-none focus:border-[var(--accent)] focus:bg-[var(--surface-2)]"
                        />
                      ) : (
                        appt.ExaminationRoom
                      )}
                    </td>

                    <td className="border-b border-[var(--border)] px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSave(appt.AppointmentID)}
                              disabled={busy}
                              className="inline-flex items-center justify-center rounded-[6px] bg-[var(--accent)] px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-[var(--accent-b)] disabled:opacity-50"
                            >
                              {busy && actionState.type === "save"
                                ? "Saving..."
                                : "Save"}
                            </button>

                            <button
                              type="button"
                              onClick={cancelEdit}
                              disabled={busy}
                              className="inline-flex items-center justify-center rounded-[6px] border border-[var(--border-2)] px-3 py-2 text-[12px] font-medium text-[var(--text)] transition hover:border-[var(--accent-bdr)] hover:text-[var(--accent)] disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(appt)}
                              disabled={busy}
                              className="inline-flex items-center justify-center rounded-[6px] border border-[var(--border-2)] px-3 py-2 text-[12px] font-medium text-[var(--text)] transition hover:border-[var(--accent-bdr)] hover:text-[var(--accent)] disabled:opacity-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(appt.AppointmentID)}
                              disabled={busy}
                              className="inline-flex items-center justify-center rounded-[6px] border border-[rgba(220,38,38,.25)] bg-[var(--danger-soft)] px-3 py-2 text-[12px] font-semibold text-[var(--danger)] transition hover:bg-[var(--danger)] hover:text-white disabled:opacity-50"
                            >
                              {busy && actionState.type === "delete"
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-8 text-center text-[14px] text-[var(--text-dim)]"
                >
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
