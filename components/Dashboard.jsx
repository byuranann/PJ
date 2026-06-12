import React, { useMemo, useState } from 'react';
import { RefreshCw, Hash, Banknote, Weight } from 'lucide-react';
import { CATEGORIES, CHART_COLORS, fmt } from '../data';

/* ===== Hand-rolled bar chart (no deps) — flat Swiss style ===== */
function BarChartSVG({ data }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(...data.map((d) => d.จำนวนเงิน), 1);
  const ariaLabel = `กราฟแท่งยอดรวมตามประเภท: ${data
    .map((d) => `${d.ประเภท} ${fmt(d.จำนวนเงิน)} บาท`)
    .join(', ')}`;
  return (
    <div role="img" aria-label={ariaLabel}>
      <div className="relative h-56">
        {/* hairline horizontal gridlines */}
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute left-0 right-0 h-px bg-[#E0DED8]"
            style={{ top: `${(i / 4) * 100}%` }}
            aria-hidden="true"
          />
        ))}
        {/* bars */}
        <div className="absolute inset-0 flex items-end justify-around gap-2 sm:gap-4 px-1 sm:px-2">
          {data.map((d, i) => {
            const hPct = (d.จำนวนเงิน / max) * 100;
            const active = hover === i;
            return (
              <div
                key={d.ประเภท}
                className="flex-1 max-w-[64px] h-full flex flex-col items-center justify-end"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                title={`${d.ประเภท}: ${fmt(d.จำนวนเงิน)} บาท`}
              >
                <span className={`tnum text-[10px] sm:text-xs font-black mb-1 ${active ? 'text-[#92400E]' : 'text-[#1A1A1A]'}`}>
                  {fmt(d.จำนวนเงิน)}
                </span>
                <div
                  className={`w-full transition-colors duration-150 ${active ? 'bg-[#92400E]' : 'bg-[#D97706]'}`}
                  style={{ height: `${hPct}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* charcoal baseline axis */}
      <div className="h-px bg-[#1A1A1A]" aria-hidden="true" />
      {/* category labels */}
      <div className="flex justify-around gap-2 sm:gap-4 px-1 sm:px-2 pt-2">
        {data.map((d) => (
          <span key={d.ประเภท} className="flex-1 max-w-[64px] text-center text-[10px] sm:text-[11px] text-[#6B7280] leading-tight break-words">
            {d.ประเภท}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ===== Hand-rolled donut chart (pure SVG, no deps) ===== */
function DonutChartSVG({ data, total }) {
  const [hover, setHover] = useState(null);
  const R = 40;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const segments = data.map((d, i) => {
    const frac = total > 0 ? d.จำนวนเงิน / total : 0;
    const seg = { ...d, frac, dash: frac * C, offset, color: CHART_COLORS[i % CHART_COLORS.length] };
    offset += frac * C;
    return seg;
  });
  const ariaLabel = `กราฟวงกลมสัดส่วนยอดรวม: ${segments
    .map((s) => `${s.ประเภท} ${(s.frac * 100).toFixed(1)} เปอร์เซ็นต์`)
    .join(', ')}`;
  return (
    <div>
      <div role="img" aria-label={ariaLabel} className="flex justify-center">
        <svg viewBox="0 0 120 120" className="w-full max-w-[220px] h-auto">
          <g transform="rotate(-90 60 60)">
            {segments.map((s, i) => (
              <circle
                key={s.ประเภท}
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={hover === i ? 22 : 18}
                strokeDasharray={`${Math.max(s.dash - 1.5, 0)} ${C - Math.max(s.dash - 1.5, 0)}`}
                strokeDashoffset={-s.offset}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ transition: 'stroke-width 150ms' }}
              >
                <title>{`${s.ประเภท}: ${fmt(s.จำนวนเงิน)} บาท (${(s.frac * 100).toFixed(1)}%)`}</title>
              </circle>
            ))}
          </g>
          <text x="60" y="57" textAnchor="middle" className="tnum" style={{ fontSize: 11, fontWeight: 900, fill: '#1A1A1A' }}>
            {fmt(total)}
          </text>
          <text x="60" y="69" textAnchor="middle" style={{ fontSize: 6.5, fill: '#6B7280', letterSpacing: '0.1em' }}>
            ยอดรวม (บาท)
          </text>
        </svg>
      </div>
      {/* legend with square markers */}
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {segments.map((s, i) => (
          <li
            key={s.ประเภท}
            className="flex items-center justify-between gap-2 text-xs"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="inline-block w-2.5 h-2.5 shrink-0" style={{ backgroundColor: s.color }} aria-hidden="true" />
              <span className="truncate text-[#1A1A1A]">{s.ประเภท}</span>
            </span>
            <span className="tnum font-black shrink-0">{(s.frac * 100).toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Dashboard({ records, loading, onRefresh }) {
  const totals = useMemo(() => ({
    count: records.length,
    amount: records.reduce((s, r) => s + Number(r.จำนวน || 0), 0),
    weight: records.reduce((s, r) => s + Number(r.น้ำหนัก || 0), 0),
  }), [records]);

  const byCategory = useMemo(() =>
    CATEGORIES.map((cat) => {
      const rows = records.filter((r) => r.ประเภท === cat);
      return {
        ประเภท: cat,
        จำนวนเงิน: rows.reduce((s, r) => s + Number(r.จำนวน || 0), 0),
        รายการ: rows.length,
      };
    }).filter((d) => d.รายการ > 0),
  [records]);

  const stats = [
    { label: 'จำนวนรายการทั้งหมด', value: fmt(totals.count), icon: Hash, accent: '#1A1A1A' },
    { label: 'ยอดรวม (บาท)', value: fmt(totals.amount), icon: Banknote, accent: '#D97706' },
    { label: 'น้ำหนักรวม (กก.)', value: fmt(totals.weight, 1), icon: Weight, accent: '#1E3A5F' },
  ];

  return (
    <div>
      {/* Page label — Dashboard: charcoal + deep blue accent */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E3A5F]">02 — แดชบอร์ด</span>
        <span className="flex-1 h-px bg-[#1E3A5F]" aria-hidden="true" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none">แดชบอร์ด</h1>
          <p className="text-sm text-[#6B7280] mt-2">ภาพรวมข้อมูลทั้งหมด — Mission Control</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          aria-busy={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#D97706] transition-colors disabled:opacity-60 disabled:cursor-wait"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
          {loading ? 'กำลังโหลด...' : 'รีเฟรชข้อมูล'}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#E0DED8] border border-[#1A1A1A] mb-8">
        {stats.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="bg-white p-6 sm:p-8 relative">
            <span className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: accent }} aria-hidden="true" />
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">{label}</p>
              <Icon size={18} style={{ color: accent }} strokeWidth={2.25} aria-hidden="true" />
            </div>
            <p className="tnum text-4xl sm:text-5xl font-black tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts — hand-rolled, dependency-free */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section className="border border-[#E0DED8] bg-white p-6" aria-label="กราฟแท่งยอดรวมตามประเภท">
          <h2 className="text-sm font-black uppercase tracking-widest mb-1">ยอดรวมตามประเภท</h2>
          <p className="text-xs text-[#6B7280] mb-4">หน่วย: บาท</p>
          {byCategory.length === 0 ? (
            <p className="text-sm text-[#6B7280] py-10 text-center">ไม่มีข้อมูล</p>
          ) : (
            <BarChartSVG data={byCategory} />
          )}
        </section>

        <section className="border border-[#E0DED8] bg-white p-6" aria-label="กราฟวงกลมสัดส่วนตามประเภท">
          <h2 className="text-sm font-black uppercase tracking-widest mb-1">สัดส่วนยอดรวม</h2>
          <p className="text-xs text-[#6B7280] mb-4">แยกตามประเภท</p>
          {byCategory.length === 0 ? (
            <p className="text-sm text-[#6B7280] py-10 text-center">ไม่มีข้อมูล</p>
          ) : (
            <DonutChartSVG data={byCategory} total={totals.amount} />
          )}
        </section>
      </div>

      {/* Progress list — สัดส่วนตามประเภท */}
      <section className="border border-[#E0DED8] bg-white p-6 mb-8" aria-label="สัดส่วนตามประเภท">
        <h2 className="text-sm font-black uppercase tracking-widest mb-6">สัดส่วนตามประเภท</h2>
        <ul className="space-y-5">
          {byCategory.map((d) => {
            const pct = totals.amount > 0 ? (d.จำนวนเงิน / totals.amount) * 100 : 0;
            return (
              <li key={d.ประเภท}>
                <div className="flex justify-between items-baseline text-sm mb-1.5">
                  <span className="font-bold">{d.ประเภท} <span className="text-xs text-[#6B7280] font-normal">({d.รายการ} รายการ)</span></span>
                  <span className="tnum font-black">{pct.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-[#2B2B2B]" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={`${d.ประเภท} ${pct.toFixed(1)} เปอร์เซ็นต์`}>
                  <div className="h-full bg-[#F59E0B] transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Table */}
      <section className="border border-[#1A1A1A] bg-white overflow-x-auto" aria-label="ตารางข้อมูลทั้งหมด">
        <table className="w-full text-sm min-w-[640px]">
          <caption className="text-left text-sm font-black uppercase tracking-widest p-6 pb-4">รายการทั้งหมด</caption>
          <thead>
            <tr className="border-y border-[#1A1A1A] text-left">
              {['#', 'ชื่อ', 'ประเภท', 'น้ำหนัก (กก.)', 'จำนวน (บาท)', 'บันทึกข้อความ'].map((h) => (
                <th key={h} scope="col" className="px-4 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-[#6B7280]">ไม่มีข้อมูล</td></tr>
            ) : (
              records.map((r, i) => (
                <tr key={i} className="border-b border-[#E0DED8] hover:bg-[#FFF7E8] transition-colors">
                  <td className="tnum px-4 sm:px-6 py-3 text-[#6B7280]">{String(i + 1).padStart(2, '0')}</td>
                  <td className="px-4 sm:px-6 py-3 font-bold">{r.ชื่อ}</td>
                  <td className="px-4 sm:px-6 py-3"><span className="inline-block border border-[#E0DED8] px-2 py-0.5 text-xs">{r.ประเภท}</span></td>
                  <td className="tnum px-4 sm:px-6 py-3">{fmt(r.น้ำหนัก, 1)}</td>
                  <td className="tnum px-4 sm:px-6 py-3 font-bold">{fmt(r.จำนวน)}</td>
                  <td className="px-4 sm:px-6 py-3 text-[#6B7280]">{r.บันทึกข้อความ || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}