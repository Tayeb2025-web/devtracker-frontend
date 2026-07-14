import { useState, useEffect } from 'react';
import { statsApi } from '../services/api';
import { Card, LoadingSpinner, StatCard } from '../components/ui';
import { LineChart, BarChartComponent, PieChartComponent } from '../components/Charts';
import { formatHours } from '../constants';
import { HiOutlineChartBar, HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineCode } from 'react-icons/hi';

const PERIODS = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
];

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('daily');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    statsApi.get().then(res => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <div className="text-center py-12 text-text-muted">Failed to load statistics</div>;

  const chartData = stats.charts[period] || [];
  const techData = stats.techDistribution.filter(t => parseFloat(t.hours) > 0);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="text-text-muted text-sm mt-1">Analyze your study patterns</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Average Hours/Day" value={formatHours(stats.averageHours)} icon={HiOutlineChartBar} />
        <StatCard title="Focus Score" value={`${stats.focusScore}%`} icon={HiOutlineTrendingUp} color="accent" />
        <StatCard title="Best Day" value={stats.bestDay ? formatHours(parseFloat(stats.bestDay.hours)) : '—'} subtitle={stats.bestDay?.session_date} icon={HiOutlineTrendingUp} color="accent" />
        <StatCard title="Most Studied" value={stats.mostStudied?.name || '—'} subtitle={stats.mostStudied ? formatHours(parseFloat(stats.mostStudied.hours)) : ''} icon={HiOutlineCode} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Study Hours</h3>
            <div className="flex gap-2">
              {PERIODS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    period === p.key ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-surface-lighter'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            {['line', 'bar'].map(t => (
              <button
                key={t}
                onClick={() => setChartType(t)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  chartType === t ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-surface-lighter'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {chartData.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-12">No data for this period</p>
          ) : chartType === 'line' ? (
            <LineChart data={chartData} />
          ) : (
            <BarChartComponent data={chartData} />
          )}
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Technology Distribution</h3>
          {techData.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-12">No technology data yet</p>
          ) : (
            <PieChartComponent data={techData} />
          )}
        </Card>
      </div>

      {stats.worstDay && (
        <Card>
          <div className="flex items-center gap-2">
            <HiOutlineTrendingDown className="text-red-400" />
            <span className="text-sm">Lowest study day: <strong>{stats.worstDay.session_date}</strong> — {formatHours(parseFloat(stats.worstDay.hours))}</span>
          </div>
        </Card>
      )}
    </div>
  );
}
