export interface Player {
  id?: string;
  name: string;
  rank: string;
  role?: string;
}

export interface Team {
  name?: string;
  players: Player[];
  averageRank: number;
}

export interface CustomMatch {
  id?: string;
  createdAt?: string;
  blueTeam: Team;
  redTeam: Team;
}

export interface TournamentTeam {
  id?: string;
  name: string;
  players: Player[];
  logo?: string;
}

export interface TournamentMatch {
  id?: string;
  team1Id: string;
  team2Id: string;
  winnerId?: string;
  score?: string;
  round: number;
  matchNumber: number;
}

export interface Tournament {
  id?: string;
  name: string;
  description: string;
  format: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  teams: TournamentTeam[];
  matches: TournamentMatch[];
  detailedDescription?: string;
  poster?: string;
  flyer?: string;
  videoLink?: string;
  sponsors?: Sponsor[];
  rules?: string;
  prizes?: string;
  registerLink?: string;
}

export interface Announcement {
  id?: string;
  title: string;
  content: string;
  date: string;
  pinned?: boolean;
}

export interface Sponsor {
  id?: string;
  name: string;
  description?: string;
  logo: string;
  url?: string;
}

export interface ContentMedia {
  id?: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  createdAt: string;
}

export interface FeedbackSubmission {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface UseLocalStorageOptions<T> {
  defaultValue: T;
  key: string;
}

export type TierPoints = Record<string, number>;
