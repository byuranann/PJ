import React, { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CATEGORIES, GAS_URL } from '../data';

// Form page accent: forest/olive green
const ACCENT = '#3F6212';

const initial = { ชื่อ: '', ประเภท: '', น้ำหนัก: '', จำนวน: '', บันทึกข้อความ: '' };

export default function RecordForm({ onAddLocal, onDone }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // {type:'success'|'error', msg}

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.ชื่อ.trim()) er.ชื่อ = 'กรุณากรอกชื่อ';
    if (!form.ประเภท) er.ประเภท = 'กรุณาเลือกประเภท';
    const w = Number(form.น้ำหนัก);
    if (form.น้ำหนัก === '' || isNaN(w) || w <= 0) er.น้ำหนัก = 'กรุณากรอกน้ำหนักเป็นตัวเลขมากกว่า 0';
    const a = Number(form.จำนวน);
    if (form.จำนวน === '' || isNaN(a) || a < 0) er.จำนวน = 'กรุณากรอกจำนวนเงินเป็นตัวเลขตั้งแต่ 0 ขึ้นไป';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;
    setSubmitting(true);
    const record = {
      name: form.ชื่อ.trim(),
      type: form.ประเภท,
      weight: Number(form.น้ำหนัก),
      amount: Number(form.จำนวน),
      note: form.บันทึกข้อความ.trim(),
    };
    try {
      if (GAS_URL) {
        const res = await fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(record),
        });
        if (!res.ok) throw new Error('post failed');
      } else {
        await new Promise((r) => setTimeout(r, 600));
        onAddLocal(record);
      }
      setStatus({ type: 'success', msg: 'บันทึกข้อมูลสำเร็จ!' });
      setForm(initial);
      setTimeout(onDone, 1200);
    } catch (err) {
      setStatus({ type: 'error', msg: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (k) =>
    `w-full px-4 py-3 bg-white border text-sm text-[#1A1A1A] placeholder-[#9CA3AF] transition-colors focus:border-[#3F6212] ${
      errors[k] ? 'border-[#B91C1C]' : 'border-[#1A1A1A]'
    }`;

  const Err = ({ k }) =>
    errors[k] ? (
      <p id={`err-${k}`} role="alert" className="mt-1.5 text-xs font-bold text-[#B91C1C]">{errors[k]}</p>
    ) : null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page label — Form: forest green accent */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>03 — บันทึกข้อมูล</span>
        <span className="flex-1 h-px" style={{ backgroundColor: ACCENT }} aria-hidden="true" />
      </div>

      <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none mb-2">บันทึกข้อมูล</h1>
      <p className="text-sm text-[#6B7280] mb-8">กรอกข้อมูลรายการใหม่ให้ครบถ้วน แล้วกดบันทึก</p>

      {status && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center gap-2 border px-4 py-3 mb-6 text-sm font-bold ${
            status.type === 'success'
              ? 'border-[#3F6212] bg-[#F3F7EC] text-[#3F6212]'
              : 'border-[#B91C1C] bg-[#FEF2F2] text-[#B91C1C]'
          }`}
        >
          {status.type === 'success' ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="border border-[#1A1A1A] bg-white">
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <label htmlFor="f-name" className="block text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">ชื่อ *</label>
            <input id="f-name" type="text" value={form.ชื่อ} onChange={set('ชื่อ')} placeholder="ชื่อ นามสกุล"
              aria-invalid={!!errors.ชื่อ} aria-describedby={errors.ชื่อ ? 'err-ชื่อ' : undefined} className={inputCls('ชื่อ')} />
            <Err k="ชื่อ" />
          </div>

          <div>
            <label htmlFor="f-cat" className="block text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">ประเภท *</label>
            <select id="f-cat" value={form.ประเภท} onChange={set('ประเภท')}
              aria-invalid={!!errors.ประเภท} aria-describedby={errors.ประเภท ? 'err-ประเภท' : undefined} className={inputCls('ประเภท')}>
              <option value="">— เลือกประเภท —</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <Err k="ประเภท" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="f-weight" className="block text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">น้ำหนัก (กก.) *</label>
              <input id="f-weight" type="number" step="any" min="0" value={form.น้ำหนัก} onChange={set('น้ำหนัก')} placeholder="0.0"
                aria-invalid={!!errors.น้ำหนัก} aria-describedby={errors.น้ำหนัก ? 'err-น้ำหนัก' : undefined} className={inputCls('น้ำหนัก') + ' tnum'} />
              <Err k="น้ำหนัก" />
            </div>
            <div>
              <label htmlFor="f-amount" className="block text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">จำนวน (บาท) *</label>
              <input id="f-amount" type="number" step="any" min="0" value={form.จำนวน} onChange={set('จำนวน')} placeholder="0"
                aria-invalid={!!errors.จำนวน} aria-describedby={errors.จำนวน ? 'err-จำนวน' : undefined} className={inputCls('จำนวน') + ' tnum'} />
              <Err k="จำนวน" />
            </div>
          </div>

          <div>
            <label htmlFor="f-note" className="block text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">บันทึกข้อความ</label>
            <textarea id="f-note" rows={4} value={form.บันทึกข้อความ} onChange={set('บันทึกข้อความ')}
              placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)" className={inputCls('บันทึกข้อความ') + ' resize-y'} />
          </div>
        </div>

        <div className="border-t border-[#E0DED8] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">* จำเป็นต้องกรอก</p>
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-white text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-60 disabled:cursor-wait bg-[#1A1A1A] hover:bg-[#3F6212]"
          >
            <Send size={16} aria-hidden="true" />
            {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>
        </div>
      </form>
    </div>
  );
}