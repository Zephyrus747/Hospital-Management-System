import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';
import { dashboardService } from '../../services/api';
import Loader from '../../components/Loader';
import ErrorPage from '../ErrorPage';
import { fmt } from '../../utils/helpers';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';

export function PatientBilling() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.patient(user.ssn).then(setData).finally(() => setLoading(false));
  }, [user.ssn]);

  const pagination = usePagination(data?.billing || [], 5);

  if (loading) return <Loader />;
  const { billing, stays } = data;

  return (
    <div>
      <div className="page-head">
        <div><span className="eyebrow">Patient portal</span><h1>My Bill</h1>
          <p>Itemised charges for your hospital stays and treatments.</p>
        </div>
      </div>

      {billing.length === 0
        ? <div className="empty-state">No billing records found. Bills appear after an inpatient stay.</div>
        : (
          <>
            {pagination.pageItems.map(b => {
              const stay = (stays || []).find(s => s.StayID === b.stayId);
              return (
                <div className="card mb-4" key={b.id}>
                  <div className="flex justify-between items-center mb-3.5">
                    <div>
                      <Link to={`/billing/${b.id}`} className="font-[family-name:var(--font-d)] font-semibold text-base text-[var(--accent-b)]">
                        Stay #{b.stayId}
                      </Link>
                      {stay && (
                        <div className="text-[12.5px] text-[var(--text-dim)] mt-[3px]">
                          Room {stay.Room} · {fmt.date(stay.StayStart)} → {fmt.date(stay.StayEnd)}
                        </div>
                      )}
                    </div>
                    <span className={`badge ${b.paid ? 'badge-success' : 'badge-danger'}`}>
                      {b.paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>

                  {b.items.map((item, i) => (
                    <div className="bill-row" key={i}>
                      <div>
                        <span className={`badge mr-2 ${item.type === 'Procedure' ? 'badge-danger' : item.type === 'Medication' ? 'badge-info' : 'badge-neutral'}`}>{item.type}</span>
                        {item.label}
                      </div>
                      <span className="mono text-[var(--text)] font-semibold">{fmt.currency(item.amount)}</span>
                    </div>
                  ))}

                  <div className="bill-total">
                    <span>Total</span>
                    <span className={`font-[family-name:var(--font-d)] ${b.paid ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                      {fmt.currency(b.total)}
                    </span>
                  </div>
                </div>
              );
            })}
            <Pagination {...pagination} pageSize={5} />
          </>
        )
      }
    </div>
  );
}

export function BillDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const [state, setState] = useState({ status: 'loading', bill: null, stay: null });

  useEffect(() => {
    setState({ status: 'loading', bill: null, stay: null });
    dashboardService.patient(user.ssn)
      .then((d) => {
        const bill = (d.billing || []).find((x) => String(x.id) === id);
        const stay = bill ? (d.stays || []).find((s) => s.StayID === bill.stayId) : null;
        setState({ status: bill ? 'success' : 'notfound', bill, stay });
      })
      .catch(() => setState({ status: 'error', bill: null, stay: null }));
  }, [user.ssn, id]);

  if (state.status === 'loading') return <Loader />;
  if (state.status === 'notfound') return <ErrorPage code={404} message="Bill not found." />;
  if (state.status === 'error') return <ErrorPage code={500} />;

  const { bill, stay } = state;

  return (
    <div>
      <div className="page-head">
        <div><span className="eyebrow">Patient portal</span><h1>Bill — Stay #{bill.stayId}</h1></div>
        <div className="page-actions"><Link to="/billing" className="btn btn-ghost btn-sm">← Back to billing</Link></div>
      </div>
      <div className="card max-w-[520px]">
        {stay && (
          <div className="bill-row">
            <span className="text-dim">Stay</span>
            <span>Room {stay.Room} · {fmt.date(stay.StayStart)} → {fmt.date(stay.StayEnd)}</span>
          </div>
        )}
        <div className="bill-row">
          <span className="text-dim">Status</span>
          <span className={`badge ${bill.paid ? 'badge-success' : 'badge-danger'}`}>{bill.paid ? 'Paid' : 'Unpaid'}</span>
        </div>
        {bill.items.map((item, i) => (
          <div className="bill-row" key={i}>
            <div>
              <span className={`badge mr-2 ${item.type === 'Procedure' ? 'badge-danger' : item.type === 'Medication' ? 'badge-info' : 'badge-neutral'}`}>{item.type}</span>
              {item.label}
            </div>
            <span className="mono font-semibold">{fmt.currency(item.amount)}</span>
          </div>
        ))}
        <div className="bill-total">
          <span>Total</span>
          <span className={bill.paid ? 'text-[var(--success)]' : 'text-[var(--danger)]'}>{fmt.currency(bill.total)}</span>
        </div>
      </div>
    </div>
  );
}

export function PatientProfile() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.patient(user.ssn).then(setData).finally(() => setLoading(false));
  }, [user.ssn]);

  const pagination = usePagination(data?.prescriptions || [], 5);

  if (loading) return <Loader />;
  const { profile, primaryCarePhysician: pcp, prescriptions } = data;

  const fields = [
    { label: 'Full name', value: profile.Name },
    { label: 'SSN', value: fmt.ssnMask(profile.SSN) },
    { label: 'Phone', value: profile.Phone },
    { label: 'Address', value: profile.Address },
    { label: 'Insurance ID', value: profile.InsuranceID },
  ];

  return (
    <div>
      <div className="page-head"><div><span className="eyebrow">Patient portal</span><h1>My Profile</h1></div></div>

      <div className="grid grid-cols-2 gap-6 mb-7">
        <div className="card">
          <div className="sec-title"><span className="dot" />Personal details</div>
          {fields.map(f => (
            <div key={f.label} className="flex justify-between py-2.5 border-b border-dashed border-[var(--border)] text-sm">
              <span className="text-[var(--text-dim)] font-semibold text-xs uppercase tracking-[.05em]">{f.label}</span>
              <span className="mono">{f.value}</span>
            </div>
          ))}
        </div>

        {pcp && (
          <div className="card">
            <div className="sec-title"><span className="dot" />Primary care physician</div>
            <div className="flex items-center gap-3.5 mt-2">
              <div className="w-[52px] h-[52px] rounded-full bg-[var(--info-soft)] border border-[var(--info)] flex items-center justify-center font-[family-name:var(--font-d)] font-bold text-[var(--info)] text-lg">
                {fmt.initials(pcp.Name)}
              </div>
              <div>
                <div className="font-[family-name:var(--font-d)] font-semibold text-[17px]">{pcp.Name}</div>
                <div className="text-[13px] text-[var(--text-dim)]">{pcp.Position}</div>
                <div className="mono text-[11px] text-[var(--text-faint)] mt-1">EMP #{pcp.EmployeeID}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="sec-title"><span className="dot" />Prescriptions</div>
      {prescriptions.length === 0
        ? <div className="empty-state">No prescriptions on record.</div>
        : (
          <>
            <div className="table-wrap">
              <table className="dt">
                <thead><tr><th>Date</th><th>Medication #</th><th>Dose</th><th>Physician #</th></tr></thead>
                <tbody>
                  {pagination.pageItems.map((p, i) => (
                    <tr key={i}>
                      <td className="mono">{fmt.dt(p.Date)}</td>
                      <td className="mono">#{p.Medication}</td>
                      <td>{p.Dose}</td>
                      <td className="mono">#{p.Physician}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination {...pagination} pageSize={5} />
          </>
        )
      }
    </div>
  );
}