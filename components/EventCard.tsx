'use client';

import { Event, Section } from '@/lib/types';

type Tag = 'LGBTQ+ Friendly' | 'BIPOC-Owned' | 'Women-Owned';

const TAG_STYLE: Record<Tag, { bg: string; color: string; border: string; icon: string }> = {
  'LGBTQ+ Friendly': { bg: '#faf5ff', color: '#a855f7', border: '#d8b4fe', icon: '🏳️‍🌈' },
  'BIPOC-Owned':     { bg: '#fef3c7', color: '#92400e', border: '#fbbf24', icon: '✊' },
  'Women-Owned':     { bg: '#fdf2f8', color: '#9d174d', border: '#f9a8d4', icon: '♀️' },
};
import { useLang } from '@/lib/LangContext';
import { AREA_COLORS } from './EventList';

interface Props {
  event: Event;
  section: Section;
}

const SECTION_BADGE: Record<Section, { label: string; color: string }> = {
  'Official Fan Zones':   { label: 'Official',    color: '#5D9741' },
  'Watch Parties & Bars': { label: 'Watch Party', color: '#3B82F6' },
  'Experiences & Events': { label: 'Experience',  color: '#F97316' },
};

function mapsUrl(venue: string, neighborhood: string, area: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, ${neighborhood}, ${area}, WA`)}`;
}

export default function EventCard({ event, section }: Props) {
  const { t } = useLang();
  const badge = SECTION_BADGE[section];

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <span className="text-lg leading-tight mt-0.5 shrink-0">{event.emoji}</span>
            <div className="min-w-0 w-full">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{event.name}</h3>
                {/* Section type badge */}
                <span
                  className="shrink-0 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${badge.color}18`, color: badge.color }}
                >
                  {badge.label}
                </span>
              </div>
              <a
                href={mapsUrl(event.venue, event.neighborhood, event.area)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 hover:text-avocado-700 hover:underline"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: AREA_COLORS[event.area] }}
                />
                {event.venue}
                {event.neighborhood ? ` · ${event.neighborhood}` : ''}
                {event.area ? ` · ${event.area}` : ''}
              </a>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5 text-xs text-gray-600">
                <span className={`font-medium ${event.cost === 'Free' || event.cost.startsWith('Free') ? 'text-avocado-700' : 'text-gray-700'}`}>
                  {event.cost === 'Free' ? t('free') : event.cost}
                </span>
                <span className="text-gray-300">·</span>
                <span>{event.dates}</span>
                {event.times && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span>{event.times}</span>
                  </>
                )}
              </div>
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {event.tags.map(tag => {
                    const s = TAG_STYLE[tag as Tag];
                    return (
                      <span key={tag}
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border leading-tight"
                        style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}>
                        {s.icon} {tag}
                      </span>
                    );
                  })}
                </div>
              )}
              {event.transit && (
                <p className="text-xs text-gray-400 mt-1">🚇 {event.transit}</p>
              )}
              {event.description && (
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{event.description}</p>
              )}
            </div>
          </div>
        </div>
        <a
          href={event.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-medium text-avocado-700 border border-avocado-600 rounded px-3 py-1.5 hover:bg-avocado-50 transition-colors whitespace-nowrap"
        >
          {event.ctaLabel} →
        </a>
      </div>
    </div>
  );
}
