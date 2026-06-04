import { Match } from '@/lib/types';

export const SEATTLE_MATCH_DAYS = ['Jun 15', 'Jun 19', 'Jun 24', 'Jun 26', 'Jul 1', 'Jul 6'];

export const matches: Match[] = [
  {
    id: 'jun15',
    dateKey: 'Jun 15',
    dateLabel: 'Sunday, June 15',
    teams: 'Belgium vs. Egypt',
    time: '12:00 PM PT',
    round: 'Group Stage',
    ticketUrl: 'https://www.lumenfield.com/fifa-world-cup/2026-fifa-world-cup-seattle',
  },
  {
    id: 'jun19',
    dateKey: 'Jun 19',
    dateLabel: 'Thursday, June 19',
    teams: 'USA vs. Australia',
    time: '12:00 PM PT',
    round: 'Group Stage',
    ticketUrl: 'https://www.lumenfield.com/fifa-world-cup/2026-fifa-world-cup-seattle',
  },
  {
    id: 'jun24',
    dateKey: 'Jun 24',
    dateLabel: 'Tuesday, June 24',
    teams: 'Qatar vs. Bosnia & Herzegovina',
    time: '12:00 PM PT',
    round: 'Group Stage',
    ticketUrl: 'https://www.lumenfield.com/fifa-world-cup/2026-fifa-world-cup-seattle',
  },
  {
    id: 'jun26',
    dateKey: 'Jun 26',
    dateLabel: 'Thursday, June 26',
    teams: 'Egypt vs. Iran',
    time: '8:00 PM PT',
    round: 'Group Stage',
    ticketUrl: 'https://www.lumenfield.com/fifa-world-cup/2026-fifa-world-cup-seattle',
  },
  {
    id: 'jul1',
    dateKey: 'Jul 1',
    dateLabel: 'Wednesday, July 1',
    teams: 'Round of 32',
    time: '1:00 PM PT',
    round: 'Round of 32',
    ticketUrl: 'https://www.lumenfield.com/fifa-world-cup/2026-fifa-world-cup-seattle',
  },
  {
    id: 'jul6',
    dateKey: 'Jul 6',
    dateLabel: 'Sunday, July 6',
    teams: 'Round of 16',
    time: '5:00 PM PT',
    round: 'Round of 16',
    ticketUrl: 'https://www.lumenfield.com/fifa-world-cup/2026-fifa-world-cup-seattle',
  },
];
