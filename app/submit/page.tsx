'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initGoogleMaps: () => void;
  }
}

const MATCH_DAYS = [
  { key: 'Jun 15', label: 'Mon Jun 15 — Belgium vs. Egypt' },
  { key: 'Jun 19', label: 'Fri Jun 19 — USA vs. Australia' },
  { key: 'Jun 24', label: 'Wed Jun 24 — Qatar vs. Bosnia & Herzegovina' },
  { key: 'Jun 26', label: 'Fri Jun 26 — Egypt vs. Iran' },
  { key: 'Jul 1',  label: 'Wed Jul 1 — Round of 32' },
  { key: 'Jul 6',  label: 'Mon Jul 6 — Round of 16' },
];

const DIVERSITY_TAGS = ['LGBTQ+ Friendly', 'BIPOC-Owned', 'Women-Owned'] as const;

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function SubmitPage() {
  const [status,       setStatus]       = useState<Status>('idle');
  const [message,      setMessage]      = useState('');
  const [allDays,      setAllDays]      = useState(true);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const addressRef     = useRef<HTMLInputElement>(null);
  const neighborhoodRef = useRef<HTMLInputElement>(null);
  const areaRef        = useRef<HTMLInputElement>(null);
  const addressDisplayRef = useRef<HTMLInputElement>(null);

  // Load Google Maps Places Autocomplete
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return;

    window.initGoogleMaps = () => {
      if (!addressDisplayRef.current) return;
      const ac = new window.google.maps.places.Autocomplete(addressDisplayRef.current, {
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address', 'address_components', 'name'],
      });

      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        if (!place.formatted_address) return;

        // Fill hidden address input
        if (addressRef.current) addressRef.current.value = place.formatted_address;

        // Extract neighborhood and area from components
        let neighborhood = '';
        let area = '';
        const AREA_MAP: Record<string, string> = {
          'Seattle': 'Seattle', 'Bellevue': 'Bellevue',
          'Kirkland': 'Kirkland', 'Tacoma': 'Tacoma',
        };

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
        if (areaRef.current) areaRef.current.value = area;
      });
    };

    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      document.head.appendChild(script);
    } else if (window.google) {
      window.initGoogleMaps();
    }
  }, []);

  function toggleDay(key: string) {
    setSelectedDays(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]);
  }
  function toggleTag(tag: string) {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const fd = new FormData(e.currentTarget);
    const body: Record<string, string> = {};
    fd.forEach((v, k) => { body[k] = v as string; });
    body.matchDays = allDays ? 'All Seattle match days' : selectedDays.join(', ');
    body.tags = selectedTags.join(', ');
    // Use the hidden address if autocomplete ran, otherwise use display value
    if (!body.address && body.addressDisplay) body.address = body.addressDisplay;

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) {
        setStatus('success');
        setMessage(data.message ?? 'Submitted successfully!');
      } else {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong. Please try again.');
      }
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
        <Link href="/" className="mt-6 text-sm font-medium text-avocado-700 hover:underline">← Back to the guide</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">

      {/* Back nav — prominent */}
      <Link href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-avocado-700 hover:underline mb-6">
        ← Back to World Cup in SEA
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          <span className="text-gray-900">Add Your </span>
          <span className="text-avocado-600">Watch Party</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Hosting a World Cup watch party or fan event? Get listed on worldcupinsea.com — free, reviewed within 24 hours.
        </p>
      </div>

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Venue name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Venue / Event Name *</label>
          <input name="name" required maxLength={100} placeholder="e.g. Pike Brewing World Cup Watch Party"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
        </div>

        {/* Address — Google Maps autocomplete */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Address *</label>
          <input
            ref={addressDisplayRef}
            name="addressDisplay"
            required
            maxLength={300}
            placeholder="Start typing an address or venue name…"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500"
            autoComplete="off"
          />
          {/* Hidden fields populated by autocomplete */}
          <input ref={addressRef} type="hidden" name="address" />
          <input ref={neighborhoodRef} type="hidden" name="neighborhood" />
          <input ref={areaRef} type="hidden" name="area" />
          <p className="text-[11px] text-gray-400 mt-1">Powered by Google Maps — select a result to auto-fill location details.</p>
        </div>

        {/* Event type */}
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

        {/* Dates + Times */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Dates *</label>
            <input name="dates" required maxLength={100} placeholder="e.g. Jun 15 – Jul 6"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Times <span className="font-normal text-gray-400">(optional)</span></label>
            <input name="times" maxLength={100} placeholder="e.g. 11am – close"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
          </div>
        </div>

        {/* Cost */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Cost *</label>
          <input name="cost" required maxLength={100} placeholder='e.g. "Free" or "$10 cover"'
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
        </div>

        {/* Website URL */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Website or Ticket URL *</label>
          <input name="ctaUrl" type="url" required placeholder="https://…"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Description <span className="font-normal text-gray-400">(optional, max 200 chars)</span>
          </label>
          <textarea name="description" maxLength={300} rows={3}
            placeholder="What makes your watch party worth going to?"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500 resize-none" />
        </div>

        {/* Match days */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Which Seattle Match Days? *</label>
          <label className="flex items-center gap-2 text-sm cursor-pointer mb-2">
            <input type="checkbox" checked={allDays} onChange={e => setAllDays(e.target.checked)}
              className="accent-avocado-600" />
            <span className="font-medium">All 6 Seattle match days</span>
          </label>
          {!allDays && (
            <div className="space-y-1.5 ml-1">
              {MATCH_DAYS.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={selectedDays.includes(key)} onChange={() => toggleDay(key)}
                    className="accent-avocado-600" />
                  {label}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Diversity self-identification */}
        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            My venue is <span className="font-normal text-gray-400">(optional — check all that apply)</span>
          </label>
          <div className="space-y-1.5 mt-2">
            {DIVERSITY_TAGS.map(tag => (
              <label key={tag} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={selectedTags.includes(tag)} onChange={() => toggleTag(tag)}
                  className="accent-avocado-600" />
                {tag}
              </label>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name <span className="font-normal text-gray-400">(optional)</span></label>
            <input name="contactName" maxLength={100} placeholder="Jane Smith"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Email *</label>
            <input name="contactEmail" type="email" required placeholder="you@example.com"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500" />
          </div>
        </div>

        <p className="text-xs text-gray-400">Your email is never published. We'll confirm when your event is approved.</p>

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
