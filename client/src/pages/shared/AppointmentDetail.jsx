import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService, refService } from '../../services/api';
import Loader from '../../components/Loader';
import ErrorPage from '../ErrorPage';
import { fmt } from '../../utils/helpers';

export default function AppointmentDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ status: 'loading', appt: null, physician: null, patient: null, error: null });

  useEffect(() => {
    setState({ status: 'loading', appt: null, physician: null, patient: null, error: null });
    Promise.all([adminService.get('appointments', id), refService.physicians(), refService.patients()])
      .then(([appt, physicians, patients]) => {
        setState({
          status: 'success',
          appt,
          physician: physicians.find((p) => p.EmployeeID === appt.Physician),
          patient: patients.find((p) => p.SSN === appt.Patient),
          error: null,
        });
      })
      .catch((error) => setState({ status: 'error', appt: null, physician: null, patient: null, error }));
  }, [id]);

  if (state.status === 'loading') return <Loader />;
  if (state.status === 'error') {
    return <ErrorPage code={state.error?.status || 500} message={state.error?.message} />;
  }

  const { appt, physician, patient } = state;

  return (
    <div>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-1.5 block font-['Roboto_Mono'] text-[11px] uppercase tracking-[.14em] text-[#2563EB]">Appointment</span>
          <h1 className="font-['Inter'] text-[28px] font-bold text-[#1E293B]">#{appt.AppointmentID}</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/appointments"
            className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#CBD5E1] bg-transparent px-3 py-1.5 text-[12.5px] font-medium text-[#1E293B] transition hover:border-[#2563EB]/30 hover:text-[#2563EB]"
          >
            ← Back to appointments
          </Link>
        </div>
      </div>
      <div className="max-w-[480px] rounded-2xl border border-[#E2E8F0] bg-white p-5">
        <div className="divide-y divide-dashed divide-[#E2E8F0]">
          <div className="flex items-center justify-between py-2.5 text-[13.5px]">
            <span className="text-[#64748B]">Date / Time</span>
            <span className="font-['Roboto_Mono'] text-xs">{fmt.dt(appt.Starto)} → {fmt.dt(appt.Endo)}</span>
          </div>
          <div className="flex items-center justify-between py-2.5 text-[13.5px]">
            <span className="text-[#64748B]">Room</span>
            <span>{appt.ExaminationRoom}</span>
          </div>
          <div className="flex items-center justify-between py-2.5 text-[13.5px]">
            <span className="text-[#64748B]">Physician</span>
            <span>{physician?.Name || `#${appt.Physician}`}</span>
          </div>
          <div className="flex items-center justify-between py-2.5 text-[13.5px]">
            <span className="text-[#64748B]">Patient</span>
            <span>{patient?.Name || `#${appt.Patient}`}</span>
          </div>
          <div className="flex items-center justify-between py-2.5 text-[13.5px]">
            <span className="text-[#64748B]">Type</span>
            <span>
              {appt.VisitType === 'Admission' ? (
                <span className="inline-flex items-center gap-[5px] rounded-full bg-[#DC2626]/10 px-[9px] py-[3px] text-[11px] font-semibold tracking-[.02em] text-[#DC2626]">Admission</span>
              ) : (
                <span className="inline-flex items-center gap-[5px] rounded-full bg-[#3B82F6]/10 px-[9px] py-[3px] text-[11px] font-semibold tracking-[.02em] text-[#3B82F6]">OPD</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}