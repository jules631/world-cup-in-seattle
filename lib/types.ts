export type Area = 'Seattle' | 'Bellevue' | 'Kirkland' | 'Tacoma';
export type Section = 'Official Fan Zones' | 'Watch Parties & Bars' | 'Experiences & Events';

export interface Match {
  id: string;
  dateKey: string;    // 'Jun 15'
  dateLabel: string;  // 'Monday, June 15'
  teams: string;      // 'Belgium vs. Egypt'
  team1: string;
  flag1: string;
  team2: string;
  flag2: string;
  time: string;       // '12:00 PM PT'
  round: string;
  ticketUrl: string;
}

export interface Event {
  id: string;
  emoji: string;
  name: string;
  venue: string;
  neighborhood: string;
  area: Area;
  cost: string;
  dates: string;
  times?: string;
  transit?: string;
  description?: string;
  ctaLabel: string;
  ctaUrl: string;
  section: Section;
  /** Match days this event is open/relevant for. 'all' = every Seattle match day. */
  matchDays: string[] | 'all';
  /** National teams whose fan communities gather here. */
  supportedTeams?: string[];
  /** Confirmed identity tags — never assumed. */
  tags?: ('LGBTQ+ Friendly' | 'BIPOC-Owned' | 'Women-Owned')[];
}

export const SECTIONS: Section[] = [
  'Official Fan Zones',
  'Watch Parties & Bars',
  'Experiences & Events',
];

export const AREAS: Area[] = ['Seattle', 'Bellevue', 'Kirkland', 'Tacoma'];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    tagline: 'Your guide to the World Cup in Seattle',
    searchPlaceholder: 'Search events, venues…',
    filterLabel: 'Filter by area',
    all: 'All',
    allDays: 'All days',
    clearFilters: 'Clear filters',
    free: 'Free',
    ticketed: 'Ticketed',
    getTickets: 'Get tickets',
    learnMore: 'Learn more',
    events: 'events',
    submitEvent: 'Submit your event',
    contactUs: 'Contact us',
    matchSchedule: 'Match schedule',
    lumenField: 'Lumen Field',
    seattleMatches: 'Seattle hosts 6 matches at Lumen Field · Jun 15 – Jul 6',
    matchDay: 'Match Day',
    location: 'Location',
    showingEventsFor: 'Showing events for',
    noEventsMatch: 'No events match your search.',
    officialFanZones: 'Official Fan Zones',
    watchPartiesBars: 'Watch Parties & Bars',
    experiencesEvents: 'Experiences & Events',
    heroSubtitle: 'Your guide to the World Cup in Seattle.',
    heroTagline: 'Find where fans of your team are gathering.',
    heroVenue: 'Lumen Field · 6 matches',
  },
  es: {
    tagline: 'Tu guía para la Copa del Mundo en Seattle',
    searchPlaceholder: 'Buscar eventos, lugares…',
    filterLabel: 'Filtrar por área',
    all: 'Todos',
    allDays: 'Todos los días',
    clearFilters: 'Limpiar filtros',
    free: 'Gratis',
    ticketed: 'Con entrada',
    getTickets: 'Comprar entradas',
    learnMore: 'Más información',
    events: 'eventos',
    submitEvent: 'Envía tu evento',
    contactUs: 'Contáctanos',
    matchSchedule: 'Calendario de partidos',
    lumenField: 'Lumen Field',
    seattleMatches: 'Seattle acoge 6 partidos en Lumen Field · 15 jun – 6 jul',
    matchDay: 'Día de partido',
    location: 'Ubicación',
    showingEventsFor: 'Mostrando eventos para',
    noEventsMatch: 'No hay eventos que coincidan con tu búsqueda.',
    officialFanZones: 'Zonas de fans oficiales',
    watchPartiesBars: 'Bares y watch parties',
    experiencesEvents: 'Experiencias y eventos',
    heroSubtitle: 'Tu guía para la Copa del Mundo en Seattle.',
    heroTagline: 'Encuentra dónde se reúnen los fans de tu equipo.',
    heroVenue: 'Lumen Field · 6 partidos',
  },
};
