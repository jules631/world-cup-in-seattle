'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { matches } from '@/data/matches';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initGoogleMaps: () => void;
  }
}

// Tournament day chips Jun 11 – Jul 7 (matching main calendar)
const DAY_ABBREVS = ['THU','FRI','SAT','SUN','MON','TUE','WED'] as const;
const TOURNAMENT_DAY_CHIPS = Array.from({ length: 27 }, (_, i) => {
  const isJuly = i >= 20;
  const dayNum = isJuly ? i - 19 : 11 + i;
  const month  = isJuly ? 'Jul' : 'Jun';
  return { key: `${month} ${dayNum}`, day: DAY_ABBREVS[i % 7], num: String(dayNum), isJuly };
});

const TEAM_ABBREV: Record<string, string> = {
  'Bosnia & Herzegovina': 'BIH',
  'USA':                  'USA',
  'Round of 32':          'R32',
  'Round of 16':          'R16',
  'TBD':                  'TBD',
};
function abbrev(team: string) {
  return TEAM_ABBREV[team] ?? team.slice(0, 3).toUpperCase();
}

const DIVERSITY_TAGS = [
  { value: 'LGBTQ+ Friendly', label: 'LGBTQ+ Friendly' },
  { value: 'Women-Owned',     label: 'Women-Owned' },
  { value: 'BIPOC-Owned',     label: 'BIPOC-Owned', note: 'Black, Indigenous, People of Color' },
] as const;

type Status = 'idle' | 'loading' | 'success' | 'error';

function fmt12(val: string): string {
  if (!val) return '';
  const [h, m] = val.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export default function SubmitPage() {
  const [status,        setStatus]        = useState<Status>('idle');
  const [message,       setMessage]       = useState('');
  const [timeMode,      setTimeMode]      = useState<'allday' | 'specific'>('allday');
  const [openTime,      setOpenTime]      = useState('');
  const [closeTime,     setCloseTime]     = useState('');
  const [matchMode,     setMatchMode]     = useState<'all' | 'specific'>('all');
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [dateMode,       setDateMode]       = useState<'full' | 'specific'>('full');
  const [selectedDates,  setSelectedDates]  = useState<string[]>([]);
  const [costMode,      setCostMode]      = useState<'free' | 'paid' | 'varies'>('free');
  const [costAmount,    setCostAmount]    = useState('');
  const [costVaries,    setCostVaries]    = useState('');
  const [selectedTags,  setSelectedTags]  = useState<string[]>([]);

  const addressDisplayRef = useRef<HTMLInputElement>(null);
  const addressRef        = useRef<HTMLInputElement>(null);
  const neighborhoodRef   = useRef<HTMLInputElement>(null);
  const areaRef           = useRef<HTMLInputElement>(null);
  const placeIdRef        = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return;

    window.initGoogleMaps = () => {
      if (!addressDisplayRef.current) return;
      const ac = new window.google.maps.places.Autocomplete(addressDisplayRef.current, {
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address', 'address_components', 'name', 'place_id'],
      });

      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        if (!place.formatted_address) return;
        if (addressRef.current)    addressRef.current.value    = place.formatted_address;
        if (placeIdRef.current)    placeIdRef.current.value    = place.place_id ?? '';

        const AREA_MAP: Record<string, string> = {
          Seattle: 'Seattle', Bellevue: 'Bellevue', Kirkland: 'Kirkland', Tacoma: 'Tacoma',
        };
        let neighborhood = '';
        let area = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (place.address_components ?? []).forEach((c: any) => {
          if (c.types.includes('neighborhood') || c.types.includes('sublocality_level_1')) {
            neighborhood = c.long_name;
          }
          if (c.types.includes('locality')) {
            area = AREA_MAP[c.long_name] ?? '';
            if (!neighborhood) neighborhood = c.long_name;
          }
        });
        if (neighborhoodRef.current) neighborhoodRef.current.value = neighborhood;
        if (areaRef.current)         areaRef.current.value         = area;
      });
    };

    if (!document.getElementById('google-maps-script')) {
      const s = document.createElement('script');
      s.id = 'google-maps-script';
      s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=initGoogleMaps`;
      s.async = true;
      document.head.appendChild(s);
    } else if (window.google) {
      window.initGoogleMaps();
    }
  }, []);

  function toggleGame(dateKey: string) {
    setSelectedGames(prev =>
      prev.includes(dateKey) ? prev.filter(d => d !== dateKey) : [...prev, dateKey]
    );
  }
  function toggleTag(val: string) {
    setSelectedTags(prev => prev.includes(val) ? prev.filter(t => t !== val) : [...prev, val]);
  }

  function buildTimes(): string {
    if (timeMode === 'allday') return 'All day';
    if (!openTime && !closeTime) return 'All day';
    return `${fmt12(openTime)}${closeTime ? ` – ${fmt12(closeTime)}` : ''}`;
  }
  function toggleDate(key: string) {
    setSelectedDates(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]);
  }
  function buildDates(): string {
    if (dateMode === 'full') return 'Full tournament · Jun 11 – Jul 19';
    return selectedDates.length > 0 ? selectedDates.join(', ') : 'Full tournament · Jun 11 – Jul 19';
  }
  function buildCost(): string {
    if (costMode === 'free')   return 'Free';
    if (costMode === 'paid')   return costAmount ? `$${costAmount} cover` : 'Paid';
    return costVaries || 'Varies';
  }
  function buildMatchDays(): string {
    if (matchMode === 'all') return 'All Seattle match days';
    if (selectedGames.length === 0) return 'All Seattle match days';
    return selectedGames.map(key => {
      const m = matches.find(m => m.dateKey === key);
      return m ? `${key} (${m.teams})` : key;
    }).join(', ');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (matchMode === 'specific' && selectedGames.length === 0) {
      setStatus('error');
      setMessage('Please select at least one game, or switch to "All Seattle matches".');
      return;
    }
    setStatus('loading');
    const fd = new FormData(e.currentTarget);
    const body: Record<string, string> = {};
    fd.forEach((v, k) => { body[k] = v as string; });
    // Override computed fields
    body.times     = buildTimes();
    body.dates     = buildDates();
    body.cost      = buildCost();
    body.matchDays = buildMatchDays();
    body.tags      = selectedTags.join(', ');
    if (!body.address && body.addressDisplay) body.address = body.addressDisplay;

    try {
      const res  = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) { setStatus('success'); setMessage(data.message ?? 'Submitted!'); }
      else        { setStatus('error');   setMessage(data.error   ?? 'Something went wrong.'); }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">⚽</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You're in the queue!</h1>
        <p className="text-gray-500 text-sm max-w-sm">{message}</p>
        <Link href="/" className="mt-6 text-sm font-medium text-avocado-700 hover:underline">← Back to World Cup in SEA</Link>
      </div>
    );
  }

  const toggleBtn = (active: boolean) =>
    `px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${
      active ? 'bg-avocado-600 text-white border-avocado-600' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
    }`;

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-avocado-700 hover:underline mb-6">
        ← Back to World Cup in SEA
      </Link>

      <div className="mb-2">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          <span className="text-gray-900">Add Your </span>
          <span className="text-avocado-600">Watch Party</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Get listed on worldcupinsea.com — free, reviewed within 24 hours.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Listings are free. We do not charge fees or take any proceeds from events listed here.
        </p>
      </div>

      {status === 'error' && (
        <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">

        {/* ── Venue name ── */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Venue / Event Name *</label>
          <input name="name" required maxLength={100} placeholder="e.g. Pike Brewing World Cup Watch Party"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
        </div>

        {/* ── Address (Google Maps autocomplete) ── */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Address *</label>
          <input ref={addressDisplayRef} name="addressDisplay" required maxLength={300}
            placeholder="Start typing an address or venue name…" autoComplete="off"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
          <input ref={addressRef}     type="hidden" name="address" />
          <input ref={neighborhoodRef} type="hidden" name="neighborhood" />
          <input ref={areaRef}        type="hidden" name="area" />
          <input ref={placeIdRef}     type="hidden" name="placeId" />
          <p className="text-[11px] text-gray-400 mt-1">Powered by Google Maps — select a result to auto-fill details.</p>
        </div>

        {/* ── Event type ── */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Event Type *</label>
          <select name="section" required
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500 bg-white">
            <option value="">Select type…</option>
            <option value="Watch Parties & Bars">Watch Party / Bar</option>
            <option value="Official Fan Zones">Official Fan Zone</option>
            <option value="Experiences & Events">Experience or Event</option>
          </select>
        </div>

        {/* ── Times ── */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Hours *</label>
          <div className="flex gap-2 mb-3">
            <button type="button" onClick={() => setTimeMode('allday')} className={toggleBtn(timeMode === 'allday')}>All day</button>
            <button type="button" onClick={() => setTimeMode('specific')} className={toggleBtn(timeMode === 'specific')}>Specific hours</button>
          </div>
          {timeMode === 'specific' && (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-[11px] text-gray-500 mb-1">Opens</label>
                <input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
              </div>
              <span className="text-gray-400 mt-5">–</span>
              <div className="flex-1">
                <label className="block text-[11px] text-gray-500 mb-1">Closes</label>
                <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
              </div>
            </div>
          )}
        </div>

        {/* ── Event Date(s) ── */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Event Date(s) *</label>
          <div className="flex gap-2 mb-3">
            <button type="button" onClick={() => setDateMode('full')} className={toggleBtn(dateMode === 'full')}>
              Full tournament
            </button>
            <button type="button" onClick={() => setDateMode('specific')} className={toggleBtn(dateMode === 'specific')}>
              Specific days
            </button>
          </div>
          {dateMode === 'full' && (
            <p className="text-xs text-gray-500">Open every day Jun 11 – Jul 19, 2026</p>
          )}
          {dateMode === 'specific' && (
            <>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {TOURNAMENT_DAY_CHIPS.map(d => {
                  const sel = selectedDates.includes(d.key);
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => toggleDate(d.key)}
                      className={`flex flex-col items-center px-2.5 py-1.5 rounded-lg border text-center transition-colors ${
                        sel
                          ? 'bg-avocado-600 text-white border-avocado-600'
                          : 'border-gray-200 text-gray-600 hover:border-avocado-500 bg-white'
                      }`}
                    >
                      <span className={`text-[9px] font-semibold leading-none ${sel ? 'opacity-75' : 'text-gray-400'}`}>{d.day}</span>
                      <span className="text-xs font-bold leading-tight mt-0.5">{d.num}</span>
                    </button>
                  );
                })}
              </div>
              {selectedDates.length === 0 && (
                <p className="text-xs text-red-500">Select at least one day.</p>
              )}
              {selectedDates.length > 0 && (
                <p className="text-xs text-avocado-700 font-medium">Selected: {selectedDates.join(', ')}</p>
              )}
            </>
          )}
        </div>

        {/* ── Cost ── */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Cost *</label>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button type="button" onClick={() => setCostMode('free')}   className={toggleBtn(costMode === 'free')}>Free</button>
            <button type="button" onClick={() => setCostMode('paid')}   className={toggleBtn(costMode === 'paid')}>Paid</button>
            <button type="button" onClick={() => setCostMode('varies')} className={toggleBtn(costMode === 'varies')}>Varies</button>
          </div>
          {costMode === 'paid' && (
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-semibold">$</span>
              <input type="number" min="0" max="500" value={costAmount} onChange={e => setCostAmount(e.target.value)}
                placeholder="15"
                className="w-32 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
              <span className="text-xs text-gray-500">per person</span>
            </div>
          )}
          {costMode === 'varies' && (
            <input type="text" value={costVaries} onChange={e => setCostVaries(e.target.value)}
              placeholder="e.g. Free entry, drinks required"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
          )}
        </div>

        {/* ── Website URL ── */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Website or Ticket URL *</label>
          <input name="ctaUrl" type="url" required placeholder="https://…"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
        </div>

        {/* ── Description ── */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Description <span className="font-normal text-gray-400">(optional, max 200 chars)</span>
          </label>
          <textarea name="description" maxLength={300} rows={3}
            placeholder="What makes your watch party worth going to?"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500 resize-none" />
        </div>

        {/* ── Which games (toggle + pill chips) ── */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Which games are you showing? *</label>
          <div className="flex gap-2 mb-3">
            <button type="button" onClick={() => setMatchMode('all')}      className={toggleBtn(matchMode === 'all')}>All Seattle matches</button>
            <button type="button" onClick={() => setMatchMode('specific')} className={toggleBtn(matchMode === 'specific')}>Specific games</button>
          </div>
          {matchMode === 'specific' && (
            <div className="flex flex-wrap gap-2">
              {matches.map(m => {
                const sel = selectedGames.includes(m.dateKey);
                return (
                  <button
                    key={m.dateKey}
                    type="button"
                    onClick={() => toggleGame(m.dateKey)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors text-left ${
                      sel ? 'bg-avocado-600 text-white border-avocado-600' : 'border-gray-200 text-gray-700 hover:border-avocado-600 bg-white'
                    }`}
                  >
                    <span className="block text-sm">
                      {m.flag1 || m.flag2
                        ? `${m.flag1} ${abbrev(m.team1)} vs ${m.flag2} ${abbrev(m.team2)}`
                        : m.teams}
                    </span>
                    <span className={`block text-[10px] mt-0.5 ${sel ? 'text-avocado-100' : 'text-gray-400'}`}>
                      {m.dateKey} · {m.time}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {matchMode === 'specific' && selectedGames.length === 0 && (
            <p className="text-xs text-red-500 mt-1">Select at least one game.</p>
          )}
        </div>

        {/* ── Diversity tags ── */}
        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            My venue is <span className="font-normal text-gray-400">(optional — check all that apply)</span>
          </label>
          <div className="space-y-2 mt-2">
            {DIVERSITY_TAGS.map(tag => (
              <label key={tag.value} className="flex items-start gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={selectedTags.includes(tag.value)} onChange={() => toggleTag(tag.value)}
                  className="accent-avocado-600 mt-0.5" />
                <span>
                  {tag.value}
                  {'note' in tag && <span className="text-xs text-gray-400 ml-1">({tag.note})</span>}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Contact ── */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
            <input name="contactName" required maxLength={100} placeholder="Jane Smith"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Email *</label>
            <input name="contactEmail" type="email" required placeholder="you@example.com"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
          </div>
        </div>

        {/* ── Disclaimers ── */}
        <div className="space-y-2 text-xs text-gray-400 border-t border-gray-100 pt-4">
          <p>
            By submitting, you agree that your contact email will be used solely to communicate about your listing.
            We do not sell, share, or store email addresses beyond this purpose. Your email will not appear publicly on the site.
          </p>
          <p>
            worldcupinsea.com is an independent community guide. We are not affiliated with FIFA, Lumen Field, or any listed venue.
            We do not receive proceeds, commissions, or compensation from any event or business listed on this site.
          </p>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-avocado-600 text-white font-bold py-3 rounded-lg hover:bg-avocado-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Submitting…' : 'Submit Watch Party →'}
        </button>
      </form>
    </div>
  );
}
