import { events } from "@/data/events";
import EventList from "@/components/EventList";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          World Cup in SEA
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          The complete guide to fan zones, watch parties, and experiences for
          the <strong>2026 FIFA World Cup</strong> in Seattle and surrounding
          areas.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>🏟️ Seattle hosts 6 matches at Lumen Field</span>
          <span>📅 Jun 15 – Jul 6, 2026</span>
          <span>
            🔗{" "}
            <a
              href="https://www.lumenfield.com/fifa-world-cup/2026-fifa-world-cup-seattle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-avocado-700 hover:underline"
            >
              Match schedule &amp; tickets
            </a>
          </span>
        </div>
      </div>

      {/* Event listing */}
      <EventList events={events} />
    </div>
  );
}
