'use client';

import Link from 'next/link';
import { GLOBAL_SCHEDULE, CHAMPION, GlobalMatch } from '@/data/schedule';

const DAYS = Object.keys(GLOBAL_SCHEDULE);

// 1 = team1 won, 2 = team2 won, 0 = draw, null = not played
function winnerOf(g: GlobalMatch): 1 | 2 | 0 | null {
  if (g.score1 == null || g.score2 == null) return null;
  if (g.pens1 != null && g.pens2 != null) return g.pens1 > g.pens2 ? 1 : 2;
  if (g.score1 > g.score2) return 1;
  if (g.score1 < g.score2) return 2;
  return 0;
}

export default function SchedulePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-xs text-avocado-700 hover:underline">← Back to guide</Link>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-black">2026 FIFA World Cup Results</h1>
          <span className="text-[10px] font-black uppercase tracking-wide text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
            Complete
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Final scores · Seattle matches highlighted</p>
      </div>

      {/* ── Champion callout ─────────────────────────────────────── */}
      <div className="mb-8 rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white px-5 py-5 flex items-center gap-4">
        <span className="text-5xl leading-none">{CHAMPION.flag}</span>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">🏆 Champions</p>
          <p className="text-xl font-black text-gray-900 leading-tight">{CHAMPION.team}</p>
          <p className="text-xs font-semibold text-amber-700 mt-0.5">
            {CHAMPION.flag} {CHAMPION.team} {CHAMPION.score} {CHAMPION.runnerUp} {CHAMPION.runnerUpFlag}{CHAMPION.aet ? ' (a.e.t.)' : ''} · Final · {CHAMPION.finalDateLabel} · {CHAMPION.venue}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {DAYS.map(day => {
          const games = GLOBAL_SCHEDULE[day];
          const hasSeattle = games.some(g => g.isSeattle);
          const isFinal = games.some(g => g.final);
          const roundLabel = games[0]?.round;
          return (
            <div key={day}>
              <h2 className={`text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2 ${isFinal ? 'text-amber-600' : hasSeattle ? 'text-avocado-700' : 'text-gray-400'}`}>
                {isFinal && '🏆'} {day}
                {roundLabel && <span className="font-semibold text-gray-400 normal-case tracking-normal">{roundLabel}</span>}
                {hasSeattle && !isFinal && <span className="text-avocado-700">🏟️ Seattle</span>}
              </h2>
              <div className={`border rounded-xl overflow-hidden divide-y divide-gray-100 ${isFinal ? 'border-amber-300' : 'border-gray-200'}`}>
                {games.map(g => {
                  const w = winnerOf(g);
                  return (
                    <div
                      key={g.id}
                      className={`flex items-center justify-between px-4 py-3 gap-3 ${
                        g.final ? 'bg-amber-50 border-l-2 border-amber-400'
                          : g.isSeattle ? 'bg-avocado-50 border-l-2 border-avocado-500' : 'bg-white'
                      }`}
                    >
                      {/* Team 1 */}
                      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end text-right">
                        <span className={`text-sm truncate ${w === 1 ? 'font-black text-gray-900' : 'font-medium text-gray-500'}`}>
                          {g.team1 !== 'TBD' ? g.team1 : '—'}
                        </span>
                        <span className="text-xl shrink-0">{g.flag1}</span>
                      </div>
                      {/* Score */}
                      <div className="shrink-0 text-center px-1">
                        {g.score1 != null ? (
                          <div className="flex items-center gap-1.5 font-black text-gray-900 tabular-nums">
                            <span className={w === 1 ? '' : 'text-gray-400'}>{g.score1}</span>
                            <span className="text-gray-300 text-xs">–</span>
                            <span className={w === 2 ? '' : 'text-gray-400'}>{g.score2}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-avocado-600 font-semibold">vs</span>
                        )}
                        {g.pens1 != null && (
                          <p className="text-[9px] text-gray-400 leading-none mt-0.5">({g.pens1}–{g.pens2} pens)</p>
                        )}
                        {g.aet && g.pens1 == null && (
                          <p className="text-[9px] text-gray-400 leading-none mt-0.5">a.e.t.</p>
                        )}
                      </div>
                      {/* Team 2 */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xl shrink-0">{g.flag2}</span>
                        <span className={`text-sm truncate ${w === 2 ? 'font-black text-gray-900' : 'font-medium text-gray-500'}`}>
                          {g.team2 !== 'TBD' ? g.team2 : '—'}
                        </span>
                      </div>
                      {/* Meta */}
                      <div className="text-right shrink-0 w-20">
                        <p className="text-[11px] text-gray-400 leading-tight">FT</p>
                        <p className="text-[11px] text-gray-400 leading-tight">{g.city}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 text-center">
        <Link href="/" className="text-sm text-avocado-700 hover:underline font-medium">
          ← Find watch parties in Seattle
        </Link>
      </div>
    </div>
  );
}
