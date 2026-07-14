import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineTrash, HiOutlineDocumentText, HiOutlineSearch } from 'react-icons/hi';
import { sessionApi, technologyApi } from '../services/api';
import { useToast } from '../contexts/ToastContextStore';
import { Card, Button, Input, Select, ConfirmDialog, LoadingSpinner, EmptyState, Badge } from '../components/ui';
import { formatHours } from '../constants';

const FILTERS = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export default function History() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [sessions, setSessions] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [submittedSearch, setSubmittedSearch] = useState(searchParams.get('search') || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [sortBy, setSortBy] = useState('date-desc');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.filter = filter;
      if (techFilter) params.technologyId = techFilter;
      if (submittedSearch) params.search = submittedSearch;
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
        delete params.filter;
      }
      const [sessionsRes, techRes] = await Promise.all([
        sessionApi.getAll(params),
        technologyApi.getAll(),
      ]);
      setSessions(sessionsRes.data || []);
      setTechnologies(techRes.data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, techFilter, submittedSearch, startDate, endDate, toast]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearch(query);
    setSubmittedSearch(query);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedSearch(search.trim());
  };

  const handleDelete = async () => {
    try {
      await sessionApi.delete(deleteId);
      toast.success('Session deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const sorted = [...sessions].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.session_date) - new Date(a.session_date);
    if (sortBy === 'date-asc') return new Date(a.session_date) - new Date(b.session_date);
    if (sortBy === 'duration-desc') return parseFloat(b.duration_hours) - parseFloat(a.duration_hours);
    if (sortBy === 'duration-asc') return parseFloat(a.duration_hours) - parseFloat(b.duration_hours);
    return 0;
  });

  const techOptions = [{ value: '', label: 'All Technologies' }, ...technologies.map(t => ({ value: t.id, label: t.name }))];

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-text-muted text-sm mt-1">View and manage all study sessions</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Select label="Period" options={FILTERS} value={filter} onChange={e => { setFilter(e.target.value); setStartDate(''); setEndDate(''); }} />
          <Select label="Technology" options={techOptions} value={techFilter} onChange={e => setTechFilter(e.target.value)} />
          <Input label="From" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <Input label="To" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notes or technologies..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-lighter border border-border text-sm focus:outline-none focus:border-primary/50"
            />
          </div>
          <Select
            options={[
              { value: 'date-desc', label: 'Newest First' },
              { value: 'date-asc', label: 'Oldest First' },
              { value: 'duration-desc', label: 'Longest First' },
              { value: 'duration-asc', label: 'Shortest First' },
            ]}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </form>
      </Card>

      {loading ? <LoadingSpinner /> : sorted.length === 0 ? (
        <EmptyState icon={HiOutlineDocumentText} title="No sessions found" description="Start a timer to create your first study session" />
      ) : (
        <div className="space-y-3">
          {sorted.map(session => (
            <Card key={session.id} hover className="animate-fade-in !p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-10 rounded-full" style={{ backgroundColor: session.technology_color }} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{session.technology_name}</h3>
                      <Badge color="primary">{formatHours(parseFloat(session.duration_hours))}</Badge>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">
                      {session.session_date} · {session.start_time?.slice(0, 5)} - {session.end_time?.slice(0, 5)}
                    </p>
                    {session.note && <p className="text-xs text-text-muted mt-1 italic">"{session.note}"</p>}
                  </div>
                </div>
                <button
                  onClick={() => setDeleteId(session.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                >
                  <HiOutlineTrash size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Session"
        message="Are you sure you want to delete this study session?"
      />
    </div>
  );
}
