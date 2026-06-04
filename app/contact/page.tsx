'use client';

import { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { events } from '@/data/events';
import { GLOBAL_SCHEDULE } from '@/data/schedule';

const VENUE_NAMES = Array.from(new Set(events.map(e => e.name))).sort((a, b) => a.localeCompare(b));

const ALL_NATIONS = Object.values(GLOBAL_SCHEDULE)
  .flat()
  .reduce<{ name: string; flag: string }[]>((acc, g) => {
    if (g.team1 !== 'TBD' && !acc.find(t => t.name === g.team1)) acc.push({ name: g.team1, flag: g.flag1 });
    if (g.team2 !== 'TBD' && !acc.find(t => t.name === g.team2)) acc.push({ name: g.team2, flag: g.flag2 });
    return acc;
  }, [])
  .sort((a, b) => a.name.localeCompare(b.name));

type Status = 'idle' | 'loading' | 'success' | 'error';

// ── Venue picker ──────────────────────────────────────────────────────────────
function VenuePicker({ defaultValue }: { defaultValue: string }) {
  const [query, setQuery]     = useState(defaultValue);
  const [selected, setSelected] = useState(defaultValue);
  const [open, setOpen]       = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => VENUE_NAMES.filter(v => v.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function pick(name: string) {
    setSelected(name);
    setQuery(name);
    setOpen(false);
  }

  function clear() {
    setSelected('');
    setQuery('');
  }

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name="venueName" value={selected} />
      {selected ? (
        <div className="flex items-center gap-2 px-3 py-2.5 border border-avocado-500 bg-avocado-50 rounded-lg">
          <span className="text-sm font-semibold text-avocado-800 flex-1">{selected}</span>
          <button type="button" onClick={clear} className="text-avocado-400 hover:text-avocado-700 text-lg leading-none">×</button>
        </div>
      ) : (
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search venues…"
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500"
        />
      )}
      {open && !selected && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {filtered.map(v => (
            <li key={v}>
              <button
                type="button"
                onMouseDown={() => pick(v)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-avocado-50 hover:text-avocado-800"
              >
                {v}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && !selected && query.length > 0 && filtered.length === 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow px-3 py-2 text-sm text-gray-400">
          No matching venues found.
        </div>
      )}
    </div>
  );
}

// ── Nation picker ─────────────────────────────────────────────────────────────
function NationPicker({ name, defaultValue, exclude, onChange }: {
  name: string;
  defaultValue: string;
  exclude?: string;
  onChange?: (val: string) => void;
}) {
  const [query, setQuery]       = useState(defaultValue);
  const [selected, setSelected] = useState(defaultValue);
  const [open, setOpen]         = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Auto-clear if excluded nation is currently selected
  useEffect(() => {
    if (exclude && selected === exclude) {
      setSelected('');
      setQuery('');
      onChange?.('');
    }
  }, [exclude, selected, onChange]);

  const filtered = useMemo(
    () => ALL_NATIONS.filter(n =>
      n.name !== exclude &&
      n.name.toLowerCase().includes(query.toLowerCase())
    ),
    [query, exclude],
  );

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function pick(n: { name: string; flag: string }) {
    setSelected(n.name);
    setQuery(n.name);
    setOpen(false);
    onChange?.(n.name);
  }

  function clear() {
    setSelected('');
    setQuery('');
    onChange?.('');
  }

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={selected} />
      {selected ? (
        <div className="flex items-center gap-2 px-3 py-2.5 border border-avocado-500 bg-avocado-50 rounded-lg">
          <span className="text-sm font-semibold text-avocado-800 flex-1">
            {ALL_NATIONS.find(n => n.name === selected)?.flag} {selected}
          </span>
          <button type="button" onClick={clear} className="text-avocado-400 hover:text-avocado-700 text-lg leading-none">×</button>
        </div>
      ) : (
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search nations…"
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500"
        />
      )}
      {open && !selected && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {filtered.map(n => (
            <li key={n.name}>
              <button
                type="button"
                onMouseDown={() => pick(n)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-avocado-50 hover:text-avocado-800"
              >
                {n.flag} {n.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && !selected && query.length > 0 && filtered.length === 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow px-3 py-2 text-sm text-gray-400">
          No matching nations found.
        </div>
      )}
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────
function ContactForm() {
  const params  = useSearchParams();
  const [status,        setStatus]        = useState<Status>('idle');
  const [message,       setMessage]       = useState('');
  const [incorrectNation, setIncorrectNation] = useState('');

  const defaultVenue = params.get('venue') ?? '';
  const defaultTeam  = params.get('team')  ?? '';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd   = new FormData(e.currentTarget);
    const body: Record<string, string> = {};
    fd.forEach((v, k) => { body[k] = v as string; });

    if (!body.venueName)     { setStatus('error'); setMessage('Please select a venue.');             return; }
    if (!body.incorrectTeam) { setStatus('error'); setMessage('Please select the incorrect nation.'); return; }
    if (!body.correctTeam)   { setStatus('error'); setMessage('Please select the correct nation.');  return; }

    setStatus('loading');
    try {
      const res  = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) { setStatus('success'); setMessage(data.message ?? 'Submitted!'); }
      else        { setStatus('error');   setMessage(data.error   ?? 'Something went wrong. Please try again.'); }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanks for the heads up!</h1>
        <p className="text-gray-500 text-sm max-w-sm">{message}</p>
        <Link href="/" className="mt-6 text-sm font-medium text-avocado-700 hover:underline">← Back to World Cup in SEA</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/" className="text-xs text-avocado-700 hover:underline">← Back to guide</Link>
        <h1 className="text-2xl font-black mt-2">Report an incorrect fan bar</h1>
        <p className="text-sm text-gray-500 mt-1">Think a nation association is wrong? Let us know and we'll review it.</p>
      </div>

      {status === 'error' && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Your name *</label>
          <input name="contactName" type="text" required maxLength={100} placeholder="Jane Smith"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Your email *</label>
          <input name="contactEmail" type="email" required maxLength={200} placeholder="you@example.com"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Venue / bar name *</label>
          <VenuePicker defaultValue={defaultVenue} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Nation listed as supported *</label>
          <NationPicker name="incorrectTeam" defaultValue={defaultTeam} onChange={setIncorrectNation} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Correct nation association *</label>
          <NationPicker name="correctTeam" defaultValue="" exclude={incorrectNation} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">How do you know? *</label>
          <textarea name="howYouKnow" required maxLength={500} rows={4}
            placeholder="e.g. I'm a regular — they only show Premier League and have no connection to Argentina."
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500 resize-none" />
          <p className="text-[11px] text-gray-400 mt-1">Max 500 characters</p>
        </div>

        <button type="submit" disabled={status === 'loading'}
          className="w-full bg-avocado-600 text-white font-bold py-3 rounded-lg hover:bg-avocado-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {status === 'loading' ? 'Sending…' : 'Submit correction →'}
        </button>
      </form>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactForm />
    </Suspense>
  );
}
