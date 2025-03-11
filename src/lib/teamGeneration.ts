// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { max } from 'three/examples/jsm/nodes/Nodes.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Player, Team, CustomMatch, TierPoints } from './types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { calculatePlayerValue, calculateTeamAverage, shuffleArray } from './utils';

export function generateBalancedTeams(players: Player[], tierPoints: TierPoints): CustomMatch {
  if (players.length !== 10) {
    throw new Error('Team generation requires exactly 10 players');
  }

  const totalValue = players.reduce(
    (sum, player) => sum + calculatePlayerValue(player, tierPoints),
    0
  );
  const idealTeamValue = totalValue / 2;

  const sortedPlayers = [...players].sort(
    (a, b) => calculatePlayerValue(b, tierPoints) - calculatePlayerValue(a, tierPoints)
  );

  const teamA: Player[] = [];
  const teamB: Player[] = [];

  teamA.push(sortedPlayers[0]);
  teamB.push(sortedPlayers[1]);
  teamB.push(sortedPlayers[2]);
  teamA.push(sortedPlayers[3]);

  const remainingPlayers = sortedPlayers.slice(4);

  const shuffledRemaining = shuffleArray(remainingPlayers);

  for (const player of shuffledRemaining) {
    const teamAValue = calculateTeamAverage([...teamA, player], tierPoints) * (teamA.length + 1);
    const teamBValue = calculateTeamAverage([...teamB, player], tierPoints) * (teamB.length + 1);

    const teamADiff = Math.abs(teamAValue - idealTeamValue);
    const teamBDiff = Math.abs(teamBValue - idealTeamValue);

    if (teamADiff <= teamBDiff && teamA.length < 5) {
      teamA.push(player);
    } else if (teamB.length < 5) {
      teamB.push(player);
    } else {
      teamA.push(player);
    }
  }

  if (teamA.length !== 5 || teamB.length !== 5) {
    const allPlayers = [...teamA, ...teamB];
    teamA.length = 0;
    teamB.length = 0;

    for (let i = 0; i < allPlayers.length; i++) {
      if (i < 5) {
        teamA.push(allPlayers[i]);
      } else {
        teamB.push(allPlayers[i]);
      }
    }
  }

  let bestDifference = Math.abs(
    calculateTeamAverage(teamA, tierPoints) - calculateTeamAverage(teamB, tierPoints)
  );

  let attempts = 0;
  const maxAttempts = 100;
  while (bestDifference > 0.5 && attempts < maxAttempts) {
    attempts++;

    for (let i = 0; i < teamA.length; i++) {
      for (let j = 0; j < teamB.length; j++) {
        const newTeamA = [...teamA];
        const newTeamB = [...teamB];

        newTeamA[i] = teamB[j];
        newTeamB[j] = teamA[i];

        const newDifference = Math.abs(
          calculateTeamAverage(newTeamA, tierPoints) - calculateTeamAverage(newTeamB, tierPoints)
        );

        if (newDifference < bestDifference) {
          teamA[i] = teamB[j];
          teamB[j] = newTeamA[i];
          bestDifference = newDifference;
        }
      }
    }

    if (
      bestDifference ===
      Math.abs(calculateTeamAverage(teamA, tierPoints) - calculateTeamAverage(teamB, tierPoints))
    ) {
      break;
    }
  }

  console.assert(teamA.length === 5, 'Team A must have exactly 5 players');
  console.assert(teamB.length === 5, 'Team B must have exactly 5 players');

  const isTeamABlue = Math.random() > 0.5;

  const blueTeam: Team = {
    players: isTeamABlue ? teamA : teamB,
    averageRank: isTeamABlue
      ? calculateTeamAverage(teamA, tierPoints)
      : calculateTeamAverage(teamB, tierPoints),
  };

  const redTeam: Team = {
    players: isTeamABlue ? teamB : teamA,
    averageRank: isTeamABlue
      ? calculateTeamAverage(teamB, tierPoints)
      : calculateTeamAverage(teamA, tierPoints),
  };

  return {
    blueTeam,
    redTeam,
  };
}

/**
 * Generate random team names for fun
 */
export function generateTeamName(): string {
  const adjectives = [
    'Mighty',
    'Fearless',
    'Savage',
    'Divine',
    'Elite',
    'Blazing',
    'Thunder',
    'Mystic',
    'Shadow',
    'Infernal',
  ];

  const nouns = [
    'Dragons',
    'Wolves',
    'Titans',
    'Legends',
    'Guardians',
    'Phoenix',
    'Knights',
    'Demons',
    'Warriors',
    'Assassins',
  ];

  const adjIndex = Math.floor(Math.random() * adjectives.length);
  const nounIndex = Math.floor(Math.random() * nouns.length);

  return `${adjectives[adjIndex]} ${nouns[nounIndex]}`;
}
