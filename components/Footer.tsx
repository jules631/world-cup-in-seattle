'use client';

import Link from 'next/link';
import { useLang } from '@/lib/LangContext';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-700">⚽ World Cup in SEA</span>
          <span className="text-xs">The unofficial guide to the 2026 FIFA World Cup in Seattle.</span>
          <span className="text-xs">
            Seattle hosts 6 matches at Lumen Field · Jun 15 – Jul 6, 2026
          </span>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <Link href="/submit" className="hover:text-avocado-700 hover:underline">
            + {t('submitEvent')}
          </Link>
          <a href="mailto:hello@worldcupinsea.com" className="hover:text-avocado-700 hover:underline">
            ✉️ {t('contactUs')} · hello@worldcupinsea.com
          </a>
          <a
            href="https://www.lumenfield.com/fifa-world-cup/2026-fifa-world-cup-seattle"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-avocado-700 hover:underline"
          >
            🏟️ {t('matchSchedule')}
          </a>
        </div>
      </div>
    </footer>
  );
}
