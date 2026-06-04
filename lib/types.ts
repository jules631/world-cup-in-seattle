export type Area = 'Seattle' | 'Bellevue' | 'Kirkland' | 'Tacoma';
export type Section = 'Official Fan Zones' | 'Watch Parties & Bars' | 'Experiences & Events';

export interface Match {
  id: string;
  dateKey: string;     // 'Jun 15' — used to link events to match days
  dateLabel: string;   // 'Sunday, June 15'
  teams: string;       // 'Belgium vs. Egypt'
  time: string;        // '12:00 PM PT'
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
  },
  es: {
    tagline: 'Tu guía para la Copa del Mundo en Seattle',
    searchPlaceholder: 'Buscar eventos, lugares…',
    filterLabel: 'Filtrar por área',
    all: 'Todos',
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
  },
};
