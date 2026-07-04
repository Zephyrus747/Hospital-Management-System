import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';
import { dashboardService } from '../../services/api';
import Loader from '../../components/Loader';
import ErrorPage from '../ErrorPage';

export default function ShiftDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const [state, setState] = useState({ status: 'loading', shift: null });

  useEffect(() => {
    setState({ status: 'loading', shift: null });
    const call = user.role === 'nurse' ? dashboardService.nurse(user.employeeId) : dashboardService.doctor(user.employeeId);
    call
      .then((d) => {
        const shift = (d.dutyShifts || []).find((s) => String(s.id) === id);
        setState({ status: shift ? 'success' : 'notfound', shift });
      })
      .catch(() => setState({ status: 'error', shift: null }));
  }, [user.employeeId, user.role, id]);

  if (state.status === 'loading') return <Loader />;
  if (state.status === 'notfound') return <ErrorPage code={404} message="Shift not found." />;
  if (state.status === 'error') return <ErrorPage code={500} />;

  const s = state.shift;
  return (
    <div>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-1.5 block font-['Roboto_Mono'] text-[11px] uppercase tracking-[.14em] text-[#2563EB]">Career</span>
          <h1 className="font-['Inter'] text-[28px] font-bold text-[#1E293B]">{s.shiftType} shift</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/shifts"
            className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#CBD5E1] bg-transparent px-3 py-1.5 text-[12.5px] font-medium text-[#1E293B] transition hover:border-[#2563EB]/30 hover:text-[#2563EB]"
          >
            ← Back to shifts
          </Link>
        </div>
      </div>
      <div className="max-w-[420px] rounded-2xl border border-[#E2E8F0] bg-white p-5">
        <div className="divide-y divide-dashed divide-[#E2E8F0]">
          <div className="flex items-center justify-between py-2.5 text-[13.5px]">
            <span className="text-[#64748B]">Date</span>
            <span>{s.date}</span>
          </div>
          <div className="flex items-center justify-between py-2.5 text-[13.5px]">
            <span className="text-[#64748B]">Joining</span>
            <span>{s.joining}</span>
          </div>
          <div className="flex items-center justify-between py-2.5 text-[13.5px]">
            <span className="text-[#64748B]">Leaving</span>
            <span>{s.leaving}</span>
          </div>
        </div>
      </div>
    </div>
  );
}