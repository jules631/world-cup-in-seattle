'use client';

import { useState, useMemo, useEffect } from 'react';
import { Event, Area, Section, AREAS, SECTIONS } from '@/lib/types';
import { useLang } from '@/lib/LangContext';
import { matches } from '@/data/matches';
import { GLOBAL_SCHEDULE } from '@/data/schedule';
import EventCard from './EventCard';

interface Props {
  events: Event[];
}

const SECTION_KEYS: Record<Section, string> = {
  'Official Fan Zones': 'officialFanZones',
  'Watch Parties & Bars': 'watchPartiesBars',
  'Experiences & Events': 'experiencesEvents',
};

// Location colors — Seattle = Sounders Rave Green, others distinct
export const AREA_COLORS: Record<Area, string> = {
  Seattle:  '#5D9741',
  Bellevue: '#3B82F6',
  Kirkland: '#F97316',
  Tacoma:   '#8B5CF6',
};

// All 27 tournament days Jun 11 – Jul 7 (Jun 11 = Thursday, index 4 in SUN..SAT)
const ALL_DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'] as const;
const TOURNAMENT_DAYS = Array.from({ length: 27 }, (_, i) => {
  // Jun 11 + i days; Jun has 30 days so Jun 11+19=Jun 30, Jun 11+20=Jul 1
  const isJuly  = i >= 20;
  const dayNum  = isJuly ? i - 19 : 11 + i;
  const month   = isJuly ? 'Jul' : 'Jun';
  return {
    key:   `${month} ${dayNum}`,
    day:   ALL_DAYS[(4 + i) % 7],   // Jun 11 = Thu = index 4
    num:   String(dayNum),
    isJuly,
  };
});

const MATCH_DAY_KEYS = new Set(matches.map(m => m.dateKey));

// Team → match day(s) mapping — built from ALL global matches (all 48 teams)
const GLOBAL_TEAM_DAYS: Record<string, string[]> = {};
Object.values(GLOBAL_SCHEDULE).forEach(dayMatches => {
  dayMatches.forEach(m => {
    [m.team1, m.team2].forEach(team => {
      if (team && team !== 'TBD') {
        if (!GLOBAL_TEAM_DAYS[team]) GLOBAL_TEAM_DAYS[team] = [];
        if (!GLOBAL_TEAM_DAYS[team].includes(m.dateKey)) {
          GLOBAL_TEAM_DAYS[team].push(m.dateKey);
        }
      }
    });
  });
});
const ALL_TEAMS = Object.keys(GLOBAL_TEAM_DAYS).sort();

const TEAM_FLAGS: Record<string, string> = {
  'Algeria':                '🇩🇿',
  'Argentina':              '🇦🇷',
  'Australia':              '🇦🇺',
  'Austria':                '🇦🇹',
  'Belgium':                '🇧🇪',
  'Bosnia & Herzegovina':   '🇧🇦',
  'Brazil':                 '🇧🇷',
  'Canada':                 '🇨🇦',
  'Cape Verde':             '🇨🇻',
  'Colombia':               '🇨🇴',
  'Croatia':                '🇭🇷',
  'Curaçao':                '🇨🇼',
  'Czechia':                '🇨🇿',
  'DR Congo':               '🇨🇩',
  'Ecuador':                '🇪🇨',
  'Egypt':                  '🇪🇬',
  'England':                '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'France':                 '🇫🇷',
  'Germany':                '🇩🇪',
  'Ghana':                  '🇬🇭',
  'Haiti':                  '🇭🇹',
  'Iran':                   '🇮🇷',
  'Iraq':                   '🇮🇶',
  'Ivory Coast':            '🇨🇮',
  'Japan':                  '🇯🇵',
  'Jordan':                 '🇯🇴',
  'Mexico':                 '🇲🇽',
  'Morocco':                '🇲🇦',
  'Netherlands':            '🇳🇱',
  'New Zealand':            '🇳🇿',
  'Norway':                 '🇳🇴',
  'Panama':                 '🇵🇦',
  'Paraguay':               '🇵🇾',
  'Portugal':               '🇵🇹',
  'Qatar':                  '🇶🇦',
  'Saudi Arabia':           '🇸🇦',
  'Scotland':               '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Senegal':                '🇸🇳',
  'South Africa':           '🇿🇦',
  'South Korea':            '🇰🇷',
  'Spain':                  '🇪🇸',
  'Sweden':                 '🇸🇪',
  'Switzerland':            '🇨🇭',
  'Tunisia':                '🇹🇳',
  'Turkey':                 '🇹🇷',
  'Uruguay':                '🇺🇾',
  'USA':                    '🇺🇸',
  'Uzbekistan':             '🇺🇿',
};

export default function EventList({ events }: Props) {
  const { t } = useLang();

  const [search,       setSearch]       = useState('');
  const [area,         setArea]         = useState<Area | 'All'>('All');
  const [matchDay,     setMatchDay]     = useState<string | 'All'>('All');
  const [teamFilter,   setTeamFilter]   = useState('');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [watchOpen,    setWatchOpen]    = useState(false);
  const [collapsed,    setCollapsed]    = useState<Record<Section, boolean>>({
    'Official Fan Zones':   true,
    'Watch Parties & Bars': true,
    'Experiences & Events': true,
  });

  // Open schedule + scroll if URL hash is #schedule
  useEffect(() => {
    if (window.location.hash === '#schedule') {
      setScheduleOpen(true);
      setTimeout(() => {
        document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  // Effective days from either day-chip or team filter (uses all 48 global teams)
  const effectiveDays = useMemo(() => {
    if (teamFilter && GLOBAL_TEAM_DAYS[teamFilter]) return GLOBAL_TEAM_DAYS[teamFilter];
    if (matchDay !== 'All') return [matchDay];
    return [];
  }, [teamFilter, matchDay]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return events.filter(e => {
      const matchesArea = area === 'All' || e.area === area;
      const matchesDay  =
        effectiveDays.length === 0 ||
        e.matchDays === 'all' ||
        (Array.isArray(e.matchDays) && effectiveDays.some(d => (e.matchDays as string[]).includes(d)));
      const matchesSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.neighborhood.toLowerCase().includes(q) ||
        (e.description?.toLowerCase().includes(q) ?? false) ||
        e.area.toLowerCase().includes(q);
      return matchesArea && matchesDay && matchesSearch;
    });
  }, [events, search, area, effectiveDays]);

  const grouped = useMemo(() => {
    const map: Record<Section, Event[]> = {
      'Official Fan Zones':   [],
      'Watch Parties & Bars': [],
      'Experiences & Events': [],
    };
    filtered.forEach(e => map[e.section].push(e));
    return map;
  }, [filtered]);

  // Area event counts for the summary dots
  const areaCounts = useMemo(() =>
    Object.fromEntries(AREAS.map(a => [a, filtered.filter(e => e.area === a).length])),
  [filtered]);

  const hasFilters   = search !== '' || area !== 'All' || matchDay !== 'All' || teamFilter !== '';
  const selectedMatch = matchDay !== 'All' ? matches.find(m => m.dateKey === matchDay) : null;

  function selectDay(key: string | 'All') {
    setMatchDay(key);
    setTeamFilter('');
  }
  function selectTeam(team: string) {
    setTeamFilter(team);
    setMatchDay('All');
  }
  function clearAll() {
    setSearch(''); setArea('All'); setMatchDay('All'); setTeamFilter('');
  }
  function toggleSection(s: Section) {
    setCollapsed(prev => ({ ...prev, [s]: !prev[s] }));
  }

  return (
    <div>

      {/* ── 1. DATE STRIP — all 22 tournament days ─────────────────── */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {t('matchDay')}
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {/* ALL chip */}
          <button
            onClick={() => selectDay('All')}
            className={`shrink-0 flex flex-col items-center justify-center px-2.5 py-2 min-w-[44px] rounded-lg border text-center transition-colors ${
              matchDay === 'All' && !teamFilter
                ? 'bg-gray-900 text-white border-gray-900'
                : 'border-gray-200 text-gray-500 hover:border-gray-400 bg-white'
            }`}
          >
            <span className="text-[9px] font-semibold leading-none tracking-wide">ALL</span>
            <span className="text-xs font-bold leading-tight mt-0.5">—</span>
          </button>

          {/* One chip per tournament day */}
          {TOURNAMENT_DAYS.map(d => {
            const isMatchDay = MATCH_DAY_KEYS.has(d.key);
            const isSelected = matchDay === d.key && !teamFilter;
            return (
              <button
                key={d.key}
                onClick={() => selectDay(d.key)}
                className={`shrink-0 relative flex flex-col items-center justify-center px-2.5 py-2 min-w-[44px] rounded-lg border transition-colors ${
                  isSelected
                    ? 'bg-avocado-600 text-white border-avocado-600'
                    : isMatchDay
                      ? 'border-avocado-600 text-gray-900 bg-white hover:bg-avocado-50'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
                }`}
              >
                <span className={`text-[9px] font-semibold leading-none tracking-wide ${isSelected ? 'opacity-75' : isMatchDay ? 'text-avocado-700' : 'text-gray-400'}`}>
                  {d.day}
                </span>
                <span className="text-xs font-bold leading-tight mt-0.5">{d.num}</span>
                {isMatchDay && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-avocado-600" />
                )}
              </button>
            );
          })}
        </div>

        {selectedMatch && (
          <p className="mt-2 text-xs text-avocado-700 font-medium">
            {t('showingEventsFor')} {selectedMatch.dateLabel} — {selectedMatch.teams} · {selectedMatch.time}
          </p>
        )}
        {teamFilter && (
          <p className="mt-2 text-xs text-avocado-700 font-medium">
            {TEAM_FLAGS[teamFilter]} {teamFilter} — {
              (GLOBAL_TEAM_DAYS[teamFilter] ?? []).map((d: string) => {
                const m = matches.find(m => m.dateKey === d);
                return m ? `${d} (${m.time} PT)` : d;
              }).join(' · ')
            }
          </p>
        )}
      </div>

      {/* ── 2. TEAM FILTER ─────────────────────────────────────────── */}
      <div className="mb-5">
        <div className="relative">
          <select
            value={teamFilter}
            onChange={e => e.target.value ? selectTeam(e.target.value) : (setTeamFilter(''), setMatchDay('All'))}
            className="w-full appearance-none pl-4 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-avocado-500 focus:border-transparent cursor-pointer"
          >
            <option value="">Filter by team…</option>
            {ALL_TEAMS.map(team => (
              <option key={team} value={team}>
                {TEAM_FLAGS[team] ?? ''} {team}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
        </div>
      </div>

      {/* ── 3. TODAY'S MATCHES — clean NYC style ───────────────────── */}
      {(matchDay !== 'All' || teamFilter !== '') && (() => {
        const days = effectiveDays.length > 0 ? effectiveDays : [];
        const dayGames = days.flatMap(d => GLOBAL_SCHEDULE[d] ?? []);
        if (dayGames.length === 0) return null;

        const label = days.length === 1
          ? `${dayGames.length} ${dayGames.length === 1 ? 'match' : 'matches'} on ${days[0]}`
          : `${dayGames.length} matches`;

        return (
          <div className="mb-5 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-gray-200">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
              <div className="flex items-center gap-1">
                {AREAS.map(a => (
                  <span key={a} className={`w-2 h-2 rounded-full transition-opacity ${filtered.some(e => e.area === a) ? 'opacity-100' : 'opacity-20'}`}
                    style={{ backgroundColor: AREA_COLORS[a] }} title={a} />
                ))}
              </div>
            </div>

            {/* Match rows — clean, minimal */}
            <div className="divide-y divide-gray-100 bg-white">
              {dayGames.map(game => (
                <div key={game.id}
                  className={`flex items-center px-4 py-3 gap-4 ${game.isSeattle ? 'border-l-2 border-avocado-600' : ''}`}
                >
                  {/* Teams */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xl shrink-0">{game.flag1}</span>
                    <span className="text-sm font-bold text-gray-900 truncate">{game.team1 !== 'TBD' ? game.team1 : '—'}</span>
                    <span className="text-xs text-gray-300 shrink-0 font-medium">vs</span>
                    <span className="text-xl shrink-0">{game.flag2}</span>
                    <span className="text-sm font-bold text-gray-900 truncate">{game.team2 !== 'TBD' ? game.team2 : '—'}</span>
                  </div>
                  {/* Time + city */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{game.timePT} PT</p>
                    <p className="text-[11px] text-gray-400 leading-tight">{game.city}</p>
                  </div>
                  {game.isSeattle && (
                    <span className="shrink-0 text-[9px] font-black text-avocado-700 bg-avocado-100 px-1.5 py-0.5 rounded uppercase tracking-wide">SEA</span>
                  )}
                </div>
              ))}
            </div>

            {/* no inline panel — moved to dedicated section below */}
          </div>
        );
      })()}

      {/* ── 3b. WHERE TO WATCH IN SEATTLE (collapsible) ────────────── */}
      {(matchDay !== 'All' || teamFilter !== '') && (() => {
        const days = effectiveDays.length > 0 ? effectiveDays : [];
        const hasAnyEvents = filtered.some(e => e.section === 'Watch Parties & Bars' || e.section === 'Official Fan Zones');
        if (!hasAnyEvents) return null;

        const seaGame = days.flatMap(d => GLOBAL_SCHEDULE[d] ?? []).find(g => g.isSeattle) ?? null;
        const generalBars = grouped['Watch Parties & Bars'].filter(e => !e.supportedTeams || e.supportedTeams.length === 0);
        const team1Bars = seaGame ? filtered.filter(e => e.supportedTeams?.includes(seaGame.team1)) : [];
        const team2Bars = seaGame ? filtered.filter(e => e.supportedTeams?.includes(seaGame.team2)) : [];

        return (
          <div className="mb-5 border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setWatchOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors group"
            >
              <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                📍 Where to watch in Seattle
                <span className="font-normal text-gray-400 text-xs">
                  {filtered.filter(e => e.section !== 'Experiences & Events').length} venues
                </span>
              </span>
              <span className="text-gray-400 text-xs group-hover:text-gray-700 transition-colors">
                {watchOpen ? '▼' : '▶'}
              </span>
            </button>

            {watchOpen && (
              <div className="bg-white">
                {/* Team columns for Seattle match days */}
                {seaGame && (
                  <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
                    {[
                      { team: seaGame.team1, flag: seaGame.flag1, bars: team1Bars },
                      { team: seaGame.team2, flag: seaGame.flag2, bars: team2Bars },
                    ].map(col => (
                      <div key={col.team} className="p-4">
                        <p className="text-[11px] font-black uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
                          {col.flag && <span>{col.flag}</span>} {col.team !== 'TBD' ? col.team : 'Team TBD'}
                        </p>
                        {/* Always show where the game is played */}
                        <p className="text-[11px] text-gray-400 mb-2">
                          🏟️ {seaGame.venue} · {seaGame.timePT} PT
                        </p>
                        {col.bars.length > 0 ? (
                          <ul className="space-y-2">
                            {col.bars.map(e => (
                              <li key={e.id} className="flex items-start gap-1.5">
                                <span className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: AREA_COLORS[e.area] }} />
                                <div className="min-w-0">
                                  <a href={e.ctaUrl} target="_blank" rel="noopener noreferrer"
                                    className="text-xs font-semibold text-gray-900 hover:text-avocado-700 hover:underline leading-tight block">
                                    {e.name}
                                  </a>
                                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: AREA_COLORS[e.area] }}>
                                    {e.neighborhood}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-gray-400 italic">See "All fans welcome" below</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Non-Seattle day: show where the games are being played */}
                {!seaGame && days.length > 0 && (() => {
                  const todayGames = days.flatMap(d => GLOBAL_SCHEDULE[d] ?? []);
                  return todayGames.length > 0 ? (
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-[11px] font-semibold text-gray-500 mb-1">Today's games are not in Seattle</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        {todayGames.map(g => (
                          <span key={g.id} className="text-xs text-gray-500">
                            {g.flag1}{g.flag2 ? ` vs ${g.flag2}` : ''} · {g.city} · {g.timePT} PT
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* All fans welcome */}
                {generalBars.length > 0 && (
                  <div className="px-4 py-3">
                    <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">All fans welcome</p>
                    <div className="space-y-2">
                      {generalBars.slice(0, 8).map(e => (
                        <div key={e.id} className="flex items-start gap-1.5">
                          <span className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: AREA_COLORS[e.area] }} />
                          <div className="min-w-0">
                            <a href={e.ctaUrl} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-semibold text-gray-900 hover:text-avocado-700 hover:underline leading-tight block">
                              {e.name}
                            </a>
                            <p className="text-[10px] text-gray-400">{e.neighborhood} · {e.area}</p>
                          </div>
                        </div>
                      ))}
                      {generalBars.length > 8 && (
                        <p className="text-xs text-gray-400">+{generalBars.length - 8} more — expand sections below</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── 4. LUMEN FIELD MATCH SCHEDULE ──────────────────────────── */}
      <div id="schedule" className="mb-5 border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setScheduleOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors group"
        >
          <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
            🏟️ Lumen Field Match Schedule
            <span className="font-normal text-gray-400 text-xs">6 matches</span>
          </span>
          <span className="text-gray-400 text-xs group-hover:text-gray-700 transition-colors">
            {scheduleOpen ? '▼' : '▶'}
          </span>
        </button>

        {scheduleOpen && (
          <div className="divide-y divide-gray-100">
            {matches.map(m => (
              <div
                key={m.id}
                className={`flex items-center justify-between px-4 py-3 gap-4 cursor-pointer hover:bg-gray-50 transition-colors ${matchDay === m.dateKey ? 'bg-avocado-50' : ''}`}
                onClick={() => selectDay(matchDay === m.dateKey ? 'All' : m.dateKey)}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {m.flag1 && <span>{m.flag1}</span>}
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{m.teams}</p>
                    {m.flag2 && <span>{m.flag2}</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{m.dateLabel} · {m.time} · {m.round}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                  <a href={`https://www.stubhub.com/search?q=FIFA+World+Cup+2026+Seattle+${encodeURIComponent(m.teams)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[10px] font-semibold text-gray-500 border border-gray-200 rounded px-2 py-1 hover:border-gray-400 transition-colors whitespace-nowrap">
                    StubHub
                  </a>
                  <a href={`https://gametime.co/search?q=FIFA+World+Cup+2026+Seattle`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[10px] font-semibold text-gray-500 border border-gray-200 rounded px-2 py-1 hover:border-gray-400 transition-colors whitespace-nowrap">
                    Gametime
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 5. SEARCH ───────────────────────────────────────────────── */}
      <div className="mb-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* ── 6. LOCATION FILTER + LEGEND + EVENT COUNT ───────────────── */}
      <div className="mb-6">
        {/* Header row: label + legend + count */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('location')}</span>
          {AREAS.map(a => (
            <span key={a} className="flex items-center gap-1 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: AREA_COLORS[a] }} />
              {a}
              {areaCounts[a] > 0 && <span className="text-gray-400">({areaCounts[a]})</span>}
            </span>
          ))}
          <span className="ml-auto text-xs font-semibold text-gray-500">
            {filtered.length} {t('events')}
          </span>
        </div>
        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setArea('All')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              area === 'All' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {t('all')}
          </button>
          {AREAS.map(a => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                area === a ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: AREA_COLORS[a] }} />
              {a}
            </button>
          ))}
          {hasFilters && (
            <button onClick={clearAll} className="px-3 py-1.5 text-xs font-medium text-red-600 hover:underline">
              {t('clearFilters')}
            </button>
          )}
        </div>
      </div>

      {/* ── 7. EVENT SECTIONS ──────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">{t('noEventsMatch')}</p>
      ) : (
        <div className="space-y-8">
          {SECTIONS.map(section => {
            const sectionEvents = grouped[section];
            if (sectionEvents.length === 0) return null;
            const isCollapsed = collapsed[section];
            return (
              <div key={section}>
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full flex items-center justify-between py-2 border-b-2 border-gray-900 mb-1 group"
                >
                  <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-avocado-600 shrink-0" />
                    {t(SECTION_KEYS[section])}{' '}
                    <span className="font-normal text-gray-500">{sectionEvents.length} {t('events')}</span>
                  </span>
                  <span className="text-gray-400 text-xs group-hover:text-gray-700 transition-colors">
                    {isCollapsed ? '▶' : '▼'}
                  </span>
                </button>
                {!isCollapsed && (
                  <div>
                    {sectionEvents.map(event => (
                      <EventCard key={event.id} event={event} section={section} />
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
