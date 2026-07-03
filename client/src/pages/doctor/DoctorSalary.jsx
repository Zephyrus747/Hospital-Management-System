import { useEffect, useState } from "react";
import { useAuth } from "../../context/AppContext";
import { dashboardService } from "../../services/api";
import Loader from "../../components/Loader";
import { fmt } from "../../utils/helpers";

export default function DoctorSalary() {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .doctor(user.employeeId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [user.employeeId]);

  if (loading) return <Loader />;

  const { salary, operations, appointments } = data;

  if (!salary) {
    return (
      <div className="rounded-[10px] border border-dashed border-[#CBD5E1] bg-[#F1F5F9] py-12 text-center text-[#64748B]">
        Salary data not available.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <span className="font-['Roboto_Mono'] text-[11px] font-semibold uppercase tracking-[.14em] text-[#2563EB]">
          Career
        </span>

        <h1 className="mt-2 font-['Inter'] text-4xl font-bold text-[#1E293B]">
          Salary & Commission
        </h1>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-[18px_20px] shadow-[0_4px_24px_rgba(30,58,138,.08)]">

          <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-[#94A3B8]">
            Base Salary
          </p>

          <h2 className="mt-2 font-['Inter'] text-2xl font-bold text-[#1E3A8A]">
            {fmt.currency(salary.baseSalary)}
          </h2>

        </div>

        <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-[18px_20px] shadow-[0_4px_24px_rgba(30,58,138,.08)]">

          <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-[#94A3B8]">
            Commission Rate
          </p>

          <h2 className="mt-2 font-['Inter'] text-[32px] font-bold text-[#1E3A8A]">
            {(salary.commissionRate * 100).toFixed(0)}%
          </h2>

        </div>

        <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-[18px_20px] shadow-[0_4px_24px_rgba(30,58,138,.08)]">

          <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-[#94A3B8]">
            Commission Earned
          </p>

          <h2 className="mt-2 font-['Inter'] text-2xl font-bold text-[#16A34A]">
            {fmt.currency(salary.commissionEarned)}
          </h2>

        </div>

        <div className="relative rounded-[10px] border border-[#E2E8F0] bg-white p-[18px_20px] shadow-[0_4px_24px_rgba(30,58,138,.08)]">

          <div className="mb-2 h-2 w-2 rounded-full bg-[#2563EB] shadow-[0_0_0_4px_rgba(37,99,235,.1)]"></div>

          <p className="text-[11px] font-semibold uppercase tracking-[.09em] text-[#94A3B8]">
            Total Compensation
          </p>

          <h2 className="mt-2 font-['Inter'] text-2xl font-bold text-[#2563EB]">
            {fmt.currency(salary.totalCompensation)}
          </h2>

        </div>

      </div>

      {/* ================= Commission Breakdown ================= */}

      <div>

        <div className="mb-5 flex items-center gap-2">

          <div className="h-[6px] w-[6px] rounded-full bg-[#2563EB]"></div>

          <h2 className="font-['Inter'] text-xl font-semibold text-[#1E293B]">
            Commission Breakdown — Procedures
          </h2>

        </div>

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
                  Cost
                </th>

                <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-5 py-4 text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                  Your Commission ({(salary.commissionRate * 100).toFixed(0)}%)
                </th>

              </tr>

            </thead>

            <tbody>

              {operations.map((operation) => (

                <tr
                  key={operation.id}
                  className="border-t border-[#E2E8F0] transition hover:bg-[#F1F5F9]"
                >

                  <td className="px-5 py-4 font-['Roboto_Mono'] text-[12px] text-[#1E293B]">
                    {fmt.date(operation.DateUndergoes)}
                  </td>

                  <td className="px-5 py-4 text-[#1E293B]">
                    {operation.procedureName}
                  </td>

                  <td className="px-5 py-4 font-['Roboto_Mono'] text-[12px] text-[#1E293B]">
                    {fmt.currency(operation.cost)}
                  </td>

                  <td className="px-5 py-4 font-semibold text-[#16A34A]">

                    {fmt.currency(
                      operation.cost * salary.commissionRate
                    )}

                  </td>

                </tr>

              ))}

              {operations.length === 0 && (

                <tr>

                  <td
                    colSpan={4}
                    className="py-8 text-center text-[#64748B]"
                  >
                    No procedures on record.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

   

      <div>

        <div className="mb-5 flex items-center gap-2">

          <div className="h-[6px] w-[6px] rounded-full bg-[#2563EB]"></div>

          <h2 className="font-['Inter'] text-xl font-semibold text-[#1E293B]">
            All Appointments (Checkups + Admissions)
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
                  Patient #
                </th>

                <th className="whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-5 py-4 text-left text-[11px] font-normal uppercase tracking-[.07em] text-[#64748B]">
                  Type
                </th>

              </tr>

            </thead>

            <tbody>

              {appointments.map((appointment) => (

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

                    {appointment.VisitType === "Admission" ? (

                      <span className="inline-flex items-center gap-[5px] rounded-full bg-[#DC2626]/10 px-[9px] py-[3px] text-[11px] font-semibold tracking-[.02em] text-[#DC2626]">
                        Admission
                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-[5px] rounded-full bg-[#2563EB]/10 px-[9px] py-[3px] text-[11px] font-semibold tracking-[.02em] text-[#2563EB]">
                        OPD
                      </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}