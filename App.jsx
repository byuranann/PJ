import React, { useState, useEffect, useCallback } from 'react';
import { Home, LayoutDashboard, FilePlus2 } from 'lucide-react';
import { DEMO_DATA, GAS_URL } from './data';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import RecordForm from './components/RecordForm';

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Noto+Sans+Thai:wght@400;500;700;900&display=swap');
.pj-root { font-family: 'Inter','Noto Sans Thai',sans-serif; }
.pj-root .tnum { font-variant-numeric: tabular-nums; }
.pj-root *:focus-visible { outline: 2px solid #D97706; outline-offset: 2px; }
`;

const NAV = [
  { id: 'landing', label: 'หน้าแรก', icon: Home },
  { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
  { id: 'form', label: 'บันทึกข้อมูล', icon: FilePlus2 },
];

export default function App() {
  const [view, setView] = useState('landing');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (!GAS_URL) {
        await new Promise((r) => setTimeout(r, 500));
        setRecords((prev) => (prev.length > 0 ? prev : DEMO_DATA));
        setDemoMode(true);
      } else {
        const res = await fetch(GAS_URL);
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        const mapped = (data.data || []).map(r => ({
          ชื่อ: r.name,
          ประเภท: r.type,
          น้ำหนัก: r.weight,
          จำนวน: r.amount,
          บันทึกข้อความ: r.note
        }));

        setRecords(mapped);
        setDemoMode(false);
      }
    } catch (e) {
      setRecords((prev) => (prev.length > 0 ? prev : DEMO_DATA));
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addLocalRecord = (rec) => setRecords((prev) => [...prev, rec]);

  return (
    <div className="pj-root min-h-screen bg-[#FAF9F6] text-[#1A1A1A]">
      <style>{FONT_CSS}</style>

      {/* Top navigation */}
      <header className="border-b-2 border-[#1A1A1A] bg-[#FAF9F6] sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setView('landing')}
              className="flex items-baseline gap-2 group"
              aria-label="PJ EDITION — กลับหน้าแรก"
            >
              <span className="text-xl font-black tracking-tight uppercase">PJ&nbsp;Edition</span>
              <span className="hidden sm:inline-block w-2.5 h-2.5 bg-[#D97706] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </button>
            <nav aria-label="เมนูหลัก" className="flex items-stretch h-full">
              {NAV.map(({ id, label, icon: Icon }) => {
                const active = view === id;
                return (
                  <button
                    key={id}
                    onClick={() => setView(id)}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex items-center gap-1.5 px-2.5 sm:px-4 h-16 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors ${
                      active ? 'text-[#1A1A1A]' : 'text-[#6B7280] hover:text-[#1A1A1A]'
                    }`}
                  >
                    <Icon size={16} strokeWidth={2.25} aria-hidden="true" />
                    <span>{label}</span>
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[3px] transition-colors ${active ? 'bg-[#D97706]' : 'bg-transparent'}`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Demo mode notice */}
      {demoMode && (
        <div role="status" className="border-b border-[#E0DED8] bg-[#FFF7E8]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 flex items-center gap-2 text-xs sm:text-sm text-[#92400E]">
            <span className="inline-block w-2 h-2 bg-[#D97706]" aria-hidden="true" />
            กำลังแสดงข้อมูลตัวอย่าง (ยังไม่ได้เชื่อมต่อ Google Sheets)
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        {view === 'landing' && <Landing onNavigate={setView} records={records} />}
        {view === 'dashboard' && (
          <Dashboard records={records} loading={loading} onRefresh={fetchData} />
        )}
        {view === 'form' && (
          <RecordForm
            onAddLocal={addLocalRecord}
            onDone={() => setView('dashboard')}
          />
        )}
      </main>

      <footer className="border-t border-[#E0DED8] mt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs uppercase tracking-widest text-[#6B7280]">
          <span>PJ Edition — ระบบบันทึกและติดตามข้อมูล</span>
          <span className="tnum">© 2026</span>
        </div>
      </footer>
    </div>
  );
}
