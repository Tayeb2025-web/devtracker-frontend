import { NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineHome, HiOutlineClock, HiOutlineChartBar,
  HiOutlineCalendar, HiOutlineCode, HiOutlineDocumentText,
  HiOutlineBadgeCheck, HiOutlineFlag, HiOutlinePencil,
  HiOutlineCog, HiOutlineSearch, HiOutlineSun, HiOutlineMoon, HiOutlineMenuAlt2,
  HiOutlineMusicNote,
} from 'react-icons/hi';
import { ROUTES } from '../constants';
import { useTheme } from '../contexts/ThemeContextStore';
import { useState } from 'react';

const navItems = [
  { to: ROUTES.DASHBOARD, icon: HiOutlineHome, label: 'Dashboard' },
  { to: ROUTES.TIMER, icon: HiOutlineClock, label: 'Timer' },
  { to: ROUTES.STATISTICS, icon: HiOutlineChartBar, label: 'Statistics' },
  { to: ROUTES.CALENDAR, icon: HiOutlineCalendar, label: 'Calendar' },
  { to: ROUTES.TECHNOLOGIES, icon: HiOutlineCode, label: 'Technologies' },
  { to: ROUTES.HISTORY, icon: HiOutlineDocumentText, label: 'History' },
  { to: ROUTES.ACHIEVEMENTS, icon: HiOutlineBadgeCheck, label: 'Achievements' },
  { to: ROUTES.CHALLENGES, icon: HiOutlineFlag, label: 'Challenges' },
  { to: ROUTES.NOTES, icon: HiOutlinePencil, label: 'Notes' },
  { to: ROUTES.MUSIC, icon: HiOutlineMusicNote, label: 'Music' },
  { to: ROUTES.SETTINGS, icon: HiOutlineCog, label: 'Settings' },
];

export default function Sidebar({ isCollapsed, onToggle }) {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.HISTORY}?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 glass border-r border-border flex flex-col z-40 transition-transform duration-300 ease-in-out ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}`}>
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3 pr-8">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center font-bold text-white text-sm">
            DT
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">DevTracker</h1>
            <p className="text-[11px] text-text-muted">Study Progress Tracker</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Hide sidebar"
          title="Hide sidebar"
          className="absolute top-5 right-3 p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-lighter transition-colors"
        >
          <HiOutlineMenuAlt2 size={19} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ROUTES.DASHBOARD}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary/15 text-primary border border-primary/20'
                  : 'text-text-muted hover:text-text hover:bg-surface-lighter'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        {searchOpen ? (
          <form onSubmit={handleSearch}>
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onBlur={() => !searchQuery && setSearchOpen(false)}
              placeholder="Search sessions..."
              className="w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-sm focus:outline-none focus:border-primary/50"
            />
          </form>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface-lighter w-full transition-colors"
          >
            <HiOutlineSearch size={18} />
            Search
            <kbd className="ml-auto text-[10px] bg-surface-lighter px-1.5 py-0.5 rounded border border-border">Ctrl+K</kbd>
          </button>
        )}

        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface-lighter w-full transition-colors"
        >
          {isDark ? <HiOutlineSun size={18} /> : <HiOutlineMoon size={18} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </aside>
  );
}
