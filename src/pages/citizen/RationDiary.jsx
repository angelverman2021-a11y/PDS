import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { ArrowLeft, PlusCircle, CalendarDays, ClipboardList } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const DEFAULT_ENTRY = {
  date: new Date().toISOString().slice(0, 10),
  item: 'Rice',
  quantity: 0,
  shop: '',
  notes: '',
};

export default function RationDiary() {
  const { user } = useAuth();
  const storageKey = `rationDiary_${user?.id || 'guest'}`;

  const [entries, setEntries] = useState(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [entry, setEntry] = useState(DEFAULT_ENTRY);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries, storageKey]);

  const addEntry = (e) => {
    e.preventDefault();
    if (!entry.item.trim() || entry.quantity <= 0) return;
    setEntries(prev => [{ ...entry, id: Date.now().toString() }, ...prev]);
    setEntry({ ...DEFAULT_ENTRY, date: entry.date });
  };

  const removeEntry = (id) => {
    setEntries(prev => prev.filter(item => item.id !== id));
  };

  const summary = useMemo(() => ({
    totalEntries: entries.length,
    totalKg: entries.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
  }), [entries]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-green-700 text-white px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/dashboard" className="text-green-200 text-sm hover:text-white flex items-center gap-1">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Ration Diary</h1>
          <p className="text-green-200 text-sm mt-2 max-w-2xl">
            Track monthly ration collection, consumption and shop visits in one place. This diary is stored locally for your convenience.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6 grid gap-6 lg:grid-cols-[1.75fr_1fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">New diary entry</p>
              <h2 className="text-xl font-bold text-gray-900">Add consumption details</h2>
            </div>
            <PlusCircle size={24} className="text-green-600" />
          </div>

          <form onSubmit={addEntry} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-sm text-gray-700">
                Date
                <input
                  type="date"
                  value={entry.date}
                  onChange={e => setEntry(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </label>
              <label className="block text-sm text-gray-700">
                Item
                <input
                  type="text"
                  value={entry.item}
                  onChange={e => setEntry(prev => ({ ...prev, item: e.target.value }))}
                  placeholder="Rice, Wheat, Sugar"
                  className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-sm text-gray-700">
                Quantity (kg)
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={entry.quantity}
                  onChange={e => setEntry(prev => ({ ...prev, quantity: e.target.value }))}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </label>
              <label className="block text-sm text-gray-700">
                Shop visited
                <input
                  type="text"
                  value={entry.shop}
                  onChange={e => setEntry(prev => ({ ...prev, shop: e.target.value }))}
                  placeholder="Ram Ration Store"
                  className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </label>
            </div>

            <label className="block text-sm text-gray-700">
              Notes
              <textarea
                value={entry.notes}
                onChange={e => setEntry(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                placeholder="Any notes about availability, price, or household use."
                className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="flex-1" variant="primary">
                Save entry
              </Button>
              <button
                type="button"
                onClick={() => setEntry(DEFAULT_ENTRY)}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Reset form
              </button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Summary</p>
              <h2 className="text-xl font-bold text-gray-900">Diary overview</h2>
            </div>
            <CalendarDays size={24} className="text-green-600" />
          </div>

          <div className="grid gap-3">
            <div className="rounded-3xl bg-green-50 p-4">
              <p className="text-xs text-green-700 uppercase tracking-wide">Total entries</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{summary.totalEntries}</p>
            </div>
            <div className="rounded-3xl bg-blue-50 p-4">
              <p className="text-xs text-blue-700 uppercase tracking-wide">Total quantity logged</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{summary.totalKg} kg</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Diary entries</p>
              <h2 className="text-xl font-bold text-gray-900">Recorded consumption history</h2>
            </div>
            <ClipboardList size={20} className="text-gray-500" />
          </div>

          {entries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
              No diary entries yet. Add your first one above.
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map(item => (
                <div key={item.id} className="rounded-3xl bg-white border border-gray-200 p-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.item} · {item.quantity} kg</p>
                      <p className="text-xs text-gray-500">{item.date} · {item.shop || 'Shop not specified'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEntry(item.id)}
                      className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>
                  {item.notes && <p className="mt-3 text-sm text-gray-600">{item.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
