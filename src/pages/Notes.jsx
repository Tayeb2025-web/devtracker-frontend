import { useCallback, useEffect, useState } from 'react';
import { noteApi } from '../services/api';
import { formatLocalDate } from '../constants';
import { useToast } from '../contexts/ToastContextStore';
import { Button, Card, Input, LoadingSpinner, Select, Textarea } from '../components/ui';

const SCORE_OPTIONS = [
  { value: '', label: 'Not rated' },
  ...Array.from({ length: 10 }, (_, index) => ({
    value: String(index + 1),
    label: `${index + 1} / 10`,
  })),
];

export default function Notes() {
  const toast = useToast();
  const [date, setDate] = useState(formatLocalDate());
  const [content, setContent] = useState('');
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadNote = useCallback(async (selectedDate) => {
    setLoading(true);
    try {
      const res = await noteApi.getByDate(selectedDate);
      setContent(res.data?.content || '');
      setScore(res.data?.productivity_score ? String(res.data.productivity_score) : '');
    } catch (error) {
      toast.error(error.message);
      setContent('');
      setScore('');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadNote(date);
  }, [date, loadNote]);

  const save = async () => {
    setSaving(true);
    try {
      await noteApi.save(date, {
        content,
        productivity_score: score ? Number(score) : null,
      });
      toast.success('Note saved');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Daily Notes</h1>
        <p className="text-text-muted text-sm mt-1">Capture what you learned and how your day went</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Input label="Date" type="date" value={date} max={formatLocalDate()} onChange={event => setDate(event.target.value)} />
          <Select label="Productivity" options={SCORE_OPTIONS} value={score} onChange={event => setScore(event.target.value)} />
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="space-y-5">
            <Textarea
              label="Notes"
              rows={12}
              value={content}
              onChange={event => setContent(event.target.value)}
              placeholder="What did you learn? What went well? What will you improve tomorrow?"
            />
            <div className="flex justify-end">
              <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Note'}</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
