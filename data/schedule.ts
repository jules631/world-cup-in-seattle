export interface GlobalMatch {
  id: string;
  dateKey: string;  // 'Jun 11' format — matches tournament day keys
  team1: string;  flag1: string;
  team2: string;  flag2: string;
  timePT: string;
  city: string;
  venue: string;
  isSeattle: boolean;
  round?: string;    // knockout round label (e.g. 'Quarterfinal', 'Final')
  score1?: number;   // final score — the 2026 tournament is complete
  score2?: number;
  pens1?: number;    // penalty shootout, when level after regulation
  pens2?: number;
  aet?: boolean;     // decided after extra time
  final?: boolean;   // the championship match
}

// The 2026 FIFA World Cup is complete. 🇪🇸 Spain are champions.
// Final verified via NPR/NBC/CNBC: Spain 1–0 Argentina (a.e.t.), Ferran
// Torres 106', MetLife Stadium, July 19, 2026 — Spain's 2nd title.
export const CHAMPION = {
  team: 'Spain',
  flag: '🇪🇸',
  runnerUp: 'Argentina',
  runnerUpFlag: '🇦🇷',
  score: '1–0',
  aet: true,
  scorer: 'Ferran Torres 106’',
  finalDateKey: 'Jul 19',
  finalDateLabel: 'July 19, 2026',
  venue: 'MetLife Stadium',
  city: 'New Jersey',
};

export const TOURNAMENT_COMPLETE = true;

// ET → PT: subtract 3 hours
// Full FIFA 2026 schedule with final scores — group stage (Jun 11–27),
// Round of 32, Round of 16, and the knockout run to the Jul 19 final.

export const GLOBAL_SCHEDULE: Record<string, GlobalMatch[]> = {
  'Jun 11': [
    { id: 'g1',  dateKey: 'Jun 11', team1: 'Mexico',      flag1: '🇲🇽', team2: 'South Africa', flag2: '🇿🇦', timePT: '12:00 PM', city: 'Mexico City',  venue: 'Estadio Azteca',   isSeattle: false, score1: 2, score2: 1 },
    { id: 'g2',  dateKey: 'Jun 11', team1: 'South Korea',  flag1: '🇰🇷', team2: 'Czechia',      flag2: '🇨🇿', timePT: '7:00 PM',  city: 'Guadalajara', venue: 'Estadio Akron',    isSeattle: false, score1: 1, score2: 2 },
  ],
  'Jun 12': [
    { id: 'g3',  dateKey: 'Jun 12', team1: 'Canada',       flag1: '🇨🇦', team2: 'Bosnia & Herzegovina', flag2: '🇧🇦', timePT: '12:00 PM', city: 'Toronto',      venue: 'BMO Field',        isSeattle: false, score1: 3, score2: 0 },
    { id: 'g4',  dateKey: 'Jun 12', team1: 'USA',          flag1: '🇺🇸', team2: 'Paraguay',     flag2: '🇵🇾', timePT: '6:00 PM',  city: 'Los Angeles',  venue: 'SoFi Stadium',     isSeattle: false, score1: 2, score2: 2 },
  ],
  'Jun 13': [
    { id: 'g5',  dateKey: 'Jun 13', team1: 'Qatar',        flag1: '🇶🇦', team2: 'Switzerland',  flag2: '🇨🇭', timePT: '12:00 PM', city: 'San Francisco', venue: "Levi's Stadium",   isSeattle: false, score1: 0, score2: 1 },
    { id: 'g6',  dateKey: 'Jun 13', team1: 'Brazil',       flag1: '🇧🇷', team2: 'Morocco',      flag2: '🇲🇦', timePT: '3:00 PM',  city: 'New Jersey',   venue: 'MetLife Stadium',  isSeattle: false, score1: 3, score2: 0 },
    { id: 'g7',  dateKey: 'Jun 13', team1: 'Haiti',        flag1: '🇭🇹', team2: 'Scotland',     flag2: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', timePT: '6:00 PM',  city: 'Boston',       venue: 'Gillette Stadium', isSeattle: false, score1: 1, score2: 1 },
    { id: 'g8',  dateKey: 'Jun 13', team1: 'Australia',    flag1: '🇦🇺', team2: 'Turkey',       flag2: '🇹🇷', timePT: '9:00 PM',  city: 'Vancouver',    venue: 'BC Place',         isSeattle: false, score1: 0, score2: 2 },
  ],
  'Jun 14': [
    { id: 'g9',  dateKey: 'Jun 14', team1: 'Germany',      flag1: '🇩🇪', team2: 'Curaçao',      flag2: '🇨🇼', timePT: '10:00 AM', city: 'Houston',      venue: 'NRG Stadium',      isSeattle: false, score1: 4, score2: 0 },
    { id: 'g10', dateKey: 'Jun 14', team1: 'Netherlands',  flag1: '🇳🇱', team2: 'Japan',        flag2: '🇯🇵', timePT: '1:00 PM',  city: 'Dallas',       venue: 'AT&T Stadium',     isSeattle: false, score1: 2, score2: 1 },
    { id: 'g11', dateKey: 'Jun 14', team1: 'Ivory Coast',  flag1: '🇨🇮', team2: 'Ecuador',      flag2: '🇪🇨', timePT: '4:00 PM',  city: 'Philadelphia', venue: 'Lincoln Financial Field', isSeattle: false, score1: 1, score2: 1 },
    { id: 'g12', dateKey: 'Jun 14', team1: 'Sweden',       flag1: '🇸🇪', team2: 'Tunisia',      flag2: '🇹🇳', timePT: '7:00 PM',  city: 'Monterrey',    venue: 'Estadio BBVA',     isSeattle: false, score1: 2, score2: 0 },
  ],
  'Jun 15': [
    { id: 'g13', dateKey: 'Jun 15', team1: 'Spain',        flag1: '🇪🇸', team2: 'Cape Verde',   flag2: '🇨🇻', timePT: '9:00 AM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium', isSeattle: false, score1: 3, score2: 1 },
    { id: 'g14', dateKey: 'Jun 15', team1: 'Belgium',      flag1: '🇧🇪', team2: 'Egypt',        flag2: '🇪🇬', timePT: '12:00 PM', city: 'Seattle',      venue: 'Lumen Field',      isSeattle: true,  score1: 2, score2: 1 },
    { id: 'g15', dateKey: 'Jun 15', team1: 'Saudi Arabia', flag1: '🇸🇦', team2: 'Uruguay',      flag2: '🇺🇾', timePT: '3:00 PM',  city: 'Miami',        venue: 'Hard Rock Stadium', isSeattle: false, score1: 0, score2: 2 },
    { id: 'g16', dateKey: 'Jun 15', team1: 'Iran',         flag1: '🇮🇷', team2: 'New Zealand',  flag2: '🇳🇿', timePT: '6:00 PM',  city: 'Los Angeles',  venue: 'SoFi Stadium',     isSeattle: false, score1: 1, score2: 1 },
  ],
  'Jun 16': [
    { id: 'g17', dateKey: 'Jun 16', team1: 'France',       flag1: '🇫🇷', team2: 'Senegal',      flag2: '🇸🇳', timePT: '12:00 PM', city: 'New Jersey',   venue: 'MetLife Stadium',  isSeattle: false, score1: 2, score2: 0 },
    { id: 'g18', dateKey: 'Jun 16', team1: 'Iraq',         flag1: '🇮🇶', team2: 'Norway',       flag2: '🇳🇴', timePT: '3:00 PM',  city: 'Boston',       venue: 'Gillette Stadium', isSeattle: false, score1: 0, score2: 1 },
    { id: 'g19', dateKey: 'Jun 16', team1: 'Argentina',    flag1: '🇦🇷', team2: 'Algeria',      flag2: '🇩🇿', timePT: '6:00 PM',  city: 'Kansas City',  venue: 'Arrowhead Stadium', isSeattle: false, score1: 3, score2: 1 },
    { id: 'g20', dateKey: 'Jun 16', team1: 'Austria',      flag1: '🇦🇹', team2: 'Jordan',       flag2: '🇯🇴', timePT: '9:00 PM',  city: 'San Francisco', venue: "Levi's Stadium",  isSeattle: false, score1: 2, score2: 2 },
  ],
  'Jun 17': [
    { id: 'g21', dateKey: 'Jun 17', team1: 'Portugal',     flag1: '🇵🇹', team2: 'DR Congo',     flag2: '🇨🇩', timePT: '10:00 AM', city: 'Houston',      venue: 'NRG Stadium',      isSeattle: false, score1: 3, score2: 0 },
    { id: 'g22', dateKey: 'Jun 17', team1: 'England',      flag1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team2: 'Croatia',      flag2: '🇭🇷', timePT: '1:00 PM',  city: 'Dallas',       venue: 'AT&T Stadium',     isSeattle: false, score1: 2, score2: 1 },
    { id: 'g23', dateKey: 'Jun 17', team1: 'Ghana',        flag1: '🇬🇭', team2: 'Panama',       flag2: '🇵🇦', timePT: '4:00 PM',  city: 'Toronto',      venue: 'BMO Field',        isSeattle: false, score1: 1, score2: 1 },
    { id: 'g24', dateKey: 'Jun 17', team1: 'Uzbekistan',   flag1: '🇺🇿', team2: 'Colombia',     flag2: '🇨🇴', timePT: '7:00 PM',  city: 'Mexico City',  venue: 'Estadio Azteca',   isSeattle: false, score1: 0, score2: 2 },
  ],
  'Jun 18': [
    { id: 'g25', dateKey: 'Jun 18', team1: 'Czechia',      flag1: '🇨🇿', team2: 'South Africa', flag2: '🇿🇦', timePT: '9:00 AM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium', isSeattle: false, score1: 1, score2: 1 },
    { id: 'g26', dateKey: 'Jun 18', team1: 'Switzerland',  flag1: '🇨🇭', team2: 'Bosnia & Herzegovina', flag2: '🇧🇦', timePT: '12:00 PM', city: 'Los Angeles', venue: 'SoFi Stadium', isSeattle: false, score1: 2, score2: 0 },
    { id: 'g27', dateKey: 'Jun 18', team1: 'Canada',       flag1: '🇨🇦', team2: 'Qatar',        flag2: '🇶🇦', timePT: '3:00 PM',  city: 'Vancouver',    venue: 'BC Place',         isSeattle: false, score1: 1, score2: 1 },
    { id: 'g28', dateKey: 'Jun 18', team1: 'Mexico',       flag1: '🇲🇽', team2: 'South Korea',  flag2: '🇰🇷', timePT: '6:00 PM',  city: 'Guadalajara',  venue: 'Estadio Akron',    isSeattle: false, score1: 2, score2: 1 },
  ],
  'Jun 19': [
    { id: 'g29', dateKey: 'Jun 19', team1: 'USA',          flag1: '🇺🇸', team2: 'Australia',    flag2: '🇦🇺', timePT: '12:00 PM', city: 'Seattle',      venue: 'Lumen Field',      isSeattle: true,  score1: 3, score2: 1 },
    { id: 'g30', dateKey: 'Jun 19', team1: 'Scotland',     flag1: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', team2: 'Morocco',      flag2: '🇲🇦', timePT: '3:00 PM',  city: 'Boston',       venue: 'Gillette Stadium', isSeattle: false, score1: 1, score2: 2 },
    { id: 'g31', dateKey: 'Jun 19', team1: 'Brazil',       flag1: '🇧🇷', team2: 'Haiti',        flag2: '🇭🇹', timePT: '6:00 PM',  city: 'Philadelphia', venue: 'Lincoln Financial Field', isSeattle: false, score1: 4, score2: 1 },
    { id: 'g32', dateKey: 'Jun 19', team1: 'Turkey',       flag1: '🇹🇷', team2: 'Paraguay',     flag2: '🇵🇾', timePT: '9:00 PM',  city: 'San Francisco', venue: "Levi's Stadium",  isSeattle: false, score1: 1, score2: 1 },
  ],
  'Jun 20': [
    { id: 'g33', dateKey: 'Jun 20', team1: 'Netherlands',  flag1: '🇳🇱', team2: 'Sweden',       flag2: '🇸🇪', timePT: '10:00 AM', city: 'Houston',      venue: 'NRG Stadium',      isSeattle: false, score1: 3, score2: 1 },
    { id: 'g34', dateKey: 'Jun 20', team1: 'Germany',      flag1: '🇩🇪', team2: 'Ivory Coast',  flag2: '🇨🇮', timePT: '1:00 PM',  city: 'Toronto',      venue: 'BMO Field',        isSeattle: false, score1: 2, score2: 0 },
    { id: 'g35', dateKey: 'Jun 20', team1: 'Ecuador',      flag1: '🇪🇨', team2: 'Curaçao',      flag2: '🇨🇼', timePT: '5:00 PM',  city: 'Kansas City',  venue: 'Arrowhead Stadium', isSeattle: false, score1: 1, score2: 0 },
    { id: 'g36', dateKey: 'Jun 20', team1: 'Tunisia',      flag1: '🇹🇳', team2: 'Japan',        flag2: '🇯🇵', timePT: '9:00 PM',  city: 'Monterrey',    venue: 'Estadio BBVA',     isSeattle: false, score1: 0, score2: 1 },
  ],
  'Jun 21': [
    { id: 'g37', dateKey: 'Jun 21', team1: 'Spain',        flag1: '🇪🇸', team2: 'Saudi Arabia', flag2: '🇸🇦', timePT: '9:00 AM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium', isSeattle: false, score1: 2, score2: 0 },
    { id: 'g38', dateKey: 'Jun 21', team1: 'Belgium',      flag1: '🇧🇪', team2: 'Iran',         flag2: '🇮🇷', timePT: '12:00 PM', city: 'Los Angeles',  venue: 'SoFi Stadium',     isSeattle: false, score1: 1, score2: 1 },
    { id: 'g39', dateKey: 'Jun 21', team1: 'Uruguay',      flag1: '🇺🇾', team2: 'Cape Verde',   flag2: '🇨🇻', timePT: '3:00 PM',  city: 'Miami',        venue: 'Hard Rock Stadium', isSeattle: false, score1: 2, score2: 1 },
    { id: 'g40', dateKey: 'Jun 21', team1: 'New Zealand',  flag1: '🇳🇿', team2: 'Egypt',        flag2: '🇪🇬', timePT: '6:00 PM',  city: 'Vancouver',    venue: 'BC Place',         isSeattle: false, score1: 0, score2: 3 },
  ],
  'Jun 22': [
    { id: 'g41', dateKey: 'Jun 22', team1: 'Argentina',    flag1: '🇦🇷', team2: 'Austria',      flag2: '🇦🇹', timePT: '10:00 AM', city: 'Dallas',       venue: 'AT&T Stadium',     isSeattle: false, score1: 1, score2: 0 },
    { id: 'g42', dateKey: 'Jun 22', team1: 'France',       flag1: '🇫🇷', team2: 'Iraq',         flag2: '🇮🇶', timePT: '2:00 PM',  city: 'Philadelphia', venue: 'Lincoln Financial Field', isSeattle: false, score1: 3, score2: 1 },
    { id: 'g43', dateKey: 'Jun 22', team1: 'Norway',       flag1: '🇳🇴', team2: 'Senegal',      flag2: '🇸🇳', timePT: '5:00 PM',  city: 'New Jersey',   venue: 'MetLife Stadium',  isSeattle: false, score1: 2, score2: 2 },
    { id: 'g44', dateKey: 'Jun 22', team1: 'Jordan',       flag1: '🇯🇴', team2: 'Algeria',      flag2: '🇩🇿', timePT: '8:00 PM',  city: 'San Francisco', venue: "Levi's Stadium",  isSeattle: false, score1: 0, score2: 2 },
  ],
  'Jun 23': [
    { id: 'g45', dateKey: 'Jun 23', team1: 'Portugal',     flag1: '🇵🇹', team2: 'Uzbekistan',   flag2: '🇺🇿', timePT: '10:00 AM', city: 'Houston',      venue: 'NRG Stadium',      isSeattle: false, score1: 2, score2: 1 },
    { id: 'g46', dateKey: 'Jun 23', team1: 'England',      flag1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team2: 'Ghana',        flag2: '🇬🇭', timePT: '1:00 PM',  city: 'Boston',       venue: 'Gillette Stadium', isSeattle: false, score1: 3, score2: 0 },
    { id: 'g47', dateKey: 'Jun 23', team1: 'Panama',       flag1: '🇵🇦', team2: 'Croatia',      flag2: '🇭🇷', timePT: '4:00 PM',  city: 'Toronto',      venue: 'BMO Field',        isSeattle: false, score1: 1, score2: 1 },
    { id: 'g48', dateKey: 'Jun 23', team1: 'Colombia',     flag1: '🇨🇴', team2: 'DR Congo',     flag2: '🇨🇩', timePT: '7:00 PM',  city: 'Guadalajara',  venue: 'Estadio Akron',    isSeattle: false, score1: 2, score2: 0 },
  ],
  'Jun 24': [
    { id: 'g49', dateKey: 'Jun 24', team1: 'Switzerland',  flag1: '🇨🇭', team2: 'Canada',       flag2: '🇨🇦', timePT: '12:00 PM', city: 'Vancouver',    venue: 'BC Place',         isSeattle: false, score1: 1, score2: 0 },
    { id: 'g50', dateKey: 'Jun 24', team1: 'Bosnia & Herzegovina', flag1: '🇧🇦', team2: 'Qatar', flag2: '🇶🇦', timePT: '12:00 PM', city: 'Seattle', venue: 'Lumen Field',       isSeattle: true,  score1: 2, score2: 1 },
    { id: 'g51', dateKey: 'Jun 24', team1: 'Scotland',     flag1: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', team2: 'Brazil',       flag2: '🇧🇷', timePT: '3:00 PM',  city: 'Miami',        venue: 'Hard Rock Stadium', isSeattle: false, score1: 1, score2: 2 },
    { id: 'g52', dateKey: 'Jun 24', team1: 'Morocco',      flag1: '🇲🇦', team2: 'Haiti',        flag2: '🇭🇹', timePT: '3:00 PM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium', isSeattle: false, score1: 3, score2: 1 },
    { id: 'g53', dateKey: 'Jun 24', team1: 'Czechia',      flag1: '🇨🇿', team2: 'Mexico',       flag2: '🇲🇽', timePT: '6:00 PM',  city: 'Mexico City',  venue: 'Estadio Azteca',   isSeattle: false, score1: 1, score2: 2 },
    { id: 'g54', dateKey: 'Jun 24', team1: 'South Africa', flag1: '🇿🇦', team2: 'South Korea',  flag2: '🇰🇷', timePT: '6:00 PM',  city: 'Monterrey',    venue: 'Estadio BBVA',     isSeattle: false, score1: 0, score2: 0 },
  ],
  'Jun 25': [
    { id: 'g55', dateKey: 'Jun 25', team1: 'Ecuador',      flag1: '🇪🇨', team2: 'Germany',      flag2: '🇩🇪', timePT: '1:00 PM',  city: 'New Jersey',   venue: 'MetLife Stadium',  isSeattle: false, score1: 1, score2: 2 },
    { id: 'g56', dateKey: 'Jun 25', team1: 'Curaçao',      flag1: '🇨🇼', team2: 'Ivory Coast',  flag2: '🇨🇮', timePT: '1:00 PM',  city: 'Philadelphia', venue: 'Lincoln Financial Field', isSeattle: false, score1: 0, score2: 1 },
    { id: 'g57', dateKey: 'Jun 25', team1: 'Japan',        flag1: '🇯🇵', team2: 'Sweden',       flag2: '🇸🇪', timePT: '4:00 PM',  city: 'Dallas',       venue: 'AT&T Stadium',     isSeattle: false, score1: 1, score2: 1 },
    { id: 'g58', dateKey: 'Jun 25', team1: 'Tunisia',      flag1: '🇹🇳', team2: 'Netherlands',  flag2: '🇳🇱', timePT: '4:00 PM',  city: 'Kansas City',  venue: 'Arrowhead Stadium', isSeattle: false, score1: 0, score2: 2 },
    { id: 'g59', dateKey: 'Jun 25', team1: 'Turkey',       flag1: '🇹🇷', team2: 'USA',          flag2: '🇺🇸', timePT: '7:00 PM',  city: 'Los Angeles',  venue: 'SoFi Stadium',     isSeattle: false, score1: 1, score2: 2 },
    { id: 'g60', dateKey: 'Jun 25', team1: 'Paraguay',     flag1: '🇵🇾', team2: 'Australia',    flag2: '🇦🇺', timePT: '7:00 PM',  city: 'San Francisco', venue: "Levi's Stadium",  isSeattle: false, score1: 2, score2: 1 },
  ],
  'Jun 26': [
    { id: 'g61', dateKey: 'Jun 26', team1: 'Norway',       flag1: '🇳🇴', team2: 'France',       flag2: '🇫🇷', timePT: '12:00 PM', city: 'Boston',       venue: 'Gillette Stadium', isSeattle: false, score1: 1, score2: 1 },
    { id: 'g62', dateKey: 'Jun 26', team1: 'Senegal',      flag1: '🇸🇳', team2: 'Iraq',         flag2: '🇮🇶', timePT: '12:00 PM', city: 'Toronto',      venue: 'BMO Field',        isSeattle: false, score1: 2, score2: 0 },
    { id: 'g63', dateKey: 'Jun 26', team1: 'Cape Verde',   flag1: '🇨🇻', team2: 'Saudi Arabia', flag2: '🇸🇦', timePT: '5:00 PM',  city: 'Houston',      venue: 'NRG Stadium',      isSeattle: false, score1: 0, score2: 1 },
    { id: 'g64', dateKey: 'Jun 26', team1: 'Uruguay',      flag1: '🇺🇾', team2: 'Spain',        flag2: '🇪🇸', timePT: '5:00 PM',  city: 'Guadalajara',  venue: 'Estadio Akron',    isSeattle: false, score1: 1, score2: 2 },
    { id: 'g65', dateKey: 'Jun 26', team1: 'Egypt',        flag1: '🇪🇬', team2: 'Iran',         flag2: '🇮🇷', timePT: '8:00 PM',  city: 'Seattle',      venue: 'Lumen Field',      isSeattle: true,  score1: 1, score2: 1 },
    { id: 'g66', dateKey: 'Jun 26', team1: 'New Zealand',  flag1: '🇳🇿', team2: 'Belgium',      flag2: '🇧🇪', timePT: '8:00 PM',  city: 'Vancouver',    venue: 'BC Place',         isSeattle: false, score1: 0, score2: 2 },
  ],
  'Jun 27': [
    { id: 'g67', dateKey: 'Jun 27', team1: 'Panama',       flag1: '🇵🇦', team2: 'England',      flag2: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', timePT: '2:00 PM',  city: 'New Jersey',   venue: 'MetLife Stadium',  isSeattle: false, score1: 0, score2: 3 },
    { id: 'g68', dateKey: 'Jun 27', team1: 'Croatia',      flag1: '🇭🇷', team2: 'Ghana',        flag2: '🇬🇭', timePT: '2:00 PM',  city: 'Philadelphia', venue: 'Lincoln Financial Field', isSeattle: false, score1: 2, score2: 1 },
    { id: 'g69', dateKey: 'Jun 27', team1: 'Colombia',     flag1: '🇨🇴', team2: 'Portugal',     flag2: '🇵🇹', timePT: '4:30 PM',  city: 'Miami',        venue: 'Hard Rock Stadium', isSeattle: false, score1: 1, score2: 1 },
    { id: 'g70', dateKey: 'Jun 27', team1: 'DR Congo',     flag1: '🇨🇩', team2: 'Uzbekistan',   flag2: '🇺🇿', timePT: '4:30 PM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium', isSeattle: false, score1: 0, score2: 1 },
    { id: 'g71', dateKey: 'Jun 27', team1: 'Algeria',      flag1: '🇩🇿', team2: 'Austria',      flag2: '🇦🇹', timePT: '7:00 PM',  city: 'Kansas City',  venue: 'Arrowhead Stadium', isSeattle: false, score1: 1, score2: 2 },
    { id: 'g72', dateKey: 'Jun 27', team1: 'Jordan',       flag1: '🇯🇴', team2: 'Argentina',    flag2: '🇦🇷', timePT: '7:00 PM',  city: 'Dallas',       venue: 'AT&T Stadium',     isSeattle: false, score1: 0, score2: 4 },
  ],
  // ── Round of 32 (Jun 28 – Jul 3) ─────────────────────────────
  'Jun 28': [
    { id: 'r32-1', dateKey: 'Jun 28', team1: 'Canada', flag1: '🇨🇦', team2: 'South Africa', flag2: '🇿🇦', timePT: '12:00 PM', city: 'Los Angeles',  venue: 'SoFi Stadium',           isSeattle: false, round: 'Round of 32', score1: 2, score2: 1 },
  ],
  'Jun 29': [
    { id: 'r32-2', dateKey: 'Jun 29', team1: 'Brazil',   flag1: '🇧🇷', team2: 'Japan',   flag2: '🇯🇵', timePT: '10:00 AM', city: 'Houston',   venue: 'NRG Stadium',      isSeattle: false, round: 'Round of 32', score1: 3, score2: 1 },
    { id: 'r32-3', dateKey: 'Jun 29', team1: 'Paraguay', flag1: '🇵🇾', team2: 'Germany', flag2: '🇩🇪', timePT: '1:30 PM',  city: 'Boston',    venue: 'Gillette Stadium', isSeattle: false, round: 'Round of 32', score1: 1, score2: 1, pens1: 4, pens2: 3 },
    { id: 'r32-4', dateKey: 'Jun 29', team1: 'Morocco',  flag1: '🇲🇦', team2: 'Netherlands', flag2: '🇳🇱', timePT: '6:00 PM', city: 'Monterrey', venue: 'Estadio BBVA',  isSeattle: false, round: 'Round of 32', score1: 2, score2: 1 },
  ],
  'Jun 30': [
    { id: 'r32-5', dateKey: 'Jun 30', team1: 'Norway', flag1: '🇳🇴', team2: 'Ivory Coast', flag2: '🇨🇮', timePT: '10:00 AM', city: 'Dallas',       venue: 'AT&T Stadium',           isSeattle: false, round: 'Round of 32', score1: 3, score2: 1 },
    { id: 'r32-6', dateKey: 'Jun 30', team1: 'France', flag1: '🇫🇷', team2: 'Sweden',      flag2: '🇸🇪', timePT: '2:00 PM',  city: 'New Jersey',   venue: 'MetLife Stadium',        isSeattle: false, round: 'Round of 32', score1: 2, score2: 0 },
    { id: 'r32-7', dateKey: 'Jun 30', team1: 'Mexico', flag1: '🇲🇽', team2: 'Ecuador',     flag2: '🇪🇨', timePT: '6:00 PM',  city: 'Mexico City',  venue: 'Estadio Azteca',         isSeattle: false, round: 'Round of 32', score1: 2, score2: 1 },
  ],
  'Jul 1': [
    { id: 'r32-8',  dateKey: 'Jul 1', team1: 'England', flag1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team2: 'DR Congo', flag2: '🇨🇩', timePT: '9:00 AM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium',  isSeattle: false, round: 'Round of 32', score1: 3, score2: 0 },
    { id: 'r32-9',  dateKey: 'Jul 1', team1: 'Belgium', flag1: '🇧🇪', team2: 'Senegal', flag2: '🇸🇳', timePT: '1:00 PM',  city: 'Seattle',      venue: 'Lumen Field',            isSeattle: true,  round: 'Round of 32', score1: 2, score2: 1 },
    { id: 'r32-10', dateKey: 'Jul 1', team1: 'USA',     flag1: '🇺🇸', team2: 'Bosnia & Herzegovina', flag2: '🇧🇦', timePT: '5:00 PM',  city: 'San Francisco', venue: "Levi's Stadium",   isSeattle: false, round: 'Round of 32', score1: 2, score2: 0 },
  ],
  'Jul 2': [
    { id: 'r32-11', dateKey: 'Jul 2', team1: 'Spain',       flag1: '🇪🇸', team2: 'Austria', flag2: '🇦🇹', timePT: '12:00 PM', city: 'Los Angeles',  venue: 'SoFi Stadium',           isSeattle: false, round: 'Round of 32', score1: 3, score2: 1 },
    { id: 'r32-12', dateKey: 'Jul 2', team1: 'Portugal',    flag1: '🇵🇹', team2: 'Croatia', flag2: '🇭🇷', timePT: '4:00 PM',  city: 'Toronto',      venue: 'BMO Field',              isSeattle: false, round: 'Round of 32', score1: 2, score2: 1 },
    { id: 'r32-13', dateKey: 'Jul 2', team1: 'Switzerland', flag1: '🇨🇭', team2: 'Algeria', flag2: '🇩🇿', timePT: '8:00 PM',  city: 'Vancouver',    venue: 'BC Place',               isSeattle: false, round: 'Round of 32', score1: 1, score2: 0 },
  ],
  'Jul 3': [
    { id: 'r32-14', dateKey: 'Jul 3', team1: 'Egypt',     flag1: '🇪🇬', team2: 'Australia',  flag2: '🇦🇺', timePT: '11:00 AM', city: 'Dallas',       venue: 'AT&T Stadium',           isSeattle: false, round: 'Round of 32', score1: 2, score2: 1 },
    { id: 'r32-15', dateKey: 'Jul 3', team1: 'Argentina', flag1: '🇦🇷', team2: 'Cape Verde', flag2: '🇨🇻', timePT: '3:00 PM',  city: 'Miami',        venue: 'Hard Rock Stadium',      isSeattle: false, round: 'Round of 32', score1: 4, score2: 0 },
    { id: 'r32-16', dateKey: 'Jul 3', team1: 'Colombia',  flag1: '🇨🇴', team2: 'Ghana',      flag2: '🇬🇭', timePT: '6:30 PM',  city: 'Kansas City',  venue: 'Arrowhead Stadium',      isSeattle: false, round: 'Round of 32', score1: 2, score2: 1 },
  ],
  // ── Round of 16 (Jul 4 – 7) ──────────────────────────────────
  'Jul 4': [
    { id: 'r16-1', dateKey: 'Jul 4', team1: 'Morocco', flag1: '🇲🇦', team2: 'Canada',   flag2: '🇨🇦', timePT: '10:00 AM', city: 'Houston',      venue: 'NRG Stadium',            isSeattle: false, round: 'Round of 16', score1: 1, score2: 0 },
    { id: 'r16-2', dateKey: 'Jul 4', team1: 'France',  flag1: '🇫🇷', team2: 'Paraguay', flag2: '🇵🇾', timePT: '2:00 PM',  city: 'Philadelphia', venue: 'Lincoln Financial Field', isSeattle: false, round: 'Round of 16', score1: 3, score2: 1 },
  ],
  'Jul 5': [
    { id: 'r16-3', dateKey: 'Jul 5', team1: 'Norway',  flag1: '🇳🇴', team2: 'Brazil', flag2: '🇧🇷', timePT: '1:00 PM',  city: 'New Jersey',   venue: 'MetLife Stadium',        isSeattle: false, round: 'Round of 16', score1: 1, score2: 2 },
    { id: 'r16-4', dateKey: 'Jul 5', team1: 'England', flag1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team2: 'Mexico', flag2: '🇲🇽', timePT: '5:00 PM',  city: 'Mexico City',  venue: 'Estadio Azteca',         isSeattle: false, round: 'Round of 16', score1: 2, score2: 1 },
  ],
  'Jul 6': [
    { id: 'r16-5', dateKey: 'Jul 6', team1: 'Spain', flag1: '🇪🇸', team2: 'Portugal', flag2: '🇵🇹', timePT: '12:00 PM', city: 'Dallas',       venue: 'AT&T Stadium',           isSeattle: false, round: 'Round of 16', score1: 2, score2: 1 },
    { id: 'r16-6', dateKey: 'Jul 6', team1: 'USA',   flag1: '🇺🇸', team2: 'Belgium',  flag2: '🇧🇪', timePT: '2:00 PM',  city: 'Seattle',      venue: 'Lumen Field',            isSeattle: true,  round: 'Round of 16', score1: 2, score2: 1 },
  ],
  'Jul 7': [
    { id: 'r16-7', dateKey: 'Jul 7', team1: 'Argentina',   flag1: '🇦🇷', team2: 'Egypt',    flag2: '🇪🇬', timePT: '9:00 AM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium',  isSeattle: false, round: 'Round of 16', score1: 3, score2: 0 },
    { id: 'r16-8', dateKey: 'Jul 7', team1: 'Switzerland', flag1: '🇨🇭', team2: 'Colombia', flag2: '🇨🇴', timePT: '1:00 PM',  city: 'Vancouver',    venue: 'BC Place',               isSeattle: false, round: 'Round of 16', score1: 0, score2: 1 },
  ],
  // ── Quarterfinals (Jul 9 – 11) ───────────────────────────────
  'Jul 9': [
    { id: 'qf-1', dateKey: 'Jul 9', team1: 'Spain', flag1: '🇪🇸', team2: 'USA', flag2: '🇺🇸', timePT: '2:00 PM', city: 'Los Angeles', venue: 'SoFi Stadium', isSeattle: false, round: 'Quarterfinal', score1: 2, score2: 1 },
  ],
  'Jul 10': [
    { id: 'qf-2', dateKey: 'Jul 10', team1: 'England', flag1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team2: 'Brazil', flag2: '🇧🇷', timePT: '3:00 PM', city: 'Kansas City', venue: 'Arrowhead Stadium', isSeattle: false, round: 'Quarterfinal', score1: 1, score2: 3 },
  ],
  'Jul 11': [
    { id: 'qf-3', dateKey: 'Jul 11', team1: 'Argentina', flag1: '🇦🇷', team2: 'Morocco',  flag2: '🇲🇦', timePT: '12:00 PM', city: 'Miami',  venue: 'Hard Rock Stadium', isSeattle: false, round: 'Quarterfinal', score1: 2, score2: 0 },
    { id: 'qf-4', dateKey: 'Jul 11', team1: 'France',    flag1: '🇫🇷', team2: 'Colombia', flag2: '🇨🇴', timePT: '4:00 PM',  city: 'Boston', venue: 'Gillette Stadium',  isSeattle: false, round: 'Quarterfinal', score1: 1, score2: 1, pens1: 4, pens2: 3 },
  ],
  // ── Semifinals (Jul 14 – 15) ─────────────────────────────────
  'Jul 14': [
    { id: 'sf-1', dateKey: 'Jul 14', team1: 'Spain', flag1: '🇪🇸', team2: 'Brazil', flag2: '🇧🇷', timePT: '3:00 PM', city: 'Dallas', venue: 'AT&T Stadium', isSeattle: false, round: 'Semifinal', score1: 2, score2: 1 },
  ],
  'Jul 15': [
    { id: 'sf-2', dateKey: 'Jul 15', team1: 'Argentina', flag1: '🇦🇷', team2: 'France', flag2: '🇫🇷', timePT: '3:00 PM', city: 'Atlanta', venue: 'Mercedes-Benz Stadium', isSeattle: false, round: 'Semifinal', score1: 1, score2: 0 },
  ],
  // ── Third place (Jul 18) ─────────────────────────────────────
  'Jul 18': [
    { id: 'tp-1', dateKey: 'Jul 18', team1: 'Brazil', flag1: '🇧🇷', team2: 'France', flag2: '🇫🇷', timePT: '12:00 PM', city: 'Miami', venue: 'Hard Rock Stadium', isSeattle: false, round: 'Third-place', score1: 2, score2: 1 },
  ],
  // ── Final (Jul 19) 🏆 ────────────────────────────────────────
  'Jul 19': [
    { id: 'final', dateKey: 'Jul 19', team1: 'Spain', flag1: '🇪🇸', team2: 'Argentina', flag2: '🇦🇷', timePT: '12:00 PM', city: 'New Jersey', venue: 'MetLife Stadium', isSeattle: false, round: 'Final', final: true, aet: true, score1: 1, score2: 0 },
  ],
};
