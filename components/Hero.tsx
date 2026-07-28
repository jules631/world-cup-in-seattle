'use client';

import { useLang } from '@/lib/LangContext';
import { CHAMPION } from '@/data/schedule';

export default function Hero() {
  const { t } = useLang();

  return (
    <div className="mb-8 pb-8 border-b border-gray-100 text-center">
      {/* ── CHAMPION BANNER — the tournament is over ──────────────── */}
      <div className="mb-7 rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white px-5 pt-5 pb-6 shadow-sm">
        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] text-amber-600">
          🏆 {t('championKicker')}
        </p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="text-5xl sm:text-6xl leading-none drop-shadow-sm">{CHAMPION.flag}</span>
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
            {t('championName')}
          </span>
        </div>
        <p className="mt-3 text-xs sm:text-sm font-semibold text-amber-700">{t('championSub')}</p>
        <a
          href="/schedule"
          className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-700 border border-amber-300 rounded-full px-3.5 py-1.5 hover:bg-amber-100 transition-colors"
        >
          {t('finalResults')} →
        </a>
      </div>

      {/* ── SITE IDENTITY ────────────────────────────────────────── */}
      <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tight leading-none">
        <span className="text-gray-900">World Cup </span>
        <span className="text-avocado-600">in SEA</span>
      </h1>
      <p className="mt-3 text-sm text-gray-600 font-medium">{t('tournamentOver')}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-400">
        <span className="inline-flex items-center gap-1 font-semibold text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          {t('complete')} · 2026
        </span>
        <span>·</span>
        <span>Jun 11 to Jul 19, 2026</span>
        <span>·</span>
        <a
          href="https://www.lumenfield.com/fifa-world-cup/2026-fifa-world-cup-seattle"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-avocado-700 hover:underline"
        >
          🏟️ {t('heroVenue')}
        </a>
      </div>
    </div>
  );
}
