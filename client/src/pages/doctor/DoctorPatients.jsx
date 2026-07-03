import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AppContext";
import { dashboardService, doctorService } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorPage from "../ErrorPage";
import { fmt } from "../../utils/helpers";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

export function DoctorPatients() {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .doctor(user.employeeId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [user.employeeId]);

  const pagination = usePagination(data?.patients || [], 5);

  if (loading) return <Loader />;

  const { patients, appointments } = data;

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <span className="font-['Roboto_Mono'] text-[11px] font-semibold uppercase tracking-[.14em] text-[#2563EB]">
            Doctor Portal
          </span>

          <h1 className="mt-2 font-['Inter'] text-4xl font-bold text-[#1E293B]">
            My Patients
          </h1>

          <p className="mt-2 text-[#64748B]">
            All patients assigned to you via appointments.
          </p>

        </div>

      </div>

      {/* Patients Grid */}

      <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2 xl:grid-cols-3">

        {pagination.pageItems.map((patient) => {

          const patientAppts = appointments.filter(
            (appointment) => appointment.Patient === patient.SSN
          );

          const admissions = patientAppts.filter(
            (appointment) => appointment.VisitType === "Admission"
          );

          return (

            <Link
              key={patient.SSN}
              to={`/patients/${patient.SSN}`}
              className="rounded-[10px] border border-[#E2E8F0] bg-white p-[16px_18px] transition duration-300 hover:-translate-y-1 hover:border-[#2563EB]/30 hover:shadow-[0_8px_24px_rgba(37,99,235,.08)]"
            >

              <div className="mb-3 flex items-center justify-between gap-2">

                <h2 className="font-['Inter'] text-[15.5px] font-semibold text-[#1E293B]">
                  {patient.Name}
                </h2>

                {admissions.length > 0 && (

                  <span className="inline-flex items-center gap-[5px] rounded-full bg-[#DC2626]/10 px-[9px] py-[3px] text-[11px] font-semibold tracking-[.02em] text-[#DC2626]">
                    Admitted
                  </span>

                )}

              </div>

              <div className="space-y-2 text-[13px] text-[#64748B]">

                <p>
                  <span className="font-medium text-[#1E293B]">
                    Phone:
                  </span>{" "}
                  {patient.Phone}
                </p>

                <p>
                  <span className="font-medium text-[#1E293B]">
                    Address:
                  </span>{" "}
                  {patient.Address}
                </p>

              </div>

              <div className="mt-5 flex items-center justify-between text-[13px]">

                <span className="font-['Roboto_Mono'] text-[11px] text-[#94A3B8]">
                  {fmt.ssnMask(patient.SSN)}
                </span>

                <span className="inline-flex items-center gap-[5px] rounded-full bg-[#2563EB]/10 px-[9px] py-[3px] text-[11px] font-semibold tracking-[.02em] text-[#1E3A8A]">

                  {patientAppts.length} Appointment
                  {patientAppts.length !== 1 ? "s" : ""}

                </span>

              </div>

            </Link>

          );
        })}

        {patients.length === 0 && (

          <div className="col-span-full rounded-[10px] border border-dashed border-[#CBD5E1] bg-[#F1F5F9] py-10 text-center text-[#64748B]">

            No patients yet.

          </div>

        )}

      </div>

      <Pagination
        {...pagination}
        pageSize={5}
      />

    </div>
  );
}
export function DoctorPatientDetail() {
  const { user } = useAuth();
  const { ssn } = useParams();

  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: null,
  });

  useEffect(() => {
    setState({
      status: "loading",
      data: null,
      error: null,
    });

    doctorService
      .patientDetail(user.employeeId, ssn)
      .then((data) =>
        setState({
          status: "success",
          data,
          error: null,
        })
      )
      .catch((error) =>
        setState({
          status: "error",
          data: null,
          error,
        })
      );
  }, [user.employeeId, ssn]);

  if (state.status === "loading") return <Loader />;

  if (state.status === "error") {
    return (
      <ErrorPage
        code={state.error?.status || 404}
        message={
          state.error?.message ||
          "This patient is not under your care, or does not exist."
        }
      />
    );
  }

  const patient = state.data;

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <span className="font-['Roboto_Mono'] text-[11px] font-semibold uppercase tracking-[.14em] text-[#2563EB]">
            Doctor Portal
          </span>

          <h1 className="mt-2 font-['Inter'] text-4xl font-bold text-[#1E293B]">
            {patient.Name}
          </h1>

        </div>

        <div>

          <Link
            to="/patients"
            className="inline-flex items-center rounded-[6px] border border-[#CBD5E1] bg-white px-5 py-2 font-medium text-[#1E293B] shadow-sm transition hover:border-[#2563EB]/30 hover:text-[#2563EB]"
          >
            ← Back to Patients
          </Link>

        </div>

      </div>

      {/* Patient Information */}

      <div className="max-w-xl rounded-[10px] border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_24px_rgba(30,58,138,.08)]">

        <div className="space-y-5">

          <div className="flex items-center justify-between border-b border-dashed border-[#E2E8F0] pb-3">

            <span className="font-medium text-[#64748B]">
              SSN
            </span>

            <span className="font-['Roboto_Mono'] text-[#1E293B]">
              {fmt.ssnMask(patient.SSN)}
            </span>

          </div>

          <div className="flex items-center justify-between border-b border-dashed border-[#E2E8F0] pb-3">

            <span className="font-medium text-[#64748B]">
              Phone
            </span>

            <span className="text-[#1E293B]">
              {patient.Phone}
            </span>

          </div>

          <div className="flex items-center justify-between border-b border-dashed border-[#E2E8F0] pb-3">

            <span className="font-medium text-[#64748B]">
              Address
            </span>

            <span className="text-right text-[#1E293B]">
              {patient.Address}
            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="font-medium text-[#64748B]">
              Insurance ID
            </span>

            <span className="font-['Roboto_Mono'] text-[#1E293B]">
              {patient.InsuranceID}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}
export function DoctorOperations() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .doctor(user.employeeId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [user.employeeId]);

  const opdAppointments = (data?.appointments || []).filter(
    (a) => a.VisitType !== "Admission"
  );

  const opsPagination = usePagination(data?.operations || [], 5);
  const opdPagination = usePagination(opdAppointments, 5);

  if (loading) return <Loader />;

  const { operations, generalCheckups, appointments } = data;

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <span className="font-['Roboto_Mono'] text-[11px] font-semibold uppercase tracking-[.14em] text-[#2563EB]">
          Doctor Portal
        </span>

        <h1 className="mt-2 font-['Inter'] text-4xl font-bold text-[#1E293B]">
          Operations & Checkups
        </h1>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-[18px_20px] shadow-[0_4px_24px_rgba(30,58,138,.08)]">

          <div className="mb-2 h-2 w-2 rounded-full bg-[#2563EB] shadow-[0_0_0_4px_rgba(37,99,235,.1)]"></div>

          <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-[#94A3B8]">
            Operations (Surgical)
          </p>

          <h2 className="mt-2 font-['Inter'] text-[32px] font-bold text-[#1E3A8A]">
            {operations.length}
          </h2>

        </div>

        <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-[18px_20px] shadow-[0_4px_24px_rgba(30,58,138,.08)]">

          <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-[#94A3B8]">
            OPD Checkups
          </p>

          <h2 className="mt-2 font-['Inter'] text-[32px] font-bold text-[#1E3A8A]">
            {generalCheckups}
          </h2>

        </div>

        <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-[18px_20px] shadow-[0_4px_24px_rgba(30,58,138,.08)]">

          <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-[#94A3B8]">
            Total Appointments
          </p>

          <h2 className="mt-2 font-['Inter'] text-[32px] font-bold text-[#1E3A8A]">
            {appointments.length}
          </h2>

        </div>

      </div>

      {/* Operations Table */}

      <div>

        <div className="mb-5 flex items-center gap-2">

          <div className="h-[6px] w-[6px] rounded-full bg-[#2563EB]"></div>

          <h2 className="font-['Inter'] text-xl font-semibold text-[#1E293B]">
            Surgical Operations
          </h2>

        </div>

        {operations.length === 0 ? (

          <div className="rounded-[10px] border border-dashed border-[#CBD5E1] bg-[#F1F5F9] py-10 text-center text-[#64748B]">

            No operations on record.

          </div>

        ) : (

          <>
            <div className="overflow-hidden overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">

              <table className="min-w-full border-collapse text-[13.5px]">

                <thead>

                  <tr>

                    <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-5 py-4 text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                      Date
                    </th>

                    <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-5 py-4 text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                      Procedure
                    </th>

                    <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-5 py-4 text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                      Patient #
                    </th>

                    <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-5 py-4 text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                      Assisting Nurse
                    </th>

                    <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-5 py-4 text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                      Cost
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {opsPagination.pageItems.map((op) => (

                    <tr
                      key={op.id}
                      onClick={() => navigate(`/operations/${op.id}`)}
                      className="cursor-pointer border-t border-[#E2E8F0] transition hover:bg-[#F1F5F9]"
                    >

                      <td className="px-5 py-4 font-['Roboto_Mono'] text-[12px] text-[#1E293B]">
                        {fmt.date(op.DateUndergoes)}
                      </td>

                      <td className="px-5 py-4 text-[#1E293B]">
                        {op.procedureName}
                      </td>

                      <td className="px-5 py-4 font-['Roboto_Mono'] text-[12px] text-[#1E293B]">
                        #{op.Patient}
                      </td>

                      <td className="px-5 py-4 font-['Roboto_Mono'] text-[12px] text-[#1E293B]">

                        {op.AssistingNurse
                          ? `#${op.AssistingNurse}`
                          : "—"}

                      </td>

                      <td className="px-5 py-4 font-semibold text-[#16A34A]">
                        {fmt.currency(op.cost)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <div className="mt-6">

              <Pagination
                {...opsPagination}
                pageSize={5}
              />

            </div>

          </>

        )}

      </div>

      {/* OPD Table */}

      <div>

        <div className="mb-5 flex items-center gap-2">

          <div className="h-[6px] w-[6px] rounded-full bg-[#2563EB]"></div>

          <h2 className="font-['Inter'] text-xl font-semibold text-[#1E293B]">
            OPD Appointments
          </h2>

        </div>

        <div className="overflow-hidden overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">

          <table className="min-w-full border-collapse text-[13.5px]">

            <thead>

              <tr>

                <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-5 py-4 text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                  ID
                </th>

                <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-5 py-4 text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                  Date
                </th>

                <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-5 py-4 text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                  Room
                </th>

                <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-5 py-4 text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                  Patient
                </th>

                <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-5 py-4 text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                  Type
                </th>

              </tr>

            </thead>

            <tbody>

              {opdPagination.pageItems.map((appointment) => (

                <tr
                  key={appointment.AppointmentID}
                  className="border-t border-[#E2E8F0] transition hover:bg-[#F1F5F9]"
                >

                  <td className="px-5 py-4 font-['Roboto_Mono'] text-[12px] text-[#1E293B]">
                    #{appointment.AppointmentID}
                  </td>

                  <td className="px-5 py-4 font-['Roboto_Mono'] text-[12px] text-[#1E293B]">
                    {fmt.dt(appointment.Starto)}
                  </td>

                  <td className="px-5 py-4 text-[#1E293B]">
                    {appointment.ExaminationRoom}
                  </td>

                  <td className="px-5 py-4 font-['Roboto_Mono'] text-[12px] text-[#1E293B]">
                    #{appointment.Patient}
                  </td>

                  <td className="px-5 py-4">

                    <span className="inline-flex items-center gap-[5px] rounded-full bg-[#2563EB]/10 px-[9px] py-[3px] text-[11px] font-semibold tracking-[.02em] text-[#1E3A8A]">
                      OPD
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <div className="mt-6">

          <Pagination
            {...opdPagination}
            pageSize={5}
          />

        </div>

      </div>

    </div>
  );
}
export function OperationDetail() {
  const { user } = useAuth();
  const { id } = useParams();

  const [state, setState] = useState({
    status: "loading",
    op: null,
  });

  useEffect(() => {
    setState({
      status: "loading",
      op: null,
    });

    dashboardService
      .doctor(user.employeeId)
      .then((dashboard) => {
        const operation = (dashboard.operations || []).find(
          (item) => String(item.id) === id
        );

        setState({
          status: operation ? "success" : "notfound",
          op: operation,
        });
      })
      .catch(() =>
        setState({
          status: "error",
          op: null,
        })
      );
  }, [user.employeeId, id]);

  if (state.status === "loading") return <Loader />;

  if (state.status === "notfound") {
    return (
      <ErrorPage
        code={404}
        message="Operation not found, or it isn't one of yours."
      />
    );
  }

  if (state.status === "error") {
    return <ErrorPage code={500} />;
  }

  const operation = state.op;

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <span className="font-['Roboto_Mono'] text-[11px] font-semibold uppercase tracking-[.14em] text-[#2563EB]">
            Doctor Portal
          </span>

          <h1 className="mt-2 font-['Inter'] text-4xl font-bold text-[#1E293B]">
            Operation #{operation.id}
          </h1>

        </div>

        <div>

          <Link
            to="/operations"
            className="inline-flex items-center rounded-[6px] border border-[#CBD5E1] bg-white px-5 py-2 font-medium text-[#1E293B] shadow-sm transition hover:border-[#2563EB]/30 hover:text-[#2563EB]"
          >
            ← Back to Operations
          </Link>

        </div>

      </div>

      {/* Operation Details */}

      <div className="max-w-xl rounded-[10px] border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_24px_rgba(30,58,138,.08)]">

        <div className="space-y-5">

          <div className="flex items-center justify-between border-b border-dashed border-[#E2E8F0] pb-3">

            <span className="font-medium text-[#64748B]">
              Procedure
            </span>

            <span className="font-semibold text-[#1E293B]">
              {operation.procedureName}
            </span>

          </div>

          <div className="flex items-center justify-between border-b border-dashed border-[#E2E8F0] pb-3">

            <span className="font-medium text-[#64748B]">
              Date
            </span>

            <span className="font-['Roboto_Mono'] text-[#1E293B]">
              {fmt.date(operation.DateUndergoes)}
            </span>

          </div>

          <div className="flex items-center justify-between border-b border-dashed border-[#E2E8F0] pb-3">

            <span className="font-medium text-[#64748B]">
              Patient
            </span>

            <span className="font-['Roboto_Mono'] text-[#1E293B]">
              #{operation.Patient}
            </span>

          </div>

          <div className="flex items-center justify-between border-b border-dashed border-[#E2E8F0] pb-3">

            <span className="font-medium text-[#64748B]">
              Assisting Nurse
            </span>

            <span className="font-['Roboto_Mono'] text-[#1E293B]">
              {operation.AssistingNurse
                ? `#${operation.AssistingNurse}`
                : "—"}
            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="font-medium text-[#64748B]">
              Cost
            </span>

            <span className="text-lg font-bold text-[#16A34A]">
              {fmt.currency(operation.cost)}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}
/*DoctorPatient */