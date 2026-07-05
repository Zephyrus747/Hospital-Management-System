import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';
import { dashboardService, adminService } from '../../services/api';
import Loader from '../../components/Loader';
import ErrorPage from '../ErrorPage';
import { fmt } from '../../utils/helpers';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';

function useNurseDash(empId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.nurse(empId)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [empId]);

  return { data, loading, error };
}

const pageHeadCls = "flex flex-wrap items-end justify-between gap-4 mb-[26px]";
const eyebrowCls = "font-mono text-[11px] tracking-[0.14em] uppercase text-[#2563EB] mb-1.5 block";
const pageTitleCls = "text-[28px] font-bold tracking-[-0.01em] text-[#1E293B] leading-tight";
const pageDescCls = "mt-1.5 text-[14px] text-[#64748B]";
const pageActionsCls = "flex flex-wrap gap-2.5";
const btnBase = "inline-flex items-center justify-center gap-2 whitespace-nowrap leading-none rounded-[6px] border border-transparent px-[18px] py-[10px] text-[14px] font-medium transition active:translate-y-px";
const btnGhost = "bg-transparent border-[#CBD5E1] text-[#1E293B] hover:border-[rgba(37,99,235,.3)] hover:text-[#2563EB]";
const btnPrimary = "bg-[#2563EB] text-white uppercase tracking-[0.04em] font-semibold hover:bg-[#1E3A8A]";
const btnSm = "px-[12px] py-[6px] text-[12.5px]";
const statGridCls = "grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[14px] mb-7";
const statTileCls = "relative block rounded-[10px] border border-[#E2E8F0] bg-white px-5 py-[18px] transition hover:-translate-y-0.5 hover:border-[rgba(37,99,235,.3)] hover:shadow-[0_8px_24px_rgba(37,99,235,.08)]";
const stLabelCls = "text-[11px] uppercase tracking-[0.09em] text-[#94A3B8] font-semibold";
const stValueCls = "mt-2 font-sans text-[32px] font-bold text-[#1E3A8A]";
const stDotCls = "absolute right-4 top-4 h-2 w-2 rounded-full bg-[#2563EB] shadow-[0_0_0_4px_rgba(37,99,235,.1)]";
const secTitleCls = "mb-3 flex items-center gap-2.5 font-sans text-[15px] font-semibold text-[#1E293B]";
const secDotCls = "h-[6px] w-[6px] rounded-full bg-[#2563EB] shrink-0";
const shiftGridCls = "grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3";
const shiftCardCls = "rounded-[10px] border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-[14px]";
const shiftTypeCls = "font-mono text-[11px] uppercase tracking-[0.08em] text-[#94A3B8]";
const shiftTimeCls = "my-1.5 font-sans text-[18px] font-semibold text-[#1E3A8A]";
const shiftDateCls = "text-[12.5px] text-[#64748B]";
const badgeBase = "inline-flex items-center gap-[5px] rounded-full px-[9px] py-[3px] text-[11px] font-semibold tracking-[0.02em]";
const badgeSuccess = "bg-[rgba(22,163,74,.1)] text-[#16A34A]";
const badgeInfo = "bg-[rgba(59,130,246,.1)] text-[#3B82F6]";
const badgeDanger = "bg-[rgba(220,38,38,.1)] text-[#DC2626]";
const emptyStateCls = "rounded-[10px] border border-dashed border-[#CBD5E1] px-5 py-9 text-center text-[14px] text-[#64748B]";
const tableWrapCls = "overflow-x-auto overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white";
const tableCls = "w-full border-collapse text-[13.5px]";
const thCls = "whitespace-nowrap border-b border-[#E2E8F0] bg-[#F1F5F9] px-4 py-[11px] text-left text-[11px] uppercase tracking-[0.07em] text-[#64748B]";
const tdCls = "border-b border-[#E2E8F0] px-4 py-3 text-[#1E293B]";
const monoCls = "font-mono text-[12px]";
const entityCardCls = "relative flex flex-col gap-2.5 overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white px-[18px] py-4 transition hover:-translate-y-0.5 hover:border-[rgba(37,99,235,.3)] hover:shadow-[0_8px_24px_rgba(37,99,235,.08)] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#2563EB] before:opacity-0 before:transition-opacity hover:before:opacity-100";
const ecRowCls = "flex items-center justify-between gap-2";
const ecNameCls = "font-sans text-[15.5px] font-semibold text-[#1E293B]";
const ecMetaCls = "flex flex-wrap items-center gap-1.5 text-[12.5px] text-[#64748B]";
const ecIdCls = "font-mono text-[11px] text-[#94A3B8]";
const cardGridCls = "grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3.5";
const cardCls = "rounded-[16px] border border-[#E2E8F0] bg-white p-5";
const billRowCls = "flex items-center justify-between border-b border-dashed border-[#E2E8F0] py-2.5 text-[13.5px] last:border-b-0";
const textDimCls = "text-[#64748B]";

function tailwindPaginationWrapper(mb = 0) {
  return mb ? `mb-[${mb}px]` : "";
}

export function NurseDashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useNurseDash(user.employeeId);
  const shiftsPagination = usePagination(data?.dutyShifts || [], 5);
  const onCallPagination = usePagination(data?.onCall || [], 5);

  if (loading) return <Loader label="Loading nurse portal…" />;
  if (error) return <div className="rounded-[6px] border border-[rgba(220,38,38,.25)] bg-[rgba(220,38,38,.1)] px-[14px] py-2.5 text-[13px] text-[#DC2626]">{error}</div>;

  const { profile, assignments, onCall, dutyShifts } = data;

  return (
    <div>
      <div className={pageHeadCls}>
        <div>
          <span className={eyebrowCls}>Nurse portal</span>
          <h1 className={pageTitleCls}>Hi, {profile.Name.split(' ')[0]}</h1>
          <p className={pageDescCls}>{profile.Position} · {profile.Registered ? 'Registered Nurse' : 'Unregistered'}</p>
        </div>
        <div className={pageActionsCls}>
          <Link to="/assignments" className={`${btnBase} ${btnGhost}`}>Assignments</Link>
          <Link to="/shifts" className={`${btnBase} ${btnPrimary}`}>My shifts</Link>
        </div>
      </div>

      <div className={statGridCls}>
        <div className={statTileCls}><span className={stDotCls} /><div className={stLabelCls}>Active assignments</div><div className={stValueCls}>{assignments.length}</div></div>
        <div className={statTileCls}><div className={stLabelCls}>On-call records</div><div className={stValueCls}>{onCall.length}</div></div>
        <div className={statTileCls}><div className={stLabelCls}>Shifts scheduled</div><div className={stValueCls}>{dutyShifts.length}</div></div>
      </div>

      <div className={secTitleCls}><span className={secDotCls} />Current duty shifts</div>
      <div className={`${shiftGridCls} ${dutyShifts.length ? 'mb-3' : 'mb-[26px]'}`}>
        {shiftsPagination.pageItems.map(s => (
          <div className={shiftCardCls} key={s.id}>
            <div className="mb-2 flex justify-between">
              <span className={shiftTypeCls}>{s.shiftType}</span>
              <span className={`${badgeBase} ${badgeSuccess}`}>Nurse</span>
            </div>
            <div className={shiftTimeCls}>{s.joining} → {s.leaving}</div>
            <div className={shiftDateCls}>{s.date}</div>
          </div>
        ))}
        {dutyShifts.length === 0 && <div className={emptyStateCls}>No shifts scheduled.</div>}
      </div>

      {dutyShifts.length > 0 && <div className="mb-[26px]"><Pagination {...shiftsPagination} pageSize={5} /></div>}

      <div className={secTitleCls}><span className={secDotCls} />On-call schedule</div>
      <div className={tableWrapCls}>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>Floor</th>
              <th className={thCls}>Block</th>
              <th className={thCls}>Start</th>
              <th className={thCls}>End</th>
            </tr>
          </thead>
          <tbody>
            {onCallPagination.pageItems.map(oc => (
              <tr key={oc.id}>
                <td className={tdCls}>Floor {oc.BlockFloor}</td>
                <td className={tdCls}>Block {oc.BlockCode}</td>
                <td className={`${tdCls} ${monoCls}`}>{fmt.dt(oc.OnCallStart)}</td>
                <td className={`${tdCls} ${monoCls}`}>{fmt.dt(oc.OnCallEnd)}</td>
              </tr>
            ))}
            {onCall.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-5 text-center text-[#64748B]">No on-call records.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination {...onCallPagination} pageSize={5} />
    </div>
  );
}

export function NurseAssignments() {
  const { user } = useAuth();
  const { data, loading } = useNurseDash(user.employeeId);
  const pagination = usePagination(data?.assignments || [], 5);

  if (loading) return <Loader />;
  const { assignments } = data;

  return (
    <div>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className={eyebrowCls}>Nurse portal</span>
          <h1 className={pageTitleCls}>Assignments</h1>
          <p className={pageDescCls}>Patients you are currently preparing or assisting.</p>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className={emptyStateCls}>No active assignments.</div>
      ) : (
        <>
          <div className={cardGridCls}>
            {pagination.pageItems.map((a, i) => (
              <div className={entityCardCls} key={i}>
                <div className={ecRowCls}>
                  <span className={ecNameCls}>{a.patient?.Name || 'Unknown Patient'}</span>
                  <span className={`${badgeBase} ${a.type === 'Operation assist' ? badgeDanger : badgeInfo}`}>{a.type}</span>
                </div>
                <div className={ecMetaCls}>
                  <strong>Under:</strong> <span>Dr. {a.supervisingDoctor?.Name || '—'}</span>
                </div>
                <div className={ecMetaCls}>Room {a.room}</div>
                <div className={ecIdCls}>{a.when}</div>
              </div>
            ))}
          </div>
          <Pagination {...pagination} pageSize={5} />
        </>
      )}
    </div>
  );
}

export function NurseRooms() {
  const { user } = useAuth();
  const { data, loading } = useNurseDash(user.employeeId);
  const rooms = [...new Set((data?.assignments || []).map(a => a.room))];
  const roomsPagination = usePagination(rooms, 5);
  const onCallPagination = usePagination(data?.onCall || [], 5);

  if (loading) return <Loader />;
  const { onCall } = data;

  return (
    <div>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className={eyebrowCls}>Nurse portal</span>
          <h1 className={pageTitleCls}>Rooms & Blocks</h1>
          <p className={pageDescCls}>Rooms and floors where you are active.</p>
        </div>
      </div>

      <div className={secTitleCls}><span className={secDotCls} />Assignment rooms</div>
      {rooms.length === 0 ? (
        <div className={`${emptyStateCls} mb-6`}>No rooms assigned.</div>
      ) : (
        <>
          <div className={cardGridCls}>
            {roomsPagination.pageItems.map(r => (
              <div className={entityCardCls} key={r}>
                <div className={ecRowCls}>
                  <span className={ecNameCls}>Room / Area</span>
                  <span className={`${badgeBase} ${badgeInfo}`}>Active</span>
                </div>
                <div className={ecMetaCls}>{r}</div>
              </div>
            ))}
          </div>
          <div className="mb-7"><Pagination {...roomsPagination} pageSize={5} /></div>
        </>
      )}

      <div className={secTitleCls}><span className={secDotCls} />On-call blocks</div>
      <div className={tableWrapCls}>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>Floor</th>
              <th className={thCls}>Block</th>
              <th className={thCls}>On-call start</th>
              <th className={thCls}>On-call end</th>
            </tr>
          </thead>
          <tbody>
            {onCallPagination.pageItems.map(oc => (
              <tr key={oc.id}>
                <td className={tdCls}>Floor {oc.BlockFloor}</td>
                <td className={tdCls}>Block {oc.BlockCode}</td>
                <td className={`${tdCls} ${monoCls}`}>{fmt.dt(oc.OnCallStart)}</td>
                <td className={`${tdCls} ${monoCls}`}>{fmt.dt(oc.OnCallEnd)}</td>
              </tr>
            ))}
            {onCall.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-5 text-center text-[#64748B]">No on-call records.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination {...onCallPagination} pageSize={5} />
    </div>
  );
}

export function NurseShifts() {
  const { user } = useAuth();
  const { data, loading } = useNurseDash(user.employeeId);
  const pagination = usePagination(data?.dutyShifts || [], 5);

  if (loading) return <Loader />;
  const { dutyShifts, profile } = data;

  return (
    <div>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className={eyebrowCls}>Career</span>
          <h1 className={pageTitleCls}>Duty Shifts</h1>
          <p className={pageDescCls}>Rotational schedule for {profile.Name}</p>
        </div>
      </div>

      <div className={shiftGridCls}>
        {pagination.pageItems.map(s => (
          <Link to={`/shifts/${s.id}`} className={shiftCardCls} key={s.id}>
            <div className="mb-2 flex justify-between">
              <span className={shiftTypeCls}>{s.shiftType}</span>
              <span className={`${badgeBase} ${badgeSuccess}`}>Nurse</span>
            </div>
            <div className={shiftTimeCls}>{s.joining} → {s.leaving}</div>
            <div className={shiftDateCls}>{s.date}</div>
          </Link>
        ))}
        {dutyShifts.length === 0 && <div className={emptyStateCls}>No shifts scheduled.</div>}
      </div>
      <Pagination {...pagination} pageSize={5} />
    </div>
  );
}

export function RoomDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    setState({ status: 'loading', data: null, error: null });
    adminService.get('rooms', id)
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((error) => setState({ status: 'error', data: null, error }));
  }, [id]);

  if (state.status === 'loading') return <Loader />;
  if (state.status === 'error') {
    return <ErrorPage code={state.error?.status || 404} message={state.error?.message} />;
  }

  const r = state.data;

  return (
    <div>
      <div className={pageHeadCls}>
        <div>
          <span className={eyebrowCls}>Nurse portal</span>
          <h1 className={pageTitleCls}>Room {r.RoomNumber}</h1>
        </div>
        <div className={pageActionsCls}>
          <Link to="/rooms" className={`${btnBase} ${btnGhost} ${btnSm}`}>← Back to rooms</Link>
        </div>
      </div>

      <div className={`${cardCls} max-w-[420px]`}>
        <div className={billRowCls}><span className={textDimCls}>Floor</span><span>{r.BlockFloor}</span></div>
        <div className={billRowCls}><span className={textDimCls}>Block</span><span>{r.BlockCode}</span></div>
      </div>
    </div>
  );
}