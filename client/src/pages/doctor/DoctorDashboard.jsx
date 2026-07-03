import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AppContext";
import { dashboardService } from "../../services/api";
import Loader from "../../components/Loader";
import { fmt } from "../../utils/helpers";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

export default function DoctorDashboard() {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService
      .doctor(user.employeeId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user.employeeId]);

  const shiftsPagination = usePagination(data?.dutyShifts || [], 5);
  const opsPagination = usePagination(data?.operations || [], 5);

  if (loading) return <Loader label="Loading your workspace..." />;

  if (error)
    return (
      <div className="rounded-[6px] border border-[#DC2626]/25 bg-[#DC2626]/10 p-4 text-[#DC2626]">
        {error}
      </div>
    );

  const {
    profile,
    patients,
    appointments,
    operations,
    generalCheckups,
    dutyShifts,
    salary,
  } = data;

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <span className="font-['Roboto_Mono'] text-[11px] font-semibold uppercase tracking-[.14em] text-[#2563EB]">
            Doctor Portal
          </span>

          <h1 className="mt-2 font-['Inter'] text-4xl font-bold text-[#1E293B]">
            Dr. {profile.Name}
          </h1>

          <p className="mt-2 text-[#64748B]">
            {profile.Position}
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <Link
            to="/patients"
            className="rounded-[6px] border border-[#CBD5E1] bg-white px-5 py-2 font-medium text-[#1E293B] shadow-sm transition hover:border-[#2563EB]/30 hover:text-[#2563EB]"
          >
            My Patients
          </Link>

          <Link
            to="/shifts"
            className="rounded-[6px] bg-[#2563EB] px-5 py-2 font-semibold uppercase tracking-[.04em] text-white shadow transition hover:bg-[#1E3A8A]"
          >
            View Shifts
          </Link>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-4">

        <div className="relative rounded-[10px] border border-[#E2E8F0] bg-white p-[18px_20px] shadow-[0_4px_24px_rgba(30,58,138,.08)] transition hover:-translate-y-0.5 hover:border-[#2563EB]/30">

          <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#2563EB] shadow-[0_0_0_4px_rgba(37,99,235,.1)]"></div>

          <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-[#94A3B8]">
            Total Patients
          </p>

          <h2 className="mt-2 font-['Inter'] text-[32px] font-bold text-[#1E3A8A]">
            {patients.length}
          </h2>

        </div>

        <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-[18px_20px] shadow-[0_4px_24px_rgba(30,58,138,.08)] transition hover:-translate-y-0.5 hover:border-[#2563EB]/30">

          <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-[#94A3B8]">
            Appointments
          </p>

          <h2 className="mt-2 font-['Inter'] text-[32px] font-bold text-[#1E3A8A]">
            {appointments.length}
          </h2>

        </div>

        <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-[18px_20px] shadow-[0_4px_24px_rgba(30,58,138,.08)] transition hover:-translate-y-0.5 hover:border-[#2563EB]/30">

          <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-[#94A3B8]">
            Checkups (OPD)
          </p>

          <h2 className="mt-2 font-['Inter'] text-[32px] font-bold text-[#1E3A8A]">
            {generalCheckups}
          </h2>

        </div>

        <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-[18px_20px] shadow-[0_4px_24px_rgba(30,58,138,.08)] transition hover:-translate-y-0.5 hover:border-[#2563EB]/30">

          <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-[#94A3B8]">
            Operations
          </p>

          <h2 className="mt-2 font-['Inter'] text-[32px] font-bold text-[#1E3A8A]">
            {operations.length}
          </h2>

        </div>

        {salary && (
          <>
            <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-[18px_20px] shadow-[0_4px_24px_rgba(30,58,138,.08)] transition hover:-translate-y-0.5 hover:border-[#2563EB]/30">

              <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-[#94A3B8]">
                Base Salary
              </p>

              <h2 className="mt-2 font-['Inter'] text-[22px] font-bold text-[#1E3A8A]">
                {fmt.currency(salary.baseSalary)}
              </h2>

            </div>

            <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-[18px_20px] shadow-[0_4px_24px_rgba(30,58,138,.08)] transition hover:-translate-y-0.5 hover:border-[#2563EB]/30">

              <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-[#94A3B8]">
                Commission Earned
              </p>

              <h2 className="mt-2 font-['Inter'] text-[22px] font-bold text-[#16A34A]">
                {fmt.currency(salary.commissionEarned)}
              </h2>

            </div>
          </>
        )}
      </div>

      <div>

        <div className="mb-5 flex items-center gap-2">

          <div className="h-[6px] w-[6px] rounded-full bg-[#2563EB]"></div>

          <h2 className="font-['Inter'] text-xl font-semibold text-[#1E293B]">
            Duty Shifts
          </h2>

        </div>

        {dutyShifts.length === 0 ? (

          <div className="rounded-[10px] border border-dashed border-[#CBD5E1] bg-[#F1F5F9] py-10 text-center text-[#64748B]">
            No shifts recorded.
          </div>

        ) : (

          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">

              {shiftsPagination.pageItems.map((shift) => (

                <div
                  key={shift.id}
                  className="rounded-[10px] border border-[#E2E8F0] bg-[#F1F5F9] p-[14px_16px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(37,99,235,.08)]"
                >

                  <span className="font-['Roboto_Mono'] text-[11px] font-semibold uppercase tracking-[.08em] text-[#94A3B8]">
                    {shift.shiftType}
                  </span>

                  <div className="mt-1.5">

                    <p className="font-['Inter'] text-lg font-semibold text-[#1E3A8A]">
                      {shift.joining} → {shift.leaving}
                    </p>

                    <p className="mt-1 text-[12.5px] text-[#64748B]">
                      {shift.date}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            <div className="mt-6">
              <Pagination
                {...shiftsPagination}
                pageSize={5}
              />
            </div>

          </>

        )}

      </div>

    

      <div>

        <div className="mb-5 flex items-center gap-2">

          <div className="h-[6px] w-[6px] rounded-full bg-[#2563EB]"></div>

          <h2 className="font-['Inter'] text-xl font-semibold text-[#1E293B]">
            Patients Under Care
          </h2>

        </div>

        <div className="mb-7 grid grid-cols-1 gap-[14px] md:grid-cols-2 xl:grid-cols-3">

          {patients.slice(0, 6).map((patient) => (

            <div
              key={patient.SSN}
              className="group relative overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white p-[16px_18px] transition-all duration-300 hover:-translate-y-1 hover:border-[#2563EB]/30 hover:shadow-[0_8px_24px_rgba(37,99,235,.08)]"
            >

              <div className="mb-3 flex items-center justify-between gap-2">

                <h3 className="font-['Inter'] text-[15.5px] font-semibold text-[#1E293B]">
                  {patient.Name}
                </h3>

                <span className="inline-flex items-center gap-[5px] rounded-full bg-[#2563EB]/10 px-[9px] py-[3px] text-[11px] font-semibold tracking-[.02em] text-[#1E3A8A]">
                  Patient
                </span>

              </div>

              <div className="space-y-2 text-[13px] text-[#64748B]">

                <p>
                  <span className="font-medium text-[#1E293B]">
                    Address:
                  </span>{" "}
                  {patient.Address}
                </p>

                <p>
                  <span className="font-medium text-[#1E293B]">
                    Phone:
                  </span>{" "}
                  {patient.Phone}
                </p>

                <p className="font-['Roboto_Mono'] text-[12px] text-[#94A3B8]">
                  {fmt.ssnMask(patient.SSN)}
                </p>

              </div>

            </div>

          ))}

          {patients.length === 0 && (

            <div className="col-span-full rounded-[10px] border border-dashed border-[#CBD5E1] bg-[#F1F5F9] py-10 text-center text-[#64748B]">
              No patients yet.
            </div>

          )}

          {patients.length > 6 && (

            <Link
              to="/patients"
              className="col-span-full flex items-center justify-center rounded-[10px] border-2 border-dashed border-[#2563EB]/30 bg-[#2563EB]/10 py-5 text-sm font-semibold text-[#2563EB] transition hover:bg-[#2563EB]/20"
            >
              See all {patients.length} patients →
            </Link>

          )}

        </div>

      </div>
          

      <div>

        <div className="mb-5 flex items-center gap-2">

          <div className="h-[6px] w-[6px] rounded-full bg-[#2563EB]"></div>

          <h2 className="font-['Inter'] text-xl font-semibold text-[#1E293B]">
            Operations Performed
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

                    <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-4 py-[11px] text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                      Date
                    </th>

                    <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-4 py-[11px] text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                      Procedure
                    </th>

                    <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-4 py-[11px] text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                      Patient #
                    </th>

                    <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-4 py-[11px] text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                      Cost
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {opsPagination.pageItems.map((operation) => (

                    <tr
                      key={operation.id}
                      className="transition hover:bg-[#F1F5F9]"
                    >

                      <td className="border-b border-[#E2E8F0] px-4 py-3 font-['Roboto_Mono'] text-[12px] text-[#1E293B]">
                        {fmt.date(operation.DateUndergoes)}
                      </td>

                      <td className="border-b border-[#E2E8F0] px-4 py-3 text-[#1E293B]">
                        {operation.procedureName ||
                          `#${operation.Procedures}`}
                      </td>

                      <td className="border-b border-[#E2E8F0] px-4 py-3 font-['Roboto_Mono'] text-[12px] text-[#1E293B]">
                        #{operation.Patient}
                      </td>

                      <td className="border-b border-[#E2E8F0] px-4 py-3 font-semibold text-[#16A34A]">
                        {fmt.currency(operation.cost)}
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

    </div>

  );
}
/*DoctorDashboard*/