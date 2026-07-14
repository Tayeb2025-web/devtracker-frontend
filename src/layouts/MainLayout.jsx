import Sidebar from '../components/Sidebar';
import MiniMusicPlayer from '../components/MiniMusicPlayer';
import { useEffect, useState } from 'react';
import { HiOutlineBell, HiOutlineMenuAlt2, HiOutlineVolumeOff } from 'react-icons/hi';
import { useTimer } from '../contexts/TimerContextStore';

export default function MainLayout({ children }) {
  const { isAlarmActive, dismissAlarm } = useTimer();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem('devtracker-sidebar-collapsed') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('devtracker-sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(true)} />
      {sidebarCollapsed && (
        <button
          type="button"
          onClick={() => setSidebarCollapsed(false)}
          aria-label="Show sidebar"
          title="Show sidebar"
          className="fixed top-4 left-4 z-50 p-2.5 rounded-lg glass text-text-muted hover:text-text hover:bg-surface-lighter transition-colors"
        >
          <HiOutlineMenuAlt2 size={20} />
        </button>
      )}
      {isAlarmActive && (
        <div role="alert" className="fixed top-4 right-4 z-[70] flex items-center gap-3 rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 shadow-xl backdrop-blur-sm animate-pulse">
          <HiOutlineBell size={21} className="text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-text">Timer complete</p>
            <p className="text-xs text-text-muted">Alarm is ringing until you turn it off.</p>
          </div>
          <button
            type="button"
            onClick={dismissAlarm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
          >
            <HiOutlineVolumeOff size={16} /> Turn off
          </button>
        </div>
      )}
      <main className={`${sidebarCollapsed ? 'ml-0' : 'ml-64'} min-h-screen transition-[margin] duration-300 ease-in-out`}>
        <div className="p-8 pb-28 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <MiniMusicPlayer />
    </div>
  );
}
