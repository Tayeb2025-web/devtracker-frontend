import { useState, useEffect } from 'react';
import { statsApi } from '../services/api';
import { Card, LoadingSpinner } from '../components/ui';
import ContributionCalendar from '../components/ContributionCalendar';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

export default function CalendarPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    statsApi.getCalendar(year).then(res => {
      setData(res.data || {});
    }).finally(() => setLoading(false));
  }, [year]);

  const totalHours = Object.values(data).reduce((sum, d) => sum + (d.hours || 0), 0);
  const activeDays = Object.values(data).filter(d => d.hours > 0).length;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contribution Calendar</h1>
          <p className="text-text-muted text-sm mt-1">GitHub-style study activity graph</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-lg hover:bg-surface-lighter transition-colors">
            <HiOutlineChevronLeft size={20} />
          </button>
          <span className="font-semibold text-lg min-w-[60px] text-center">{year}</span>
          <button
            onClick={() => setYear(y => y + 1)}
            disabled={year >= new Date().getFullYear()}
            className="p-2 rounded-lg hover:bg-surface-lighter transition-colors disabled:opacity-30"
          >
            <HiOutlineChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-text-muted text-sm">Total Hours</p>
          <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
        </Card>
        <Card>
          <p className="text-text-muted text-sm">Active Days</p>
          <p className="text-2xl font-bold">{activeDays}</p>
        </Card>
        <Card>
          <p className="text-text-muted text-sm">Avg Hours/Day</p>
          <p className="text-2xl font-bold">{activeDays > 0 ? (totalHours / activeDays).toFixed(1) : 0}h</p>
        </Card>
        <Card>
          <p className="text-text-muted text-sm">Year</p>
          <p className="text-2xl font-bold">{year}</p>
        </Card>
      </div>

      <Card className="animate-fade-in overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <ContributionCalendar data={data} year={year} />
        )}
      </Card>
    </div>
  );
}
