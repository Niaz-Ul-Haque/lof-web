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
