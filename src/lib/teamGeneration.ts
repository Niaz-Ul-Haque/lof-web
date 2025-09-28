import { Player } from './types';
import { calculatePlayerValue } from './utils';

export const generateBalancedTeams = (players: Player[], tierPoints: Record<string, number>) => {
  const playersWithIds = players.map(player => ({
    ...player,
    id: player.id || `${player.name}-${Math.random().toString(36).substr(2, 9)}`,
  }));

  const playerMap = new Map();
  playersWithIds.forEach(player => {
    playerMap.set(player.id, player);
  });

  if (playerMap.size !== 10) {
    console.error('Need exactly 10 unique players for team generation');
    throw new Error('Need exactly 10 unique players for team generation');
  }
  const uniquePlayers = Array.from(playerMap.values());
  const sortedPlayers = [...uniquePlayers].sort((a, b) => {
    const aPoints = a.points || calculatePlayerValue(a, tierPoints);
    const bPoints = b.points || calculatePlayerValue(b, tierPoints);
    return bPoints - aPoints;
  });

  const blueTeam: Player[] = [];
  const redTeam: Player[] = [];

  for (let i = 0; i < sortedPlayers.length; i++) {
    if (i % 2 === 0) {
      blueTeam.push(sortedPlayers[i]);
    } else {
      redTeam.push(sortedPlayers[i]);
    }
  }

  let blueTeamValue = blueTeam.reduce((sum, player) => {
    return sum + (player.points || calculatePlayerValue(player, tierPoints));
  }, 0);

  let redTeamValue = redTeam.reduce((sum, player) => {
    return sum + (player.points || calculatePlayerValue(player, tierPoints));
  }, 0);

  for (let attempts = 0; attempts < 100; attempts++) {
    let improved = false;

    for (let i = 0; i < blueTeam.length; i++) {
      for (let j = 0; j < redTeam.length; j++) {
        const currentDiff = Math.abs(blueTeamValue - redTeamValue);

        const bluePlayerValue = blueTeam[i].points || calculatePlayerValue(blueTeam[i], tierPoints);
        const redPlayerValue = redTeam[j].points || calculatePlayerValue(redTeam[j], tierPoints);

        const newBlueTeamValue = blueTeamValue - bluePlayerValue + redPlayerValue;
        const newRedTeamValue = redTeamValue - redPlayerValue + bluePlayerValue;

        const newDiff = Math.abs(newBlueTeamValue - newRedTeamValue);

        if (newDiff < currentDiff) {
          const temp = blueTeam[i];
          blueTeam[i] = redTeam[j];
          redTeam[j] = temp;

          blueTeamValue = newBlueTeamValue;
          redTeamValue = newRedTeamValue;

          improved = true;
          break;
        }
      }

      if (improved) break;
    }

    if (!improved) break;
  }

  const blueAverage = blueTeamValue / blueTeam.length;
  const redAverage = redTeamValue / redTeam.length;

  return {
    blueTeam: {
      name: '',
      players: blueTeam,
      averageRank: blueAverage,
    },
    redTeam: {
      name: '',
      players: redTeam,
      averageRank: redAverage,
    },
  };
};

export function generateTeamName(): string {
  const adjectives = [
    "Goon's",
    "Trump's",
    "Trudeau's",
    "Carney's",
    "Kamala's",
    "JD Vance's",
    "Elon's",
    "Putin's",
    "Erdogan's",
    "Kanye's",
  ];

  const nouns = [
    'Goons',
    'Panties',
    'PeePee',
    'Liberal',
    'Skibidi',
    'Phoenixes',
    'Conservatives',
    'Crocs',
    'Socks',
    'Daddy',
  ];

  const adjIndex = Math.floor(Math.random() * adjectives.length);
  const nounIndex = Math.floor(Math.random() * nouns.length);

  return `${adjectives[adjIndex]} ${nouns[nounIndex]}`;
}

// Draft-related functions for Captains Mode
export function selectCaptainsAuto(
  players: Player[], 
  similarityWindow: number,
  tierPoints: Record<string, number>
): [Player, Player] {
  const CANDIDATE_WINDOW = 5;
  
  // Map players to points and sort by points descending
  const playersWithPoints = players.map(player => ({
    player,
    points: calculatePlayerValue(player, tierPoints),
  })).sort((a, b) => b.points - a.points);

  // Get top candidates
  const candidates = playersWithPoints.slice(0, Math.min(CANDIDATE_WINDOW, players.length));
  
  let bestPair: [Player, Player] | null = null;
  let minDelta = Infinity;
  let maxCombinedPoints = -1;

  // Find the best pair within similarity window
  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const deltaPoints = Math.abs(candidates[i].points - candidates[j].points);
      const combinedPoints = candidates[i].points + candidates[j].points;
      
      if (deltaPoints <= similarityWindow) {
        if (deltaPoints < minDelta || 
            (deltaPoints === minDelta && combinedPoints > maxCombinedPoints)) {
          bestPair = [candidates[i].player, candidates[j].player];
          minDelta = deltaPoints;
          maxCombinedPoints = combinedPoints;
        }
      }
    }
  }

  // If no pair found within window, widen the search
  if (!bestPair) {
    const widenedWindows = [similarityWindow * 1.5, similarityWindow * 2];
    
    for (const window of widenedWindows) {
      for (let i = 0; i < candidates.length; i++) {
        for (let j = i + 1; j < candidates.length; j++) {
          const deltaPoints = Math.abs(candidates[i].points - candidates[j].points);
          const combinedPoints = candidates[i].points + candidates[j].points;
          
          if (deltaPoints <= window) {
            if (deltaPoints < minDelta || 
                (deltaPoints === minDelta && combinedPoints > maxCombinedPoints)) {
              bestPair = [candidates[i].player, candidates[j].player];
              minDelta = deltaPoints;
              maxCombinedPoints = combinedPoints;
            }
          }
        }
      }
      if (bestPair) break;
    }
  }

  // If still no pair found, take the top two
  if (!bestPair) {
    bestPair = [candidates[0].player, candidates[1].player];
  }

  // Sort by name for consistency
  bestPair.sort((a, b) => a.name.localeCompare(b.name));
  
  return bestPair;
}

export function expandPickOrder(pickOrder: string, firstPick: 'A' | 'B' | 'coin'): Array<'A' | 'B'> {
  const resolvedFirstPick: 'A' | 'B' = firstPick === 'coin' 
    ? (Math.random() < 0.5 ? 'A' : 'B') 
    : firstPick;
  
  const tokens = pickOrder.split('-').map(token => parseInt(token.trim()));
  const queue: Array<'A' | 'B'> = [];
  
  let currentTeam: 'A' | 'B' = resolvedFirstPick;
  
  for (const count of tokens) {
    for (let i = 0; i < count; i++) {
      queue.push(currentTeam);
    }
    currentTeam = currentTeam === 'A' ? 'B' : 'A';
  }
  
  return queue;
}

export function validatePickOrder(pickOrder: string, expectedPicks: number = 8): boolean {
  try {
    const tokens = pickOrder.split('-').map(token => parseInt(token.trim()));
    const totalPicks = tokens.reduce((sum, count) => sum + count, 0);
    return totalPicks === expectedPicks && tokens.every(count => count > 0);
  } catch {
    return false;
  }
}

export function selectBestFitPlayer(
  pool: Player[], 
  teamA: Player[], 
  teamB: Player[], 
  currentTeam: 'A' | 'B',
  tierPoints: Record<string, number>
): Player {
  if (pool.length === 0) {
    throw new Error('No players available in pool');
  }

  const currentTeamPlayers = currentTeam === 'A' ? teamA : teamB;
  const opposingTeamPlayers = currentTeam === 'A' ? teamB : teamA;
  
  const currentTeamTotal = currentTeamPlayers.reduce((sum, player) => 
    sum + calculatePlayerValue(player, tierPoints), 0);
  const opposingTeamTotal = opposingTeamPlayers.reduce((sum, player) => 
    sum + calculatePlayerValue(player, tierPoints), 0);

  let bestPlayer = pool[0];
  let minDelta = Infinity;
  let highestPoints = -1;

  for (const player of pool) {
    const playerPoints = calculatePlayerValue(player, tierPoints);
    const newCurrentTotal = currentTeamTotal + playerPoints;
    const delta = Math.abs(newCurrentTotal - opposingTeamTotal);
    
    if (delta < minDelta || (delta === minDelta && playerPoints > highestPoints)) {
      bestPlayer = player;
      minDelta = delta;
      highestPoints = playerPoints;
    }
  }

  return bestPlayer;
}

export function selectHighestMMRPlayer(pool: Player[], tierPoints: Record<string, number>): Player {
  if (pool.length === 0) {
    throw new Error('No players available in pool');
  }

  return pool.reduce((highest, current) => {
    const currentPoints = calculatePlayerValue(current, tierPoints);
    const highestPoints = calculatePlayerValue(highest, tierPoints);
    return currentPoints > highestPoints ? current : highest;
  });
}

export function selectRandomTop3Player(pool: Player[], tierPoints: Record<string, number>): Player {
  if (pool.length === 0) {
    throw new Error('No players available in pool');
  }

  const sortedPool = [...pool].sort((a, b) => {
    const aPoints = calculatePlayerValue(a, tierPoints);
    const bPoints = calculatePlayerValue(b, tierPoints);
    return bPoints - aPoints;
  });

  const top3 = sortedPool.slice(0, Math.min(3, sortedPool.length));
  return top3[Math.floor(Math.random() * top3.length)];
}
