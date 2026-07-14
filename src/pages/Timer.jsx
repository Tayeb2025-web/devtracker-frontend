import { useEffect, useState } from 'react';
import {
  HiOutlinePlay, HiOutlinePause, HiOutlineStop, HiOutlineRefresh,
  HiOutlineClock, HiOutlineBell, HiOutlinePlus, HiOutlineTrash,
  HiOutlineBookmark,
} from 'react-icons/hi';
import { useTimer } from '../contexts/TimerContextStore';
import { useToast } from '../contexts/ToastContextStore';
import { technologyApi } from '../services/api';
import { Card, Button, Input, Select, Textarea, LoadingSpinner } from '../components/ui';
import { formatDuration } from '../constants';

const CUSTOM_TIMERS_KEY = 'devtracker-custom-timers';

const getDurationParts = (seconds) => ({
  hours: Math.floor(seconds / 3600),
  minutes: Math.floor((seconds % 3600) / 60),
});

const getDurationSeconds = (hours, minutes) => {
  const safeHours = Math.max(0, parseInt(hours, 10) || 0);
  const safeMinutes = Math.min(59, Math.max(0, parseInt(minutes, 10) || 0));
  return (safeHours * 60 + safeMinutes) * 60;
};

const loadCustomTimers = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_TIMERS_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export default function TimerPage() {
  const toast = useToast();
  const stopwatch = useTimer();
  const countdown = stopwatch.countdown;
  const { setTechnologyId: setStopwatchTechnologyId } = stopwatch;
  const { setTechnologyId: setCountdownTechnologyId } = countdown;
  const [mode, setMode] = useState('timer');
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialDuration = getDurationParts(countdown.totalSeconds);
  const [hours, setHours] = useState(String(initialDuration.hours));
  const [minutes, setMinutes] = useState(String(initialDuration.minutes));
  const [customTimers, setCustomTimers] = useState(loadCustomTimers);
  const [customLabel, setCustomLabel] = useState('');
  const [customHours, setCustomHours] = useState('0');
  const [customMinutes, setCustomMinutes] = useState('25');
  const [customTechnologyId, setCustomTechnologyId] = useState('');

  useEffect(() => {
    let active = true;

    technologyApi.getAll()
      .then(res => {
        if (!active) return;
        const items = res.data || [];
        setTechnologies(items);
        if (items.length) {
          setStopwatchTechnologyId(current => current ?? items[0].id);
          setCountdownTechnologyId(current => current ?? items[0].id);
          setCustomTechnologyId(current => current || String(items[0].id));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [setStopwatchTechnologyId, setCountdownTechnologyId]);

  useEffect(() => {
    if (!countdown.isIdle) return;
    const next = getDurationParts(countdown.totalSeconds);
    setHours(String(next.hours));
    setMinutes(String(next.minutes));
  }, [countdown.isIdle, countdown.totalSeconds]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_TIMERS_KEY, JSON.stringify(customTimers));
  }, [customTimers]);

  if (loading) return <LoadingSpinner />;

  const techOptions = technologies.map(t => ({ value: t.id, label: t.name }));
  const getEnteredDuration = () => getDurationSeconds(hours, minutes);
  const syncCountdownDuration = () => {
    const value = getEnteredDuration();
    if (value >= 60) countdown.setDuration(value);
    return value;
  };
  const startCountdown = () => countdown.start(syncCountdownDuration());
  const getTechnologyName = (technologyId) => (
    technologies.find(technology => String(technology.id) === String(technologyId))?.name || 'Technology'
  );

  const addCustomTimer = () => {
    const label = customLabel.trim();
    const totalSeconds = getDurationSeconds(customHours, customMinutes);
    const technologyId = parseInt(customTechnologyId, 10) || null;

    if (!label) {
      toast.warning('Add a label for this timer first');
      return;
    }
    if (totalSeconds < 60) {
      toast.warning('Custom timer must be at least 1 minute');
      return;
    }
    if (!technologyId) {
      toast.warning('Please select a technology for this timer');
      return;
    }

    setCustomTimers(current => [
      {
        id: `${Date.now()}`,
        label,
        totalSeconds,
        technologyId,
      },
      ...current,
    ]);
    setCustomLabel('');
    toast.success('Custom timer added');
  };

  const startCustomTimer = (timer) => {
    if (!countdown.isIdle) {
      toast.warning('Reset or finish the current timer first');
      return;
    }

    const note = `Custom timer: ${timer.label}`;
    countdown.start(timer.totalSeconds, {
      technologyId: timer.technologyId,
      note,
    });
  };

  const removeCustomTimer = (timerId) => {
    setCustomTimers(current => current.filter(timer => timer.id !== timerId));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="animate-fade-in text-center">
        <h1 className="text-2xl font-bold">Focus Clock</h1>
        <p className="text-text-muted text-sm mt-1">Set a study timer or track an open-ended session</p>
      </div>

      <div className="flex rounded-xl bg-surface-light border border-border p-1 gap-1" role="tablist" aria-label="Time tools">
        <button
          type="button"
          onClick={() => setMode('timer')}
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${mode === 'timer' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text hover:bg-surface-lighter'}`}
        >
          <HiOutlineBell size={18} /> Timer
        </button>
        <button
          type="button"
          onClick={() => setMode('stopwatch')}
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${mode === 'stopwatch' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text hover:bg-surface-lighter'}`}
        >
          <HiOutlineClock size={18} /> Stopwatch
        </button>
      </div>

      {mode === 'timer' ? (
        <Card className="animate-fade-in text-center py-10">
          <div className={`text-6xl sm:text-7xl font-mono font-bold tracking-wider mb-7 ${countdown.isRunning ? 'text-primary animate-pulse-glow' : 'text-text'}`}>
            {formatDuration(countdown.remainingSeconds)}
          </div>

          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            {countdown.isIdle && (
              <Button size="lg" onClick={startCountdown} className="min-w-[150px]">
                <HiOutlinePlay size={20} /> Start Timer
              </Button>
            )}
            {countdown.isRunning && (
              <>
                <Button size="lg" variant="outline" onClick={countdown.pause} className="min-w-[120px]">
                  <HiOutlinePause size={20} /> Pause
                </Button>
                <Button size="lg" variant="accent" onClick={countdown.stop} className="min-w-[150px]">
                  <HiOutlineStop size={20} /> Stop & Save
                </Button>
              </>
            )}
            {countdown.isPaused && (
              <>
                <Button size="lg" onClick={countdown.resume} className="min-w-[120px]">
                  <HiOutlinePlay size={20} /> Resume
                </Button>
                <Button size="lg" variant="accent" onClick={countdown.stop} className="min-w-[150px]">
                  <HiOutlineStop size={20} /> Save Time
                </Button>
              </>
            )}
            {!countdown.isIdle && (
              <Button size="lg" variant="ghost" onClick={countdown.reset} title="Reset timer">
                <HiOutlineRefresh size={20} />
              </Button>
            )}
          </div>

          <div className="max-w-sm mx-auto space-y-4 text-left">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Hours"
                type="number"
                min="0"
                inputMode="numeric"
                value={hours}
                onChange={e => setHours(e.target.value)}
                onBlur={syncCountdownDuration}
                disabled={!countdown.isIdle}
              />
              <Input
                label="Minutes"
                type="number"
                min="0"
                max="59"
                inputMode="numeric"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                onBlur={syncCountdownDuration}
                disabled={!countdown.isIdle}
              />
            </div>
            <p className="text-xs text-text-muted -mt-1">Set at least one minute. When it reaches zero, an alarm plays and the completed time is saved.</p>
            <Select
              label="Technology"
              options={[{ value: '', label: 'Select technology...' }, ...techOptions]}
              value={countdown.technologyId || ''}
              onChange={e => countdown.setTechnologyId(parseInt(e.target.value, 10) || null)}
              disabled={!countdown.isIdle}
            />
            <Textarea
              label="Note (optional)"
              placeholder="What will you focus on?"
              rows={3}
              value={countdown.note}
              onChange={e => countdown.setNote(e.target.value)}
              disabled={countdown.isRunning}
            />
          </div>

          <div className="mt-10 border-t border-border pt-6 text-left">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HiOutlineBookmark size={19} />
              </div>
              <div>
                <h2 className="text-base font-semibold">Custom timers</h2>
                <p className="text-xs text-text-muted">Save your own labeled timers for repeat study sessions.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_0.65fr_0.65fr_1fr_auto]">
              <Input
                label="Label"
                type="text"
                value={customLabel}
                onChange={e => setCustomLabel(e.target.value)}
                placeholder="React practice"
              />
              <Input
                label="Hours"
                type="number"
                min="0"
                inputMode="numeric"
                value={customHours}
                onChange={e => setCustomHours(e.target.value)}
              />
              <Input
                label="Minutes"
                type="number"
                min="0"
                max="59"
                inputMode="numeric"
                value={customMinutes}
                onChange={e => setCustomMinutes(e.target.value)}
              />
              <Select
                label="Technology"
                options={[{ value: '', label: 'Select technology...' }, ...techOptions]}
                value={customTechnologyId}
                onChange={e => setCustomTechnologyId(e.target.value)}
              />
              <div className="flex items-end">
                <Button onClick={addCustomTimer} className="w-full lg:w-auto">
                  <HiOutlinePlus size={18} /> Add
                </Button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {customTimers.length === 0 ? (
                <div className="md:col-span-2 rounded-lg border border-dashed border-border bg-surface-lighter/40 px-4 py-5 text-center text-sm text-text-muted">
                  No custom timers yet.
                </div>
              ) : customTimers.map(timer => (
                <div key={timer.id} className="rounded-lg border border-border bg-surface-lighter/40 p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-text">{timer.label}</p>
                      <p className="mt-1 text-xs text-text-muted">{getTechnologyName(timer.technologyId)}</p>
                    </div>
                    <div className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                      {formatDuration(timer.totalSeconds)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => startCustomTimer(timer)}
                      disabled={!countdown.isIdle}
                      className="flex-1"
                    >
                      <HiOutlinePlay size={16} /> Start
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCustomTimer(timer.id)}
                      title="Delete custom timer"
                    >
                      <HiOutlineTrash size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="animate-fade-in text-center py-10">
          <div className={`text-6xl sm:text-7xl font-mono font-bold tracking-wider mb-7 ${stopwatch.isRunning ? 'text-primary animate-pulse-glow' : 'text-text'}`}>
            {formatDuration(stopwatch.seconds)}
          </div>

          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            {stopwatch.isIdle && (
              <Button size="lg" onClick={stopwatch.start} className="min-w-[150px]">
                <HiOutlinePlay size={20} /> Start Stopwatch
              </Button>
            )}
            {stopwatch.isRunning && (
              <>
                <Button size="lg" variant="outline" onClick={stopwatch.pause} className="min-w-[120px]">
                  <HiOutlinePause size={20} /> Pause
                </Button>
                <Button size="lg" variant="accent" onClick={stopwatch.stop} className="min-w-[150px]">
                  <HiOutlineStop size={20} /> Stop & Save
                </Button>
              </>
            )}
            {stopwatch.isPaused && (
              <>
                <Button size="lg" onClick={stopwatch.resume} className="min-w-[120px]">
                  <HiOutlinePlay size={20} /> Resume
                </Button>
                <Button size="lg" variant="accent" onClick={stopwatch.stop} className="min-w-[150px]">
                  <HiOutlineStop size={20} /> Save Time
                </Button>
              </>
            )}
            {!stopwatch.isIdle && (
              <Button size="lg" variant="ghost" onClick={stopwatch.reset} title="Reset stopwatch">
                <HiOutlineRefresh size={20} />
              </Button>
            )}
          </div>

          <div className="max-w-sm mx-auto space-y-4 text-left">
            <Select
              label="Technology"
              options={[{ value: '', label: 'Select technology...' }, ...techOptions]}
              value={stopwatch.technologyId || ''}
              onChange={e => stopwatch.setTechnologyId(parseInt(e.target.value, 10) || null)}
              disabled={!stopwatch.isIdle}
            />
            <Textarea
              label="Note (optional)"
              placeholder="What did you learn today?"
              rows={3}
              value={stopwatch.note}
              onChange={e => stopwatch.setNote(e.target.value)}
              disabled={stopwatch.isRunning}
            />
          </div>
        </Card>
      )}

      <Card className="animate-fade-in">
        <h3 className="font-semibold mb-2 text-sm">Reliable background timing</h3>
        <p className="text-xs leading-5 text-text-muted">Both tools use real timestamps instead of relying on browser ticks, so their time stays correct when you switch tabs, minimize Chrome, or open another page in the app. The stopwatch has no time cap and can run continuously for 20 hours or longer.</p>
      </Card>
    </div>
  );
}
