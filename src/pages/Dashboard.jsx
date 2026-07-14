import { lazy, Suspense, useState, useEffect } from 'react';
import { HiOutlineClock, HiOutlineFire, HiOutlineTrendingUp, HiOutlineStar, HiOutlineLightningBolt } from 'react-icons/hi';
import { dashboardApi } from '../services/api';
import { StatCard, Card, ProgressBar, LoadingSpinner, Badge } from '../components/ui';
import { formatHours } from '../constants';

const GoalConfetti = lazy(() => import('../components/Charts').then(module => ({ default: module.GoalConfetti })));

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    window.addEventListener('devtracker-session-saved', loadDashboard);
    return () => window.removeEventListener('devtracker-session-saved', loadDashboard);
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await dashboardApi.get();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="text-center py-12 text-text-muted">Failed to load dashboard</div>;

  const { hours, goal, streak, level, todayTechnologies, quote, recentActivities } = data;

  return (
    <div className="space-y-6">
      {goal.completed && (
        <Suspense fallback={null}>
          <GoalConfetti show />
        </Suspense>
      )}

      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">Track your daily coding progress</p>
      </div>

      {/* Hours Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Today" value={formatHours(hours.today)} icon={HiOutlineClock} color="primary" delay={1} />
        <StatCard title="This Week" value={formatHours(hours.week)} icon={HiOutlineTrendingUp} color="accent" delay={2} />
        <StatCard title="This Month" value={formatHours(hours.month)} icon={HiOutlineClock} color="purple" delay={3} />
        <StatCard title="This Year" value={formatHours(hours.year)} icon={HiOutlineClock} color="yellow" delay={4} />
        <StatCard title="Total" value={formatHours(hours.total)} icon={HiOutlineStar} color="primary" delay={5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Goal */}
        <Card className="animate-fade-in opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Daily Goal</h3>
            {goal.completed && <Badge color="accent">Completed!</Badge>}
          </div>
          <ProgressBar value={hours.today} max={goal.target} color={goal.completed ? 'accent' : 'primary'} />
          <p className="text-text-muted text-xs mt-2">
            {formatHours(hours.today)} of {goal.target}h goal
          </p>
        </Card>

        {/* Streak & Level */}
        <Card className="animate-fade-in opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HiOutlineFire className="text-orange-400" />
                <span className="text-sm text-text-muted">Streak</span>
              </div>
              <p className="text-2xl font-bold">{streak.current} days</p>
              <p className="text-xs text-text-muted">Best: {streak.longest} days</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HiOutlineLightningBolt className="text-yellow-400" />
                <span className="text-sm text-text-muted">Level {level.current}</span>
              </div>
              <p className="text-2xl font-bold">{level.xp} XP</p>
              <ProgressBar value={level.xp} max={level.xpToNext} showLabel={false} height="h-1.5" />
            </div>
          </div>
        </Card>

        {/* Quote */}
        <Card className="animate-fade-in opacity-0 stagger-4" style={{ animationFillMode: 'forwards' }}>
          <h3 className="font-semibold mb-2">Daily Motivation</h3>
          <blockquote className="text-sm text-text-muted italic">
            "{quote.text}"
          </blockquote>
          <p className="text-xs text-text-muted mt-2">— {quote.author}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Technologies */}
        <Card>
          <h3 className="font-semibold mb-4">Today's Technologies</h3>
          {todayTechnologies.length === 0 ? (
            <p className="text-text-muted text-sm">No study sessions today yet. Start the timer!</p>
          ) : (
            <div className="space-y-3">
              {todayTechnologies.map(tech => (
                <div key={tech.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tech.color }} />
                    <span className="text-sm font-medium">{tech.name}</span>
                  </div>
                  <span className="text-sm text-text-muted">{formatHours(tech.hours)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Activities */}
        <Card>
          <h3 className="font-semibold mb-4">Recent Activities</h3>
          {recentActivities.length === 0 ? (
            <p className="text-text-muted text-sm">No recent activities</p>
          ) : (
            <div className="space-y-3">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{activity.technology_name}</p>
                    <p className="text-xs text-text-muted">{activity.session_date} · {activity.start_time?.slice(0, 5)}</p>
                  </div>
                  <Badge color="primary">{formatHours(parseFloat(activity.duration_hours))}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
