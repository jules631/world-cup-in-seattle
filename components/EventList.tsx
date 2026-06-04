'use client';

import { useState, useMemo } from 'react';
import { Event, Area, Section, AREAS, SECTIONS } from '@/lib/types';
import { useLang } from '@/lib/LangContext';
import { matches } from '@/data/matches';
import EventCard from './EventCard';

interface Props {
  events: Event[];
}

export default function EventList({ events }: Props) {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [area, setArea] = useState<Area | 'All'>('All');
  const [matchDay, setMatchDay] = useState<string | 'All'>('All');
  const [collapsed, setCollapsed] = useState<Record<Section, boolean>>({
    'Official Fan Zones': false,
    'Watch Parties & Bars': false,
    'Experiences & Events': false,
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return events.filter((e) => {
      const matchesArea = area === 'All' || e.area === area;
      const matchesDay =
        matchDay === 'All' ||
        e.matchDays === 'all' ||
        (Array.isArray(e.matchDays) && e.matchDays.includes(matchDay));
      const matchesSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.neighborhood.toLowerCase().includes(q) ||
        (e.description?.toLowerCase().includes(q) ?? false) ||
        e.area.toLowerCase().includes(q);
      return matchesArea && matchesDay && matchesSearch;
    });
  }, [events, search, area, matchDay]);

  const grouped = useMemo(() => {
    const map: Record<Section, Event[]> = {
      'Official Fan Zones': [],
      'Watch Parties & Bars': [],
      'Experiences & Events': [],
    };
    filtered.forEach((e) => map[e.section].push(e));
    return map;
  }, [filtered]);

  const hasFilters = search !== '' || area !== 'All' || matchDay !== 'All';
  const selectedMatch = matchDay !== 'All' ? matches.find((m) => m.dateKey === matchDay) : null;

  function toggleSection(section: Section) {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  return (
    <div>
      {/* Match day filter */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Match Day
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
          <button
            onClick={() => setMatchDay('All')}
            className={`shrink-0 snap-start px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              matchDay === 'All'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            All days
          </button>
          {matches.map((m) => (
            <button
              key={m.dateKey}
              onClick={() => setMatchDay(m.dateKey)}
              className={`shrink-0 snap-start flex flex-col items-start px-3 py-2 text-left rounded-lg border transition-colors ${
                matchDay === m.dateKey
                  ? 'bg-avocado-700 text-white border-avocado-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
              }`}
            >
              <span className="text-xs font-semibold leading-tight">{m.dateKey}</span>
              <span className={`text-xs leading-tight mt-0.5 ${matchDay === m.dateKey ? 'text-avocado-100' : 'text-gray-400'}`}>
                {m.teams}
              </span>
              <span className={`text-xs leading-tight ${matchDay === m.dateKey ? 'text-avocado-200' : 'text-gray-400'}`}>
                {m.time} · {m.round}
              </span>
            </button>
          ))}
        </div>
        {selectedMatch && (
          <p className="mt-2 text-xs text-avocado-700 font-medium">
            Showing events for {selectedMatch.dateLabel} — {selectedMatch.teams}
          </p>
        )}
      </div>

      {/* Search + area filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(['All', ...AREAS] as const).map((a) => (
            <button
              key={a}
              onClick={() => setArea(a as Area | 'All')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                area === a
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {a === 'All' ? t('all') : a}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={() => {
                setSearch('');
                setArea('All');
                setMatchDay('All');
              }}
              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:underline"
            >
              {t('clearFilters')}
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No events match your search.</p>
      ) : (
        <div className="space-y-8">
          {SECTIONS.map((section) => {
            const sectionEvents = grouped[section];
            if (sectionEvents.length === 0) return null;
            const isCollapsed = collapsed[section];

            return (
              <div key={section}>
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full flex items-center justify-between py-2 border-b-2 border-gray-900 mb-1 group"
                >
                  <span className="font-bold text-sm text-gray-900">
                    {section}{' '}
                    <span className="font-normal text-gray-500">
                      {sectionEvents.length} {t('events')}
                    </span>
                  </span>
                  <span className="text-gray-400 text-xs group-hover:text-gray-700 transition-colors">
                    {isCollapsed ? '▶' : '▼'}
                  </span>
                </button>

                {!isCollapsed && (
                  <div>
                    {sectionEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
