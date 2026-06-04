'use client';

import Link from 'next/link';
import { GLOBAL_SCHEDULE } from '@/data/schedule';

const DAYS = Object.keys(GLOBAL_SCHEDULE);

export default function SchedulePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-xs text-avocado-700 hover:underline">← Back to guide</Link>
        <h1 className="text-2xl font-black mt-2">2026 FIFA World Cup Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">All times Pacific · Seattle matches highlighted</p>
      </div>

      <div className="space-y-6">
        {DAYS.map(day => {
          const games = GLOBAL_SCHEDULE[day];
          const hasSeattle = games.some(g => g.isSeattle);
          return (
            <div key={day}>
              <h2 className={`text-xs font-bold uppercase tracking-widest mb-2 ${hasSeattle ? 'text-avocado-700' : 'text-gray-400'}`}>
                {day}{hasSeattle ? ' 🏟️ Seattle' : ''}
              </h2>
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                {games.map(g => (
                  <div
                    key={g.id}
                    className={`flex items-center justify-between px-4 py-3 gap-3 ${g.isSeattle ? 'bg-avocado-50 border-l-2 border-avocado-500' : 'bg-white'}`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xl shrink-0">{g.flag1}</span>
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {g.team1 !== 'TBD' ? g.team1 : '—'}
                      </span>
                      <span className="text-xs text-avocado-600 shrink-0">vs</span>
                      <span className="text-xl shrink-0">{g.flag2}</span>
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {g.team2 !== 'TBD' ? g.team2 : '—'}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-gray-800">{g.timePT} PT</p>
                      <p className="text-[11px] text-gray-400">{g.city}</p>
                    </div>
                  </div>
                ))}
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
