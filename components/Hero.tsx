'use client';

import { useLang } from '@/lib/LangContext';

export default function Hero() {
  const { t } = useLang();

  return (
    <div className="mb-8 pb-8 border-b border-gray-100 text-center">
      <h1 className="text-6xl sm:text-7xl font-black uppercase tracking-tight leading-none">
        <span className="text-gray-900">World Cup </span>
        <span className="text-avocado-600">in SEA</span>
      </h1>
      <p className="mt-3 text-sm text-gray-500">{t('heroSubtitle')}</p>
      <p className="mt-1 text-sm text-gray-500">{t('heroTagline')}</p>
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
        <a
          href="https://www.lumenfield.com/fifa-world-cup/2026-fifa-world-cup-seattle"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-avocado-700 hover:underline"
        >
          🏟️ {t('heroVenue')}
        </a>
        <span>·</span>
        <a href="mailto:hello@worldcupinsea.com" className="hover:text-avocado-700 hover:underline">
          ✉️ hello@worldcupinsea.com
        </a>
      </div>
    </div>
  );
}
