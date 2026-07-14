import { useState, useMemo } from 'react';
import { CALENDAR_COLORS, formatLocalDate, getCalendarLevel } from '../constants';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ContributionCalendar({ data, year }) {
  const [tooltip, setTooltip] = useState(null);

  const weeks = useMemo(() => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const result = [];
    let currentWeek = [];

    // Pad start to Sunday
    const startDay = startDate.getDay();
    for (let i = 0; i < startDay; i++) {
      currentWeek.push(null);
    }

    const current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = formatLocalDate(current);
      const dayData = data[dateStr];
      currentWeek.push({
        date: dateStr,
        hours: dayData?.hours || 0,
        technologies: dayData?.technologies || '',
        level: getCalendarLevel(dayData?.hours || 0),
      });

      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
      current.setDate(current.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      result.push(currentWeek);
    }

    return result;
  }, [data, year]);

  const getColor = (level) => {
    return CALENDAR_COLORS[level] || CALENDAR_COLORS.none;
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-[3px] min-w-max">
        {/* Month labels */}
        <div className="flex flex-col mr-1">
          <div className="h-4" />
          {DAYS.map((d, i) => (
            <div key={d} className="h-[11px] text-[10px] text-text-muted leading-[11px] my-[1px]" style={{ visibility: i % 2 === 0 ? 'visible' : 'hidden' }}>
              {d}
            </div>
          ))}
        </div>

        <div>
          <div className="flex gap-[3px] mb-1 h-4">
            {weeks.map((week, wi) => {
              const firstDay = week.find(d => d);
              const month = firstDay ? new Date(`${firstDay.date}T00:00:00`).getMonth() : -1;
              const prevMonth = wi > 0 ? (() => {
                const pw = weeks[wi - 1].find(d => d);
                return pw ? new Date(`${pw.date}T00:00:00`).getMonth() : -1;
              })() : -1;
              return (
                <div key={wi} className="w-[11px] text-[10px] text-text-muted">
                  {month !== prevMonth && month >= 0 ? MONTHS[month] : ''}
                </div>
              );
            })}
          </div>

          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className="w-[11px] h-[11px] rounded-sm transition-all duration-150 hover:ring-1 hover:ring-primary/50 cursor-pointer"
                    style={{ backgroundColor: day ? getColor(day.level) : 'transparent' }}
                    onMouseEnter={(e) => day && setTooltip({ ...day, x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-text-muted">
        <span>Less</span>
        {['none', 'level1', 'level2', 'level3', 'level4', 'level5', 'level6'].map(l => (
          <div key={l} className="w-[11px] h-[11px] rounded-sm" style={{ backgroundColor: CALENDAR_COLORS[l] }} />
        ))}
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 glass rounded-lg px-3 py-2 text-xs pointer-events-none shadow-xl"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
        >
          <p className="font-semibold">{tooltip.hours.toFixed(1)} hours on {tooltip.date}</p>
          {tooltip.technologies && <p className="text-text-muted mt-0.5">{tooltip.technologies}</p>}
        </div>
      )}
    </div>
  );
}
