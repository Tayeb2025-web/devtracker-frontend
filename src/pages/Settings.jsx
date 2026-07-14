import { useCallback, useEffect, useState } from 'react';
import { goalApi, userApi } from '../services/api';
import { useToast } from '../contexts/ToastContextStore';
import { Button, Card, Input, LoadingSpinner, Select } from '../components/ui';

const NOTIFICATION_OPTIONS = [
  { value: 'true', label: 'Enabled' },
  { value: 'false', label: 'Disabled' },
];

export default function Settings() {
  const toast = useToast();
  const [form, setForm] = useState({
    display_name: '',
    email: '',
    notification_enabled: true,
    notification_time: '09:00',
  });
  const [dailyGoal, setDailyGoal] = useState('10');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, goalRes] = await Promise.all([userApi.getProfile(), goalApi.get()]);
      const profile = profileRes.data || {};
      setForm({
        display_name: profile.display_name || '',
        email: profile.email || '',
        notification_enabled: Boolean(profile.notification_enabled),
        notification_time: profile.notification_time?.slice(0, 5) || '09:00',
      });
      setDailyGoal(String(goalRes.data?.target_hours ?? 10));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const save = async () => {
    const targetHours = Number(dailyGoal);
    if (!Number.isFinite(targetHours) || targetHours < 0.5 || targetHours > 24) {
      toast.warning('Daily goal must be between 0.5 and 24 hours');
      return;
    }

    setSaving(true);
    try {
      await Promise.all([
        userApi.updateSettings({
          display_name: form.display_name.trim(),
          email: form.email.trim() || null,
          notification_enabled: form.notification_enabled,
          notification_time: form.notification_time,
        }),
        goalApi.update(targetHours),
      ]);
      toast.success('Settings saved');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-text-muted text-sm mt-1">Manage your profile, daily goal, and reminders</p>
      </div>

      <Card className="space-y-5">
        <h2 className="font-semibold">Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Display name"
            value={form.display_name}
            onChange={event => setForm(current => ({ ...current, display_name: event.target.value }))}
            maxLength={150}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
          />
        </div>
      </Card>

      <Card className="space-y-5">
        <h2 className="font-semibold">Study goal</h2>
        <Input
          label="Daily target (hours)"
          type="number"
          min="0.5"
          max="24"
          step="0.5"
          value={dailyGoal}
          onChange={event => setDailyGoal(event.target.value)}
        />
      </Card>

      <Card className="space-y-5">
        <h2 className="font-semibold">Notifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Daily reminder"
            options={NOTIFICATION_OPTIONS}
            value={String(form.notification_enabled)}
            onChange={event => setForm(current => ({ ...current, notification_enabled: event.target.value === 'true' }))}
          />
          <Input
            label="Reminder time"
            type="time"
            value={form.notification_time}
            disabled={!form.notification_enabled}
            onChange={event => setForm(current => ({ ...current, notification_time: event.target.value }))}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</Button>
      </div>
    </div>
  );
}
