import { Tournament } from '@/lib/types';

export const COLORS = {
  GOLD: '#d3a536',
  TEAL: '#51b6ca',
  BRIGHT_BLUE: '#3aebfd',
  WHITE: '#FFFFFF',
  BLACK: '#1d1c24',
};

export const DEFAULT_TIER_POINTS = {
  I: 1.0, // Iron
  IB: 2.0, // Iron-Bronze
  B: 3.0, // Bronze
  BS: 4.0, // Bronze-Silver
  S: 5.0, // Silver
  SG: 6.5, // Silver-Gold
  G: 8.0, // Gold
  GP: 9.5, // Gold-Platinum
  P: 11.0, // Platinum
  PE: 13.0, // Platinum-Emerald
  E: 15.0, // Emerald
  ED: 17.0, // Emerald-Diamond
  D: 19.0, // Diamond
  DM: 21.5, // Diamond-Master
  M: 24.0, // Master
  GM: 27.0, // Grandmaster
  C: 30.0, // Challenger
};

export const RANK_DESCRIPTIONS = {
  I: 'Iron',
  IB: 'Iron-Bronze',
  B: 'Bronze',
  BS: 'Bronze-Silver',
  S: 'Silver',
  SG: 'Silver-Gold',
  G: 'Gold',
  GP: 'Gold-Platinum',
  P: 'Platinum',
  PE: 'Platinum-Emerald',
  E: 'Emerald',
  ED: 'Emerald-Diamond',
  D: 'Diamond',
  DM: 'Diamond-Master',
  M: 'Master',
  GM: 'Grandmaster',
  C: 'Challenger',
};

export const ROUTES = {
  HOME: '/',
  TOURNAMENTS: '/tournaments',
  CUSTOMS: '/customs',
  FAQ: '/faq',
  STATS: '/stats',
  ADMIN: '/admin',
  ADMIN_TOURNAMENTS: '/admin/tournaments',
  ADMIN_CUSTOMS: '/admin/customs',
  ADMIN_CONTENT: '/admin/content',
};

export const TOURNAMENT_FORMATS = [
  'Single Elimination',
  'Double Elimination',
  'Round Robin',
  'Swiss',
  'Custom',
];

export const NAV_ITEMS = [
  { name: 'Home', href: ROUTES.HOME },
  { name: 'Tournaments', href: ROUTES.TOURNAMENTS },
  { name: 'Customs', href: ROUTES.CUSTOMS },
  { name: 'FAQ/Rules', href: ROUTES.FAQ },
  { name: 'Stats', href: ROUTES.STATS },

];

export const ADMIN_NAV_ITEMS = [
  { name: 'Dashboard', href: ROUTES.ADMIN },
  { name: 'Tournaments', href: ROUTES.ADMIN_TOURNAMENTS },
  { name: 'Customs', href: ROUTES.ADMIN_CUSTOMS },
  { name: 'Content', href: ROUTES.ADMIN_CONTENT },
];

export const dummyTournaments: Tournament[] = [
  {
    id: '1',
    name: 'ClashIT Season 1',
    description:
      'The inaugural season of our ClashIT series with 10 teams competing for the championship.',
    detailedDescription: `The inaugural season of our ClashIT series with 10 teams competing for the championship.\n\nThis tournament featured some of the best teams from our community in an intense competition.\n\n Teams competed in a single elimination bracket with the final matche being streamed on our Twitch channel.\n\nThe tournament concluded with an exciting final match that went the distance, with Moyun's emerging as our champions.`,
    format: 'Single Elimination',
    startDate: new Date(2025, 0, 4).toISOString(),
    endDate: new Date(2025, 0, 4).toISOString(),
    status: 'completed',
    teams: [],
    matches: [
      { id: '5', team1Id: 'team-1', team2Id: 'team-3', round: 2, matchNumber: 1 },
      { id: '4', team1Id: 'team-1', team2Id: 'team-3', round: 2, matchNumber: 1 },
      { id: '6', team1Id: 'team-1', team2Id: 'team-3', round: 3, matchNumber: 1 },
      { id: '7', team1Id: 'team-1', team2Id: 'team-2', round: 1, matchNumber: 1 },
      { id: '1', team1Id: 'team-1', team2Id: 'team-2', round: 1, matchNumber: 1 },
      { id: '2', team1Id: 'team-3', team2Id: 'team-4', round: 1, matchNumber: 1 },
      { id: '3', team1Id: 'team-1', team2Id: 'team-3', round: 1, matchNumber: 1 },
    ],
    rules:
      "1. All participants must be members of our Discord server.\n2. Teams must have 5 main players.\n3. All games will be played on the Summoner's Rift map.\n4. Tournament draft mode will be used for all matches.\n5. Teams have 10 minutes to show up for their scheduled match or they forfeit.",
    prizes: '1st Place: Clout and special role\n2nd Place: Disgrace\n3rd Place: Play Mario',
  },
  // {
  //   id: '2',
  //   name: 'Summer Showdown',
  //   description: 'Our big tournament of the summer with 16 teams competing for the championship title and a prize pool of $1000.',
  //   detailedDescription: 'Our big tournament of the summer with 16 teams competing for the championship title and a prize pool of $1000.\n\nThis tournament will feature some of the best teams from our community facing off in an intense weekend of competition. Teams will compete in a double elimination bracket with best-of-three matches leading up to a best-of-five final.\n\nSpectators are welcome to watch matches on our Twitch channel and participate in the community predictions.',
  //   format: 'Double Elimination',
  //   startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  //   endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
  //   status: 'upcoming',
  //   teams: Array(16).fill(null).map((_, i) => ({
  //     id: `team-${i + 10}`,
  //     name: `Team ${String.fromCharCode(65 + i)}`,
  //     players: Array(5).fill(null).map((_, j) => `Player ${i*5 + j + 1}`),
  //   })),
  //   matches: [],
  //   rules: '1. All participants must be members of our Discord server.\n2. Teams must have 5 main players and up to 2 substitutes.\n3. All games will be played on the Summoner\'s Rift map.\n4. Tournament draft mode will be used for all matches.\n5. Teams have 10 minutes to show up for their scheduled match or they forfeit.\n6. Double elimination format means teams get a second chance after their first loss.',
  //   prizes: '1st Place: $500 and Championship Trophies\n2nd Place: $300\n3rd Place: $200',
  // },
];

export function getAllTournaments(): Tournament[] {
  return dummyTournaments;
}

export function getTournamentById(id: string): Tournament | undefined {
  return dummyTournaments.find(tournament => tournament.id === id);
}

export function addTournament(tournament: Tournament): Tournament[] {
  const updatedTournaments = [...dummyTournaments, tournament];
  return updatedTournaments;
}
