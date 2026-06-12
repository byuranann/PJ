import React from 'react';
import { ArrowRight, LayoutDashboard, FilePlus2, Database, BarChart3, ClipboardList } from 'lucide-react';
import { fmt } from '../data';

export default function Landing({ onNavigate, records }) {
  const total = records.reduce((s, r) => s + Number(r.จำนวน || 0), 0);
  const weight = records.reduce((s, r) => s + Number(r.น้ำหนัก || 0), 0);

  const features = [];
    //{ no: '01', icon: Database, title: 'บันทึกข้อมูล', desc: 'กรอกข้อมูลรายการผ่านแบบฟอร์มที่ใช้งานง่าย พร้อมการตรวจสอบความถูกต้องอัตโนมัติ' },
    //{ no: '02', icon: BarChart3, title: 'วิเคราะห์ภาพรวม', desc: 'ดูสถิติ ยอดรวม และสัดส่วนตามประเภทผ่านแดชบอร์ดแบบเรียลไทม์' },
    // no: '03', icon: ClipboardList, title: 'เชื่อมต่อ Google Sheets', desc: 'ข้อมูลทั้งหมดจัดเก็บใน Google Sheets ผ่าน Google Apps Script อย่างปลอดภัย' },
  

  return (
    <div>
      {/* Page label — Landing: amber accent */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D97706]">01 — หน้าแรก</span>
        <span className="flex-1 h-px bg-[#D97706]" aria-hidden="true" />
      </div>

      {/* Hero */}
      <section className="border border-[#1A1A1A] bg-white">
        <div className="p-6 sm:p-12 border-b border-[#E0DED8]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#6B7280] mb-4">ระบบบริหารจัดการข้อมูล</p>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.95] mb-6">
            PJ EDITION<span className="text-[#D97706]">.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] max-w-2xl leading-relaxed">
            พัฒนาเกษตรไทยด้วยนวัตกรรม สร้างคุณค่าแก่เกษตรกร และเติบโตอย่างยั่งยืนไปพร้อมกับสังคม
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#D97706] transition-colors"
            >
              <LayoutDashboard size={16} aria-hidden="true" /> ดูแดชบอร์ด <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => onNavigate('form')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#1A1A1A] text-[#1A1A1A] text-sm font-bold uppercase tracking-wider hover:bg-[#FFF7E8] hover:border-[#D97706] hover:text-[#92400E] transition-colors"
            >
              <FilePlus2 size={16} aria-hidden="true" /> เริ่มบันทึกข้อมูล
            </button>
          </div>
        </div>

        {/* Hero stats strip */}
        <div className="grid grid-cols-3 divide-x divide-[#E0DED8]">
          {[
            { label: 'รายการ', value: fmt(records.length) },
            { label: 'ยอดรวม (บาท)', value: fmt(total) },
            { label: 'น้ำหนักรวม (กก.)', value: fmt(weight, 1) },
          ].map((s) => (
            <div key={s.label} className="p-4 sm:p-6">
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#6B7280] mb-1">{s.label}</p>
              <p className="tnum text-xl sm:text-3xl font-black tracking-tight">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 mt-8 border border-[#E0DED8] divide-y md:divide-y-0 md:divide-x divide-[#E0DED8] bg-white" aria-label="คุณสมบัติหลัก">
        {features.map(({ no, icon: Icon, title, desc }) => (
          <article key={no} className="p-6 sm:p-8 group hover:bg-[#FAF9F6] transition-colors">
            <div className="flex items-center justify-between mb-6">
              <span className="tnum text-sm font-black text-[#D97706]">{no}</span>
              <Icon size={20} className="text-[#1A1A1A]" strokeWidth={2} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-black tracking-tight mb-2">{title}</h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">{desc}</p>
            <span className="block w-8 h-[3px] bg-[#1A1A1A] mt-6 group-hover:w-12 group-hover:bg-[#D97706] transition-all" aria-hidden="true" />
          </article>
        ))}
      </section>
    </div>
  );
}