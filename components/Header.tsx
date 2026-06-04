'use client';

import { useLang } from '@/lib/LangContext';

export default function Header() {
  const { lang, setLang, t } = useLang();

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <a href="/" className="text-lg font-bold tracking-tight hover:opacity-80">
            <span className="text-gray-900">⚽ World Cup in </span><span className="text-avocado-600">SEA</span>
          </a>
          <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{t('tagline')}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/#schedule"
            className="text-xs text-avocado-700 hover:underline hidden sm:block"
          >
            🏟️ {t('lumenField')}
          </a>
          <div className="flex items-center border border-gray-200 rounded text-xs font-medium overflow-hidden">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 transition-colors ${
                lang === 'en' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('es')}
              className={`px-2.5 py-1 transition-colors ${
                lang === 'es' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              ES
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 pb-2 sm:hidden">
        <p className="text-xs text-gray-500">{t('tagline')}</p>
      </div>
    </header>
  );
}
