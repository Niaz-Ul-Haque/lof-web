import { DEFAULT_TIER_POINTS, RANK_DESCRIPTIONS } from './constants';
import { Player, TierPoints } from './types';

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export function getTierPoints(): TierPoints {
  if (typeof window === 'undefined') {
    return DEFAULT_TIER_POINTS;
  }

  const storedPoints = localStorage.getItem('tierPoints');
  return storedPoints ? JSON.parse(storedPoints) : DEFAULT_TIER_POINTS;
}

export const calculatePlayerValue = (
  player: Player,
  tierPoints: Record<string, number>
): number => {
  if (!player.rank || !tierPoints[player.rank]) {
    return 0;
  }

  return tierPoints[player.rank];
};

export function calculateTeamAverage(team: Player[], tierPoints: TierPoints): number {
  if (team.length === 0) return 0;

  const total = team.reduce((sum, player) => sum + calculatePlayerValue(player, tierPoints), 0);

  return total / team.length;
}

export function getRankName(rankCode: keyof typeof RANK_DESCRIPTIONS): string {
  return RANK_DESCRIPTIONS[rankCode] || rankCode;
}

export function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
