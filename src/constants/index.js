export const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const ROUTES = {
  DASHBOARD: '/',
  TIMER: '/timer',
  STATISTICS: '/statistics',
  CALENDAR: '/calendar',
  TECHNOLOGIES: '/technologies',
  HISTORY: '/history',
  ACHIEVEMENTS: '/achievements',
  CHALLENGES: '/challenges',
  NOTES: '/notes',
  MUSIC: '/music',
  SETTINGS: '/settings',
};

export const CALENDAR_COLORS = {
  none: '#161b22',
  level1: '#0e4429',
  level2: '#006d32',
  level3: '#26a641',
  level4: '#39d353',
  level5: '#3B82F6',
  level6: '#8B5CF6',
};

export const CALENDAR_LABELS = {
  none: 'No Study',
  level1: '< 1 Hour',
  level2: '1-3 Hours',
  level3: '3-5 Hours',
  level4: '5-8 Hours',
  level5: '8-10 Hours',
  level6: '10+ Hours',
};

export function getCalendarLevel(hours) {
  if (hours <= 0) return 'none';
  if (hours < 1) return 'level1';
  if (hours < 3) return 'level2';
  if (hours < 5) return 'level3';
  if (hours < 8) return 'level4';
  if (hours < 10) return 'level5';
  return 'level6';
}

export const ACHIEVEMENT_DEFS = [
  { key: 'first_session', name: 'First Study Session', icon: '🚀', description: 'Complete your first study session' },
  { key: 'streak_7', name: '7 Days Streak', icon: '🔥', description: 'Study for 7 consecutive days' },
  { key: 'streak_30', name: '30 Days Streak', icon: '🔥', description: 'Study for 30 consecutive days' },
  { key: 'hours_100', name: '100 Hours', icon: '⏰', description: 'Reach 100 total study hours' },
  { key: 'hours_500', name: '500 Hours', icon: '⏰', description: 'Reach 500 total study hours' },
  { key: 'hours_1000', name: '1000 Hours', icon: '⏰', description: 'Reach 1000 total study hours' },
  { key: 'react_master', name: 'React Master', icon: '⚛️', description: 'Study React for 50+ hours' },
  { key: 'node_beginner', name: 'Node Beginner', icon: '🟢', description: 'Study Node.js for 10+ hours' },
  { key: 'tailwind_expert', name: 'Tailwind Expert', icon: '🎨', description: 'Study Tailwind for 25+ hours' },
];

export const KEYBOARD_SHORTCUTS = {
  'Ctrl+K': 'Search',
  'Ctrl+T': 'Timer',
  'Ctrl+D': 'Dashboard',
  'Space': 'Start/Pause Timer',
};

export function formatHours(hours) {
  const totalMinutes = Math.round(Number(hours || 0) * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatLocalDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
