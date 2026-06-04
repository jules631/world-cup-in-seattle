import { Event } from '@/lib/types';

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <span className="text-lg leading-tight mt-0.5 shrink-0">{event.emoji}</span>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug">{event.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {event.venue}
                {event.neighborhood ? ` · ${event.neighborhood}` : ''}
                {event.area ? ` · ${event.area}` : ''}
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5 text-xs text-gray-600">
                <span
                  className={`font-medium ${
                    event.cost === 'Free' || event.cost.startsWith('Free')
                      ? 'text-avocado-700'
                      : 'text-gray-700'
                  }`}
                >
                  {event.cost}
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
