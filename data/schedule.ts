export interface GlobalMatch {
  id: string;
  dateKey: string;  // 'Jun 11' format — matches tournament day keys
  team1: string;  flag1: string;
  team2: string;  flag2: string;
  timePT: string;
  city: string;
  venue: string;
  isSeattle: boolean;
}

// ET → PT: subtract 3 hours
// Full FIFA 2026 group stage schedule (all 48 matches, Jun 11–27)
// + Seattle knockout rounds Jul 1, Jul 6

export const GLOBAL_SCHEDULE: Record<string, GlobalMatch[]> = {
  'Jun 11': [
    { id: 'g1',  dateKey: 'Jun 11', team1: 'Mexico',      flag1: '🇲🇽', team2: 'South Africa', flag2: '🇿🇦', timePT: '12:00 PM', city: 'Mexico City',  venue: 'Estadio Azteca',   isSeattle: false },
    { id: 'g2',  dateKey: 'Jun 11', team1: 'South Korea',  flag1: '🇰🇷', team2: 'Czechia',      flag2: '🇨🇿', timePT: '7:00 PM',  city: 'Guadalajara', venue: 'Estadio Akron',    isSeattle: false },
  ],
  'Jun 12': [
    { id: 'g3',  dateKey: 'Jun 12', team1: 'Canada',       flag1: '🇨🇦', team2: 'Bosnia & Herzegovina', flag2: '🇧🇦', timePT: '12:00 PM', city: 'Toronto',      venue: 'BMO Field',        isSeattle: false },
    { id: 'g4',  dateKey: 'Jun 12', team1: 'USA',          flag1: '🇺🇸', team2: 'Paraguay',     flag2: '🇵🇾', timePT: '6:00 PM',  city: 'Los Angeles',  venue: 'SoFi Stadium',     isSeattle: false },
  ],
  'Jun 13': [
    { id: 'g5',  dateKey: 'Jun 13', team1: 'Qatar',        flag1: '🇶🇦', team2: 'Switzerland',  flag2: '🇨🇭', timePT: '12:00 PM', city: 'San Francisco', venue: "Levi's Stadium",   isSeattle: false },
    { id: 'g6',  dateKey: 'Jun 13', team1: 'Brazil',       flag1: '🇧🇷', team2: 'Morocco',      flag2: '🇲🇦', timePT: '3:00 PM',  city: 'New Jersey',   venue: 'MetLife Stadium',  isSeattle: false },
    { id: 'g7',  dateKey: 'Jun 13', team1: 'Haiti',        flag1: '🇭🇹', team2: 'Scotland',     flag2: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', timePT: '6:00 PM',  city: 'Boston',       venue: 'Gillette Stadium', isSeattle: false },
    { id: 'g8',  dateKey: 'Jun 13', team1: 'Australia',    flag1: '🇦🇺', team2: 'Turkey',       flag2: '🇹🇷', timePT: '9:00 PM',  city: 'Vancouver',    venue: 'BC Place',         isSeattle: false },
  ],
  'Jun 14': [
    { id: 'g9',  dateKey: 'Jun 14', team1: 'Germany',      flag1: '🇩🇪', team2: 'Curaçao',      flag2: '🇨🇼', timePT: '10:00 AM', city: 'Houston',      venue: 'NRG Stadium',      isSeattle: false },
    { id: 'g10', dateKey: 'Jun 14', team1: 'Netherlands',  flag1: '🇳🇱', team2: 'Japan',        flag2: '🇯🇵', timePT: '1:00 PM',  city: 'Dallas',       venue: 'AT&T Stadium',     isSeattle: false },
    { id: 'g11', dateKey: 'Jun 14', team1: 'Ivory Coast',  flag1: '🇨🇮', team2: 'Ecuador',      flag2: '🇪🇨', timePT: '4:00 PM',  city: 'Philadelphia', venue: 'Lincoln Financial Field', isSeattle: false },
    { id: 'g12', dateKey: 'Jun 14', team1: 'Sweden',       flag1: '🇸🇪', team2: 'Tunisia',      flag2: '🇹🇳', timePT: '7:00 PM',  city: 'Monterrey',    venue: 'Estadio BBVA',     isSeattle: false },
  ],
  'Jun 15': [
    { id: 'g13', dateKey: 'Jun 15', team1: 'Spain',        flag1: '🇪🇸', team2: 'Cape Verde',   flag2: '🇨🇻', timePT: '9:00 AM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium', isSeattle: false },
    { id: 'g14', dateKey: 'Jun 15', team1: 'Belgium',      flag1: '🇧🇪', team2: 'Egypt',        flag2: '🇪🇬', timePT: '12:00 PM', city: 'Seattle',      venue: 'Lumen Field',      isSeattle: true  },
    { id: 'g15', dateKey: 'Jun 15', team1: 'Saudi Arabia', flag1: '🇸🇦', team2: 'Uruguay',      flag2: '🇺🇾', timePT: '3:00 PM',  city: 'Miami',        venue: 'Hard Rock Stadium', isSeattle: false },
    { id: 'g16', dateKey: 'Jun 15', team1: 'Iran',         flag1: '🇮🇷', team2: 'New Zealand',  flag2: '🇳🇿', timePT: '6:00 PM',  city: 'Los Angeles',  venue: 'SoFi Stadium',     isSeattle: false },
  ],
  'Jun 16': [
    { id: 'g17', dateKey: 'Jun 16', team1: 'France',       flag1: '🇫🇷', team2: 'Senegal',      flag2: '🇸🇳', timePT: '12:00 PM', city: 'New Jersey',   venue: 'MetLife Stadium',  isSeattle: false },
    { id: 'g18', dateKey: 'Jun 16', team1: 'Iraq',         flag1: '🇮🇶', team2: 'Norway',       flag2: '🇳🇴', timePT: '3:00 PM',  city: 'Boston',       venue: 'Gillette Stadium', isSeattle: false },
    { id: 'g19', dateKey: 'Jun 16', team1: 'Argentina',    flag1: '🇦🇷', team2: 'Algeria',      flag2: '🇩🇿', timePT: '6:00 PM',  city: 'Kansas City',  venue: 'Arrowhead Stadium', isSeattle: false },
    { id: 'g20', dateKey: 'Jun 16', team1: 'Austria',      flag1: '🇦🇹', team2: 'Jordan',       flag2: '🇯🇴', timePT: '9:00 PM',  city: 'San Francisco', venue: "Levi's Stadium",  isSeattle: false },
  ],
  'Jun 17': [
    { id: 'g21', dateKey: 'Jun 17', team1: 'Portugal',     flag1: '🇵🇹', team2: 'DR Congo',     flag2: '🇨🇩', timePT: '10:00 AM', city: 'Houston',      venue: 'NRG Stadium',      isSeattle: false },
    { id: 'g22', dateKey: 'Jun 17', team1: 'England',      flag1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team2: 'Croatia',      flag2: '🇭🇷', timePT: '1:00 PM',  city: 'Dallas',       venue: 'AT&T Stadium',     isSeattle: false },
    { id: 'g23', dateKey: 'Jun 17', team1: 'Ghana',        flag1: '🇬🇭', team2: 'Panama',       flag2: '🇵🇦', timePT: '4:00 PM',  city: 'Toronto',      venue: 'BMO Field',        isSeattle: false },
    { id: 'g24', dateKey: 'Jun 17', team1: 'Uzbekistan',   flag1: '🇺🇿', team2: 'Colombia',     flag2: '🇨🇴', timePT: '7:00 PM',  city: 'Mexico City',  venue: 'Estadio Azteca',   isSeattle: false },
  ],
  'Jun 18': [
    { id: 'g25', dateKey: 'Jun 18', team1: 'Czechia',      flag1: '🇨🇿', team2: 'South Africa', flag2: '🇿🇦', timePT: '9:00 AM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium', isSeattle: false },
    { id: 'g26', dateKey: 'Jun 18', team1: 'Switzerland',  flag1: '🇨🇭', team2: 'Bosnia & Herzegovina', flag2: '🇧🇦', timePT: '12:00 PM', city: 'Los Angeles', venue: 'SoFi Stadium', isSeattle: false },
    { id: 'g27', dateKey: 'Jun 18', team1: 'Canada',       flag1: '🇨🇦', team2: 'Qatar',        flag2: '🇶🇦', timePT: '3:00 PM',  city: 'Vancouver',    venue: 'BC Place',         isSeattle: false },
    { id: 'g28', dateKey: 'Jun 18', team1: 'Mexico',       flag1: '🇲🇽', team2: 'South Korea',  flag2: '🇰🇷', timePT: '6:00 PM',  city: 'Guadalajara',  venue: 'Estadio Akron',    isSeattle: false },
  ],
  'Jun 19': [
    { id: 'g29', dateKey: 'Jun 19', team1: 'USA',          flag1: '🇺🇸', team2: 'Australia',    flag2: '🇦🇺', timePT: '12:00 PM', city: 'Seattle',      venue: 'Lumen Field',      isSeattle: true  },
    { id: 'g30', dateKey: 'Jun 19', team1: 'Scotland',     flag1: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', team2: 'Morocco',      flag2: '🇲🇦', timePT: '3:00 PM',  city: 'Boston',       venue: 'Gillette Stadium', isSeattle: false },
    { id: 'g31', dateKey: 'Jun 19', team1: 'Brazil',       flag1: '🇧🇷', team2: 'Haiti',        flag2: '🇭🇹', timePT: '6:00 PM',  city: 'Philadelphia', venue: 'Lincoln Financial Field', isSeattle: false },
    { id: 'g32', dateKey: 'Jun 19', team1: 'Turkey',       flag1: '🇹🇷', team2: 'Paraguay',     flag2: '🇵🇾', timePT: '9:00 PM',  city: 'San Francisco', venue: "Levi's Stadium",  isSeattle: false },
  ],
  'Jun 20': [
    { id: 'g33', dateKey: 'Jun 20', team1: 'Netherlands',  flag1: '🇳🇱', team2: 'Sweden',       flag2: '🇸🇪', timePT: '10:00 AM', city: 'Houston',      venue: 'NRG Stadium',      isSeattle: false },
    { id: 'g34', dateKey: 'Jun 20', team1: 'Germany',      flag1: '🇩🇪', team2: 'Ivory Coast',  flag2: '🇨🇮', timePT: '1:00 PM',  city: 'Toronto',      venue: 'BMO Field',        isSeattle: false },
    { id: 'g35', dateKey: 'Jun 20', team1: 'Ecuador',      flag1: '🇪🇨', team2: 'Curaçao',      flag2: '🇨🇼', timePT: '5:00 PM',  city: 'Kansas City',  venue: 'Arrowhead Stadium', isSeattle: false },
    { id: 'g36', dateKey: 'Jun 20', team1: 'Tunisia',      flag1: '🇹🇳', team2: 'Japan',        flag2: '🇯🇵', timePT: '9:00 PM',  city: 'Monterrey',    venue: 'Estadio BBVA',     isSeattle: false },
  ],
  'Jun 21': [
    { id: 'g37', dateKey: 'Jun 21', team1: 'Spain',        flag1: '🇪🇸', team2: 'Saudi Arabia', flag2: '🇸🇦', timePT: '9:00 AM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium', isSeattle: false },
    { id: 'g38', dateKey: 'Jun 21', team1: 'Belgium',      flag1: '🇧🇪', team2: 'Iran',         flag2: '🇮🇷', timePT: '12:00 PM', city: 'Los Angeles',  venue: 'SoFi Stadium',     isSeattle: false },
    { id: 'g39', dateKey: 'Jun 21', team1: 'Uruguay',      flag1: '🇺🇾', team2: 'Cape Verde',   flag2: '🇨🇻', timePT: '3:00 PM',  city: 'Miami',        venue: 'Hard Rock Stadium', isSeattle: false },
    { id: 'g40', dateKey: 'Jun 21', team1: 'New Zealand',  flag1: '🇳🇿', team2: 'Egypt',        flag2: '🇪🇬', timePT: '6:00 PM',  city: 'Vancouver',    venue: 'BC Place',         isSeattle: false },
  ],
  'Jun 22': [
    { id: 'g41', dateKey: 'Jun 22', team1: 'Argentina',    flag1: '🇦🇷', team2: 'Austria',      flag2: '🇦🇹', timePT: '10:00 AM', city: 'Dallas',       venue: 'AT&T Stadium',     isSeattle: false },
    { id: 'g42', dateKey: 'Jun 22', team1: 'France',       flag1: '🇫🇷', team2: 'Iraq',         flag2: '🇮🇶', timePT: '2:00 PM',  city: 'Philadelphia', venue: 'Lincoln Financial Field', isSeattle: false },
    { id: 'g43', dateKey: 'Jun 22', team1: 'Norway',       flag1: '🇳🇴', team2: 'Senegal',      flag2: '🇸🇳', timePT: '5:00 PM',  city: 'New Jersey',   venue: 'MetLife Stadium',  isSeattle: false },
    { id: 'g44', dateKey: 'Jun 22', team1: 'Jordan',       flag1: '🇯🇴', team2: 'Algeria',      flag2: '🇩🇿', timePT: '8:00 PM',  city: 'San Francisco', venue: "Levi's Stadium",  isSeattle: false },
  ],
  'Jun 23': [
    { id: 'g45', dateKey: 'Jun 23', team1: 'Portugal',     flag1: '🇵🇹', team2: 'Uzbekistan',   flag2: '🇺🇿', timePT: '10:00 AM', city: 'Houston',      venue: 'NRG Stadium',      isSeattle: false },
    { id: 'g46', dateKey: 'Jun 23', team1: 'England',      flag1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team2: 'Ghana',        flag2: '🇬🇭', timePT: '1:00 PM',  city: 'Boston',       venue: 'Gillette Stadium', isSeattle: false },
    { id: 'g47', dateKey: 'Jun 23', team1: 'Panama',       flag1: '🇵🇦', team2: 'Croatia',      flag2: '🇭🇷', timePT: '4:00 PM',  city: 'Toronto',      venue: 'BMO Field',        isSeattle: false },
    { id: 'g48', dateKey: 'Jun 23', team1: 'Colombia',     flag1: '🇨🇴', team2: 'DR Congo',     flag2: '🇨🇩', timePT: '7:00 PM',  city: 'Guadalajara',  venue: 'Estadio Akron',    isSeattle: false },
  ],
  'Jun 24': [
    { id: 'g49', dateKey: 'Jun 24', team1: 'Switzerland',  flag1: '🇨🇭', team2: 'Canada',       flag2: '🇨🇦', timePT: '12:00 PM', city: 'Vancouver',    venue: 'BC Place',         isSeattle: false },
    { id: 'g50', dateKey: 'Jun 24', team1: 'Bosnia & Herzegovina', flag1: '🇧🇦', team2: 'Qatar', flag2: '🇶🇦', timePT: '12:00 PM', city: 'Seattle', venue: 'Lumen Field',       isSeattle: true  },
    { id: 'g51', dateKey: 'Jun 24', team1: 'Scotland',     flag1: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', team2: 'Brazil',       flag2: '🇧🇷', timePT: '3:00 PM',  city: 'Miami',        venue: 'Hard Rock Stadium', isSeattle: false },
    { id: 'g52', dateKey: 'Jun 24', team1: 'Morocco',      flag1: '🇲🇦', team2: 'Haiti',        flag2: '🇭🇹', timePT: '3:00 PM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium', isSeattle: false },
    { id: 'g53', dateKey: 'Jun 24', team1: 'Czechia',      flag1: '🇨🇿', team2: 'Mexico',       flag2: '🇲🇽', timePT: '6:00 PM',  city: 'Mexico City',  venue: 'Estadio Azteca',   isSeattle: false },
    { id: 'g54', dateKey: 'Jun 24', team1: 'South Africa', flag1: '🇿🇦', team2: 'South Korea',  flag2: '🇰🇷', timePT: '6:00 PM',  city: 'Monterrey',    venue: 'Estadio BBVA',     isSeattle: false },
  ],
  'Jun 25': [
    { id: 'g55', dateKey: 'Jun 25', team1: 'Ecuador',      flag1: '🇪🇨', team2: 'Germany',      flag2: '🇩🇪', timePT: '1:00 PM',  city: 'New Jersey',   venue: 'MetLife Stadium',  isSeattle: false },
    { id: 'g56', dateKey: 'Jun 25', team1: 'Curaçao',      flag1: '🇨🇼', team2: 'Ivory Coast',  flag2: '🇨🇮', timePT: '1:00 PM',  city: 'Philadelphia', venue: 'Lincoln Financial Field', isSeattle: false },
    { id: 'g57', dateKey: 'Jun 25', team1: 'Japan',        flag1: '🇯🇵', team2: 'Sweden',       flag2: '🇸🇪', timePT: '4:00 PM',  city: 'Dallas',       venue: 'AT&T Stadium',     isSeattle: false },
    { id: 'g58', dateKey: 'Jun 25', team1: 'Tunisia',      flag1: '🇹🇳', team2: 'Netherlands',  flag2: '🇳🇱', timePT: '4:00 PM',  city: 'Kansas City',  venue: 'Arrowhead Stadium', isSeattle: false },
    { id: 'g59', dateKey: 'Jun 25', team1: 'Turkey',       flag1: '🇹🇷', team2: 'USA',          flag2: '🇺🇸', timePT: '7:00 PM',  city: 'Los Angeles',  venue: 'SoFi Stadium',     isSeattle: false },
    { id: 'g60', dateKey: 'Jun 25', team1: 'Paraguay',     flag1: '🇵🇾', team2: 'Australia',    flag2: '🇦🇺', timePT: '7:00 PM',  city: 'San Francisco', venue: "Levi's Stadium",  isSeattle: false },
  ],
  'Jun 26': [
    { id: 'g61', dateKey: 'Jun 26', team1: 'Norway',       flag1: '🇳🇴', team2: 'France',       flag2: '🇫🇷', timePT: '12:00 PM', city: 'Boston',       venue: 'Gillette Stadium', isSeattle: false },
    { id: 'g62', dateKey: 'Jun 26', team1: 'Senegal',      flag1: '🇸🇳', team2: 'Iraq',         flag2: '🇮🇶', timePT: '12:00 PM', city: 'Toronto',      venue: 'BMO Field',        isSeattle: false },
    { id: 'g63', dateKey: 'Jun 26', team1: 'Cape Verde',   flag1: '🇨🇻', team2: 'Saudi Arabia', flag2: '🇸🇦', timePT: '5:00 PM',  city: 'Houston',      venue: 'NRG Stadium',      isSeattle: false },
    { id: 'g64', dateKey: 'Jun 26', team1: 'Uruguay',      flag1: '🇺🇾', team2: 'Spain',        flag2: '🇪🇸', timePT: '5:00 PM',  city: 'Guadalajara',  venue: 'Estadio Akron',    isSeattle: false },
    { id: 'g65', dateKey: 'Jun 26', team1: 'Egypt',        flag1: '🇪🇬', team2: 'Iran',         flag2: '🇮🇷', timePT: '8:00 PM',  city: 'Seattle',      venue: 'Lumen Field',      isSeattle: true  },
    { id: 'g66', dateKey: 'Jun 26', team1: 'New Zealand',  flag1: '🇳🇿', team2: 'Belgium',      flag2: '🇧🇪', timePT: '8:00 PM',  city: 'Vancouver',    venue: 'BC Place',         isSeattle: false },
  ],
  'Jun 27': [
    { id: 'g67', dateKey: 'Jun 27', team1: 'Panama',       flag1: '🇵🇦', team2: 'England',      flag2: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', timePT: '2:00 PM',  city: 'New Jersey',   venue: 'MetLife Stadium',  isSeattle: false },
    { id: 'g68', dateKey: 'Jun 27', team1: 'Croatia',      flag1: '🇭🇷', team2: 'Ghana',        flag2: '🇬🇭', timePT: '2:00 PM',  city: 'Philadelphia', venue: 'Lincoln Financial Field', isSeattle: false },
    { id: 'g69', dateKey: 'Jun 27', team1: 'Colombia',     flag1: '🇨🇴', team2: 'Portugal',     flag2: '🇵🇹', timePT: '4:30 PM',  city: 'Miami',        venue: 'Hard Rock Stadium', isSeattle: false },
    { id: 'g70', dateKey: 'Jun 27', team1: 'DR Congo',     flag1: '🇨🇩', team2: 'Uzbekistan',   flag2: '🇺🇿', timePT: '4:30 PM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium', isSeattle: false },
    { id: 'g71', dateKey: 'Jun 27', team1: 'Algeria',      flag1: '🇩🇿', team2: 'Austria',      flag2: '🇦🇹', timePT: '7:00 PM',  city: 'Kansas City',  venue: 'Arrowhead Stadium', isSeattle: false },
    { id: 'g72', dateKey: 'Jun 27', team1: 'Jordan',       flag1: '🇯🇴', team2: 'Argentina',    flag2: '🇦🇷', timePT: '7:00 PM',  city: 'Dallas',       venue: 'AT&T Stadium',     isSeattle: false },
  ],
  // ── Round of 32 (Jun 28 – Jul 3) — teams TBD ─────────────────
  'Jun 28': [
    { id: 'r32-1', dateKey: 'Jun 28', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '12:00 PM', city: 'Los Angeles',  venue: 'SoFi Stadium',           isSeattle: false },
  ],
  'Jun 29': [
    { id: 'r32-2', dateKey: 'Jun 29', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '10:00 AM', city: 'Houston',      venue: 'NRG Stadium',            isSeattle: false },
    { id: 'r32-3', dateKey: 'Jun 29', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '1:30 PM',  city: 'Boston',       venue: 'Gillette Stadium',       isSeattle: false },
    { id: 'r32-4', dateKey: 'Jun 29', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '6:00 PM',  city: 'Guadalajara',  venue: 'Estadio Akron',          isSeattle: false },
  ],
  'Jun 30': [
    { id: 'r32-5', dateKey: 'Jun 30', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '10:00 AM', city: 'Dallas',       venue: 'AT&T Stadium',           isSeattle: false },
    { id: 'r32-6', dateKey: 'Jun 30', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '2:00 PM',  city: 'New Jersey',   venue: 'MetLife Stadium',        isSeattle: false },
    { id: 'r32-7', dateKey: 'Jun 30', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '6:00 PM',  city: 'Mexico City',  venue: 'Estadio Azteca',         isSeattle: false },
  ],
  'Jul 1': [
    { id: 'r32-8',  dateKey: 'Jul 1', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '9:00 AM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium',  isSeattle: false },
    { id: 'r32-9',  dateKey: 'Jul 1', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '1:00 PM',  city: 'Seattle',      venue: 'Lumen Field',            isSeattle: true  },
    { id: 'r32-10', dateKey: 'Jul 1', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '5:00 PM',  city: 'San Francisco', venue: "Levi's Stadium",        isSeattle: false },
  ],
  'Jul 2': [
    { id: 'r32-11', dateKey: 'Jul 2', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '12:00 PM', city: 'Los Angeles',  venue: 'SoFi Stadium',           isSeattle: false },
    { id: 'r32-12', dateKey: 'Jul 2', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '4:00 PM',  city: 'Toronto',      venue: 'BMO Field',              isSeattle: false },
    { id: 'r32-13', dateKey: 'Jul 2', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '8:00 PM',  city: 'Vancouver',    venue: 'BC Place',               isSeattle: false },
  ],
  'Jul 3': [
    { id: 'r32-14', dateKey: 'Jul 3', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '11:00 AM', city: 'Dallas',       venue: 'AT&T Stadium',           isSeattle: false },
    { id: 'r32-15', dateKey: 'Jul 3', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '3:00 PM',  city: 'Miami',        venue: 'Hard Rock Stadium',      isSeattle: false },
    { id: 'r32-16', dateKey: 'Jul 3', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '6:30 PM',  city: 'Kansas City',  venue: 'Arrowhead Stadium',      isSeattle: false },
  ],
  // ── Round of 16 (Jul 4 – 7) — teams TBD ──────────────────────
  'Jul 4': [
    { id: 'r16-1', dateKey: 'Jul 4', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '10:00 AM', city: 'Houston',      venue: 'NRG Stadium',            isSeattle: false },
    { id: 'r16-2', dateKey: 'Jul 4', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '2:00 PM',  city: 'Philadelphia', venue: 'Lincoln Financial Field', isSeattle: false },
  ],
  'Jul 5': [
    { id: 'r16-3', dateKey: 'Jul 5', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '1:00 PM',  city: 'New Jersey',   venue: 'MetLife Stadium',        isSeattle: false },
    { id: 'r16-4', dateKey: 'Jul 5', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '5:00 PM',  city: 'Mexico City',  venue: 'Estadio Azteca',         isSeattle: false },
  ],
  'Jul 6': [
    { id: 'r16-5', dateKey: 'Jul 6', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '12:00 PM', city: 'Dallas',       venue: 'AT&T Stadium',           isSeattle: false },
    { id: 'r16-6', dateKey: 'Jul 6', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '2:00 PM',  city: 'Seattle',      venue: 'Lumen Field',            isSeattle: true  },
  ],
  'Jul 7': [
    { id: 'r16-7', dateKey: 'Jul 7', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '9:00 AM',  city: 'Atlanta',      venue: 'Mercedes-Benz Stadium',  isSeattle: false },
    { id: 'r16-8', dateKey: 'Jul 7', team1: 'TBD', flag1: '', team2: 'TBD', flag2: '', timePT: '1:00 PM',  city: 'Vancouver',    venue: 'BC Place',               isSeattle: false },
  ],
};
