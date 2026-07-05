import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AppContext";
import { dashboardService } from "../../services/api";
import Loader from "../../components/Loader";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

export default function DoctorShifts() {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .doctor(user.employeeId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [user.employeeId]);

  const pagination = usePagination(data?.dutyShifts || [], 5);

  if (loading) return <Loader />;

  const { dutyShifts, profile } = data;

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <span className="font-['Roboto_Mono'] text-[11px] font-semibold uppercase tracking-[.14em] text-[#2563EB]">
          Career
        </span>

        <h1 className="mt-2 font-['Inter'] text-4xl font-bold text-[#1E293B]">
          Duty Shifts
        </h1>

        <p className="mt-2 text-[#64748B]">
          Rotational schedule for Dr. {profile.Name}
        </p>
      </div>

      {/* Shift Cards */}

      {dutyShifts.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#CBD5E1] bg-[#F1F5F9] py-12 text-center text-[#64748B]">
          No shifts recorded.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2 xl:grid-cols-3">
            {pagination.pageItems.map((shift) => (
              <Link
                key={shift.id}
                to={`/shifts/${shift.id}`}
                className="block rounded-[10px] border border-[#E2E8F0] bg-white p-[16px_18px] transition-all duration-300 hover:-translate-y-1 hover:border-[#2563EB]/30 hover:shadow-[0_8px_24px_rgba(37,99,235,.08)]"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-[5px] rounded-full bg-[#2563EB]/10 px-[9px] py-[3px] text-[11px] font-semibold tracking-[.02em] text-[#1E3A8A]">
                    {shift.shiftType}
                  </span>

                  <span className="inline-flex items-center gap-[5px] rounded-full bg-[#16A34A]/10 px-[9px] py-[3px] text-[11px] font-semibold tracking-[.02em] text-[#16A34A]">
                    Physician
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-['Inter'] text-lg font-semibold text-[#1E293B]">
                    {shift.joining} → {shift.leaving}
                  </h3>

                  <p className="text-[13px] text-[#64748B]">
                    {shift.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <Pagination
              {...pagination}
              pageSize={5}
            />
          </div>
        </>
      )}
    </div>
  );
}
/*DoctorShifts */