'use client';

import React, { useEffect, useState } from 'react';
import { CustomMatch, Player } from '@/lib/types';
import { getRankName, getTierPoints, calculatePlayerValue } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { RANK_DESCRIPTIONS } from '@/lib/constants';

interface TeamDisplayProps {
  match: CustomMatch;
  onReset: (entries?: any) => void;
  previousEntries: any;
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ match, onReset, previousEntries }) => {
  const { blueTeam, redTeam } = match;
  const [editingTeamNames, setEditingTeamNames] = useState({
    blueTeam: false,
    redTeam: false,
  });
  const [teamNames, setTeamNames] = useState({
    blueTeam: blueTeam.name || '',
    redTeam: redTeam.name || '',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localMatch, setLocalMatch] = useState(match);
  const [randomFactor, setRandomFactor] = useState(4);
  const [showRandomFactorInfo, setShowRandomFactorInfo] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('both');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getRankColorClass = (rank: string): string => {
    if (rank.includes('I')) return 'text-gray-400'; // Iron
    if (rank.includes('B')) return 'text-amber-800'; // Bronze
    if (rank.includes('S')) return 'text-gray-300'; // Silver
    if (rank.includes('G')) return 'text-yellow-500'; // Gold
    if (rank.includes('P')) return 'text-cyan-400'; // Platinum
    if (rank.includes('E')) return 'text-emerald-400'; // Emerald
    if (rank.includes('D')) return 'text-blue-400'; // Diamond
    if (rank.includes('M')) return 'text-purple-400'; // Master
    if (rank === 'GM') return 'text-red-400'; // Grandmaster
    if (rank === 'C') return 'text-orange-400'; // Challenger
    return 'text-white';
  };

  const getRankBgClass = (rank: string): string => {
    if (rank.includes('I')) return 'bg-gray-800'; // Iron
    if (rank.includes('B')) return 'bg-amber-950'; // Bronze
    if (rank.includes('S')) return 'bg-gray-700'; // Silver
    if (rank.includes('G')) return 'bg-yellow-900'; // Gold
    if (rank.includes('P')) return 'bg-cyan-900'; // Platinum
    if (rank.includes('E')) return 'bg-emerald-900'; // Emerald
    if (rank.includes('D')) return 'bg-blue-900'; // Diamond
    if (rank.includes('M')) return 'bg-purple-900'; // Master
    if (rank === 'GM') return 'bg-red-900'; // Grandmaster
    if (rank === 'C') return 'bg-orange-900'; // Challenger
    return 'bg-dark-300';
  };

  const handleTeamNameChange = (team: 'blueTeam' | 'redTeam', value: string) => {
    setTeamNames(prev => ({
      ...prev,
      [team]: value,
    }));

    if (team === 'blueTeam') {
      setLocalMatch(prev => ({
        ...prev,
        blueTeam: {
          ...prev.blueTeam,
          name: value,
        },
      }));
    } else {
      setLocalMatch(prev => ({
        ...prev,
        redTeam: {
          ...prev.redTeam,
          name: value,
        },
      }));
    }
  };

  const createFairTeams = (players: Player[]): [Player[], Player[]] => {
    const tierPoints = getTierPoints();
    const playersWithPoints = players.map(player => ({
      ...player,
      pointValue: calculatePlayerValue(player, tierPoints),
    }));

    if (localMatch.blueTeam.players.length > 0) {
      const factorRange = randomFactor / 100; 
      playersWithPoints.forEach(player => {
        const randomVariation = 1 - factorRange + Math.random() * factorRange * 2;
        player.pointValue = player.pointValue * randomVariation;
      });

      for (let i = playersWithPoints.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playersWithPoints[i], playersWithPoints[j]] = [playersWithPoints[j], playersWithPoints[i]];
      }
    }

    playersWithPoints.sort((a, b) => b.pointValue - a.pointValue);

    let team1: Player[] = [];
    let team2: Player[] = [];

    for (let i = 0; i < playersWithPoints.length; i++) {
      if (i % 2 === 0) {
        team1.push(playersWithPoints[i]);
      } else {
        team2.push(playersWithPoints[i]);
      }
    }

    let team1Points = team1.reduce((sum, player) => sum + (player.pointValue || 0), 0);
    let team2Points = team2.reduce((sum, player) => sum + (player.pointValue || 0), 0);

    for (let attempts = 0; attempts < 100; attempts++) {
      let improved = false;

      for (let i = 0; i < team1.length; i++) {
        for (let j = 0; j < team2.length; j++) {
          const currentDiff = Math.abs(team1Points - team2Points);

          const team1PlayerValue = team1[i].pointValue;
          const team2PlayerValue = team2[j].pointValue;
          const newTeam1Points = team1Points - (team1PlayerValue || 0) + (team2PlayerValue || 0);
          const newTeam2Points = team2Points - (team2PlayerValue || 0) + (team1PlayerValue || 0);
          const newDiff = Math.abs(newTeam1Points - newTeam2Points);

          if (newDiff < currentDiff) {
            const temp = team1[i];
            team1[i] = team2[j];
            team2[j] = temp;

            team1Points = newTeam1Points;
            team2Points = newTeam2Points;

            improved = true;
            break;
          }
        }

        if (improved) break;
      }

      if (!improved) break;
    }

    return [team1, team2];
  };

  const handleRefreshTeams = () => {
    if (!previousEntries || !previousEntries.players) return;

    try {
      setIsRefreshing(true);

      const allPlayers = [...previousEntries.players];

      const [newBlueTeamPlayers, newRedTeamPlayers] = createFairTeams(allPlayers);

      const tierPoints = getTierPoints();
      const bluePointsTotal = newBlueTeamPlayers.reduce(
        (sum, player) => sum + calculatePlayerValue(player, tierPoints),
        0
      );
      const redPointsTotal = newRedTeamPlayers.reduce(
        (sum, player) => sum + calculatePlayerValue(player, tierPoints),
        0
      );

      const blueAverage = bluePointsTotal / newBlueTeamPlayers.length;
      const redAverage = redPointsTotal / newRedTeamPlayers.length;

      const newBlueTeam = {
        ...localMatch.blueTeam,
        players: newBlueTeamPlayers,
        averageRank: blueAverage,
      };

      const newRedTeam = {
        ...localMatch.redTeam,
        players: newRedTeamPlayers,
        averageRank: redAverage,
      };

      setLocalMatch({
        ...localMatch,
        blueTeam: newBlueTeam,
        redTeam: newRedTeam,
      });

      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    } catch (error) {
      console.error('Error regenerating teams:', error);
      setIsRefreshing(false);
    }
  };

  const renderPlayer = (player: Player, index: number, teamType: 'blue' | 'red') => {
    const bgColor = teamType === 'blue' ? 'bg-blue-900/10' : 'bg-red-900/10';
    const hoverColor = teamType === 'blue' ? 'hover:bg-blue-900/20' : 'hover:bg-red-900/20';

    return (
      <div
        key={`${player.name}-${index}`}
        className={`${bgColor} ${hoverColor} rounded-lg p-3 mb-2 flex items-center transition-all duration-200`}
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-300 mr-3 text-sm font-bold">
          {index + 1}
        </div>
        <div className="flex-grow">
          <div className="font-medium">{player.name}</div>
          <div className="flex items-center space-x-2 text-sm">
            <span
              className={`${getRankColorClass(player.rank)} px-2 py-0.5 rounded ${getRankBgClass(player.rank)}`}
            >
              {getRankName(player.rank as keyof typeof RANK_DESCRIPTIONS)}
            </span>
            {player.role && <span className="text-gray-400">{player.role}</span>}
          </div>
        </div>
      </div>
    );
  };

  const generateOpggLink = (team: Player[]) => {
    const baseUrl = 'https://www.op.gg/multisearch/na?summoners=';
    const playerNames = team.map(player => encodeURIComponent(player.name)).join(',');
    return `${baseUrl}${playerNames}`;
  };

  const copyToClipboard = () => {
    let copyText = `BLUE TEAM - ${localMatch.blueTeam.name} (Avg: ${localMatch.blueTeam.averageRank.toFixed(2)})\n`;
    localMatch.blueTeam.players.forEach((player, index) => {
      copyText += `${index + 1}. ${player.name} - ${getRankName(player.rank as keyof typeof RANK_DESCRIPTIONS)}${player.role ? ` (${player.role})` : ''}\n`;
    });

    copyText += `\nRED TEAM - ${localMatch.redTeam.name} (Avg: ${localMatch.redTeam.averageRank.toFixed(2)})\n`;
    localMatch.redTeam.players.forEach((player, index) => {
      copyText += `${index + 1}. ${player.name} - ${getRankName(player.rank as keyof typeof RANK_DESCRIPTIONS)}${player.role ? ` (${player.role})` : ''}\n`;
    });

    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        alert('Teams copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy teams: ', err);
      });
  };

  const handleBackToForm = () => {
    if (previousEntries && previousEntries.players) {
      const processedPlayers = previousEntries.players.map((player: { name: any }) => {
        const name = player.name;
        const tagMatch = name.match(/(#\w+)$/);

        return {
          ...player,
          name: tagMatch ? name.replace(tagMatch[0], '') : name,
          tag: tagMatch ? tagMatch[0] : '',
        };
      });

      const updatedEntries = {
        ...previousEntries,
        players: processedPlayers,
      };

      onReset(updatedEntries);
    } else {
      onReset();
    }
  };

  const hasRoles =
    localMatch.blueTeam.players.some(player => player.role) ||
    localMatch.redTeam.players.some(player => player.role);

  const teamDiff = Math.abs(
    localMatch.blueTeam.averageRank - localMatch.redTeam.averageRank
  ).toFixed(2);
  const teamDiffClass =
    parseFloat(teamDiff) < 1
      ? 'text-green-400'
      : parseFloat(teamDiff) < 2
        ? 'text-yellow-400'
        : 'text-red-400';

  return (
    <div className="bg-dark-100 rounded-lg shadow-lg p-4 md:p-6">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
  <h2 className="text-2xl font-bold text-white flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mr-2 text-blue-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
    Team Matchup
  </h2>

  <div className="flex items-center space-x-3">
    <Button
      onClick={handleBackToForm}
      variant="outline"
      className="flex items-center text-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back
    </Button>

    {isClient && (
      <div className="flex items-center">
        <div className="flex items-center bg-dark-300 rounded overflow-hidden">
          <input
            type="text"
            placeholder="4"
            value={randomFactor}
            onChange={e => {
              const value = e.target.value === '' ? '' : parseInt(e.target.value);
              setRandomFactor(value as number);
            }}
            onBlur={e => {
              const value =
                e.target.value === ''
                  ? 4
                  : Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
              setRandomFactor(value as number);
            }}
            className="w-12 bg-dark-300 border-y border-l border-gold text-white rounded-l text-xs py-1.5 px-2 text-center focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          <span className="bg-dark-400 text-gray-300 text-xs py-1.5 px-2 border-y border-r border-gold">
            %
          </span>
        </div>
        <div className="relative ml-2">
          <button
            onClick={() => setShowRandomFactorInfo(!showRandomFactorInfo)}
            className="text-gray-400 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {showRandomFactorInfo && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-dark-300 border border-dark-400 rounded p-2 text-xs text-gray-300 z-10 shadow-lg">
              Randomness factor for team reshuffling. Higher values create more varied teams,
              but may be less balanced.
            </div>
          )}
        </div>
      </div>
    )}

    <Button
      onClick={handleRefreshTeams}
      disabled={isRefreshing}
      variant="outline"
      className="flex items-center text-sm bg-gradient-to-r from-blue-900/30 to-red-900/30 hover:from-blue-900/50 hover:to-red-900/50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Re-shuffle
    </Button>
  </div>
</div>

      <div className="bg-dark-200 rounded-lg p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
          <span className="text-gray-300">Team Balance:</span>
          <span className={`ml-2 font-bold ${teamDiffClass}`}>{teamDiff} points</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-400">Blue Avg:</span>
          <span className="text-blue-300 font-medium">
            {localMatch.blueTeam.averageRank.toFixed(2)}
          </span>
          <span className="text-xs text-gray-400">Red Avg:</span>
          <span className="text-red-300 font-medium">
            {localMatch.redTeam.averageRank.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="sm:hidden mb-4">
        <div className="flex rounded-lg overflow-hidden bg-dark-300">
          <button
            onClick={() => setActiveTab('blue')}
            className={`flex-1 py-2 font-medium text-sm ${
              activeTab === 'blue' ? 'bg-blue-900/40 text-blue-300' : 'text-gray-400'
            }`}
          >
            Blue Team
          </button>
          <button
            onClick={() => setActiveTab('both')}
            className={`flex-1 py-2 font-medium text-sm ${
              activeTab === 'both' ? 'bg-purple-900/20 text-purple-300' : 'text-gray-400'
            }`}
          >
            Both
          </button>
          <button
            onClick={() => setActiveTab('red')}
            className={`flex-1 py-2 font-medium text-sm ${
              activeTab === 'red' ? 'bg-red-900/40 text-red-300' : 'text-gray-400'
            }`}
          >
            Red Team
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {(activeTab === 'blue' || activeTab === 'both') && (
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-900/50 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-blue-900/30 p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-grow items-center">
                  {editingTeamNames.blueTeam ? (
                    <input
                      type="text"
                      value={teamNames.blueTeam}
                      onChange={e => handleTeamNameChange('blueTeam', e.target.value)}
                      className="bg-blue-900/50 text-white border border-blue-800 rounded px-2 py-1 w-full"
                      onBlur={() => setEditingTeamNames(prev => ({ ...prev, blueTeam: false }))}
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center">
                      <div className="mr-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <h3 className="text-xl font-bold text-blue-300">
                          {localMatch.blueTeam.name}
                        </h3>
                        <button
                          onClick={() => setEditingTeamNames(prev => ({ ...prev, blueTeam: true }))}
                          className="text-blue-400 hover:text-white mt-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mx-auto"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <a
                  href={generateOpggLink(localMatch.blueTeam.players)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-full text-xs px-3 py-1 flex items-center transition-colors ml-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  OP.GG
                </a>
              </div>
            </div>

            <div className="p-4">
              {localMatch.blueTeam.players.map((player, index) =>
                renderPlayer(player, index, 'blue')
              )}
            </div>
          </div>
        )}

        {(activeTab === 'red' || activeTab === 'both') && (
          <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-900/50 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-red-900/30 p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-grow items-center">
                  {editingTeamNames.redTeam ? (
                    <input
                      type="text"
                      value={teamNames.redTeam}
                      onChange={e => handleTeamNameChange('redTeam', e.target.value)}
                      className="bg-red-900/50 text-white border border-red-800 rounded px-2 py-1 w-full"
                      onBlur={() => setEditingTeamNames(prev => ({ ...prev, redTeam: false }))}
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center">
                      <div className="mr-2 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <h3 className="text-xl font-bold text-red-300">
                          {localMatch.redTeam.name}
                        </h3>
                        <button
                          onClick={() => setEditingTeamNames(prev => ({ ...prev, redTeam: true }))}
                          className="text-red-400 hover:text-white mt-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mx-auto"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <a
                  href={generateOpggLink(localMatch.redTeam.players)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-full text-xs px-3 py-1 flex items-center transition-colors ml-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  OP.GG
                </a>
              </div>
            </div>

            <div className="p-4">
              {localMatch.redTeam.players.map((player, index) =>
                renderPlayer(player, index, 'red')
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
  <div className="flex flex-wrap gap-3 w-full sm:w-auto">
    <Button
      onClick={() => onReset(null)}
      variant="primary"
      className="bg-[#51b6ca] border-[#51b6ca] hover:bg-[#41a6ba] hover:border-[#41a6ba] flex flex-row items-center py-2 px-4 w-full sm:w-auto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>Generate New Teams</span>
    </Button>

    <Button
      onClick={copyToClipboard}
      variant="outline"
      className="flex items-center gap-2 w-full sm:w-auto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
      </svg>
      <span>Copy to Clipboard</span>
    </Button>
  </div>
</div>
    </div>
  );
};

export default TeamDisplay;
