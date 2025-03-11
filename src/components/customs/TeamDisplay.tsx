'use client';

import React from 'react';
import { CustomMatch, Player } from '@/lib/types';
import { getRankName } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { RANK_DESCRIPTIONS } from '@/lib/constants';

interface TeamDisplayProps {
  match: CustomMatch;
  onReset: () => void;
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ match, onReset }) => {
  const { blueTeam, redTeam } = match;
  
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

  const renderPlayer = (player: Player, index: number) => (
    <tr key={player.name} className={index % 2 === 0 ? 'bg-dark-200' : 'bg-dark-100'}>
      <td className="py-2 px-4">{index + 1}</td>
      <td className="py-2 px-4 font-medium">{player.name}</td>
      <td className={`py-2 px-4 font-medium ${getRankColorClass(player.rank)}`}>
        {getRankName(player.rank as keyof typeof RANK_DESCRIPTIONS)}
      </td>
      {player.role && <td className="py-2 px-4">{player.role}</td>}
    </tr>
  );

  const generateOpggLink = (team: Player[]) => {
    const baseUrl = 'https://www.op.gg/multisearch/na?summoners=';
    const playerNames = team.map(player => encodeURIComponent(player.name)).join(',');
    return `${baseUrl}${playerNames}`;
  };

  const copyToClipboard = () => {
    let copyText = `BLUE TEAM - ${blueTeam.name} (Avg: ${blueTeam.averageRank.toFixed(2)})\n`;
    blueTeam.players.forEach((player, index) => {
      copyText += `${index + 1}. ${player.name} - ${getRankName(player.rank as keyof typeof RANK_DESCRIPTIONS)}${player.role ? ` (${player.role})` : ''}\n`;
    });
    
    copyText += `\nRED TEAM - ${redTeam.name} (Avg: ${redTeam.averageRank.toFixed(2)})\n`;
    redTeam.players.forEach((player, index) => {
      copyText += `${index + 1}. ${player.name} - ${getRankName(player.rank as keyof typeof RANK_DESCRIPTIONS)}${player.role ? ` (${player.role})` : ''}\n`;
    });
    
    navigator.clipboard.writeText(copyText)
      .then(() => {
        alert('Teams copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy teams: ', err);
      });
  };

  const hasRoles = blueTeam.players.some(player => player.role) || redTeam.players.some(player => player.role);

  return (
    <div className="bg-dark-100 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Generated Teams</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Blue Team */}
        <div className="bg-blue-900/20 border border-blue-900 rounded-lg overflow-hidden">
          <div className="bg-blue-900/40 p-4 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-blue-300">{blueTeam.name}</h3>
              <p className="text-blue-400 text-sm">Avg Rank: {blueTeam.averageRank.toFixed(2)}</p>
            </div>
            <a 
              href={generateOpggLink(blueTeam.players)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-white text-sm bg-blue-900/50 px-3 py-1 rounded"
            >
              OP.GG
            </a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark-300 text-left text-gray-400">
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Player</th>
                  <th className="py-2 px-4">Rank</th>
                  {hasRoles && <th className="py-2 px-4">Role</th>}
                </tr>
              </thead>
              <tbody>
                {blueTeam.players.map((player, index) => renderPlayer(player, index))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Red Team */}
        <div className="bg-red-900/20 border border-red-900 rounded-lg overflow-hidden">
          <div className="bg-red-900/40 p-4 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-red-300">{redTeam.name}</h3>
              <p className="text-red-400 text-sm">Avg Rank: {redTeam.averageRank.toFixed(2)}</p>
            </div>
            <a 
              href={generateOpggLink(redTeam.players)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-300 hover:text-white text-sm bg-red-900/50 px-3 py-1 rounded"
            >
              OP.GG
            </a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark-300 text-left text-gray-400">
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Player</th>
                  <th className="py-2 px-4">Rank</th>
                  {hasRoles && <th className="py-2 px-4">Role</th>}
                </tr>
              </thead>
              <tbody>
                {redTeam.players.map((player, index) => renderPlayer(player, index))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-4">
          <Button onClick={onReset} variant="primary">
            Generate New Teams
          </Button>
          
          <Button onClick={copyToClipboard} variant="outline">
            Copy to Clipboard
          </Button>
        </div>
        
        <p className="text-gray-400 text-sm">
          Team diff: {Math.abs(blueTeam.averageRank - redTeam.averageRank).toFixed(2)} points
        </p>
      </div>
    </div>
  );
};

export default TeamDisplay;