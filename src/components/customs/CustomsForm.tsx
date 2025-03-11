'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Button from '@/components/ui/Button';
import { Player, CustomMatch } from '@/lib/types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { generateBalancedTeams, generateTeamName } from '@/lib/teamGeneration';
import { getTierPoints, getRankName } from '@/lib/utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DEFAULT_TIER_POINTS, RANK_DESCRIPTIONS } from '@/lib/constants';

interface CustomsFormProps {
  onTeamsGenerated: (match: CustomMatch) => void;
}

export const CustomsForm: React.FC<CustomsFormProps> = ({ onTeamsGenerated }) => {
  const [players, setPlayers] = useState<Player[]>(
    Array(10)
      .fill(null)
      .map(() => ({ name: '', rank: '' }))
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [includeRoles, setIncludeRoles] = useState<boolean>(false);

  const handlePlayerChange = (index: number, field: keyof Player, value: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setPlayers(updatedPlayers);
    setError(null);
  };

  const handleGenerateTeams = () => {
    try {
      setIsGenerating(true);
      setError(null);

      const emptyNameIndex = players.findIndex(player => !player.name.trim());
      if (emptyNameIndex !== -1) {
        setError(`Player ${emptyNameIndex + 1} needs a name`);
        setIsGenerating(false);
        return;
      }

      const emptyRankIndex = players.findIndex(player => !player.rank);
      if (emptyRankIndex !== -1) {
        setError(`Player ${emptyRankIndex + 1} needs a rank`);
        setIsGenerating(false);
        return;
      }

      const names = players.map(player => player.name.trim().toLowerCase());
      const duplicateIndex = names.findIndex((name, index) => names.indexOf(name) !== index);
      if (duplicateIndex !== -1) {
        setError(`Duplicate name: ${players[duplicateIndex].name}`);
        setIsGenerating(false);
        return;
      }

      if (players.length !== 10) {
        setError('Team generation requires exactly 10 players');
        setIsGenerating(false);
        return;
      }

      const tierPoints = getTierPoints();

      const match = generateBalancedTeams(players, tierPoints);

      match.blueTeam.name = generateTeamName();
      match.redTeam.name = generateTeamName();

      onTeamsGenerated(match);
    } catch (err) {
      console.error('Error generating teams:', err);
      setError('Failed to generate teams. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  const fillTestData = () => {
    const testNames = [
      'ShadowBlade',
      'MoonStriker',
      'FrostFire',
      'ThunderGod',
      'NightWalker',
      'BloodRaven',
      'StormRider',
      'DragonFist',
      'PhantomSlayer',
      'WildHeart',
    ];

    const testRanks = ['B', 'S', 'G', 'G', 'P', 'D', 'P', 'E', 'S', 'G'];

    const testPlayers = testNames.map((name, index) => ({
      name,
      rank: testRanks[index],
      role: includeRoles ? ['TOP', 'JG', 'MID', 'BOT', 'SUP'][index % 5] : undefined,
    }));

    setPlayers(testPlayers);
    setError(null);
  };

  const resetForm = () => {
    setPlayers(
      Array(10)
        .fill(null)
        .map(() => ({ name: '', rank: '' }))
    );
    setError(null);
  };

  return (
    <div className="bg-dark-100 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center border-b border-dark-300 pb-3">
        Custom 5v5 Team Generator
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-md shadow-sm flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="mb-6 bg-dark-200/50 p-4 rounded-md shadow-inner">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeRoles"
            checked={includeRoles}
            onChange={e => setIncludeRoles(e.target.checked)}
            className="mr-2 h-5 w-5 text-teal focus:ring-gold rounded bg-dark-200 border-dark-300"
          />
          <label htmlFor="includeRoles" className="text-gray-300 font-medium">
            Include role preferences (optional)
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 mb-8">
        <div className="bg-dark-200/70 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-medium text-gray-300 mb-3 border-b border-dark-300 pb-2">
            Team 1
          </h3>
          <div className="space-y-3">
            {players.slice(0, 5).map((player, index) => (
              <div
                key={index}
                className="bg-dark-200 p-3 rounded-md border border-dark-300 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-400">Player {index + 1}</div>
                  {player.name && (
                    <div className="text-xs bg-dark-300 px-2 py-1 rounded-full">
                      {getRankName?.(player.rank as keyof typeof RANK_DESCRIPTIONS) || player.rank}
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <input
                    type="text"
                    value={player.name}
                    onChange={e => handlePlayerChange(index, 'name', e.target.value)}
                    placeholder="Player Name"
                    className="form-input w-full bg-dark-300 border-dark-300 text-white rounded text-sm py-1.5"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <select
                      value={player.rank}
                      onChange={e => handlePlayerChange(index, 'rank', e.target.value)}
                      className="form-select appearance-none bg-dark-300 border border-dark-400 focus:border-gray-500 text-white rounded text-sm py-1.5 px-3 pr-8 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                      required
                    >
                      <option value="" disabled selected>
                        Select rank...
                      </option>
                      {Object.entries(RANK_DESCRIPTIONS).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  {includeRoles && (
                    <div className="relative w-24">
                      <select
                        value={player.role || ''}
                        onChange={e => handlePlayerChange(index, 'role', e.target.value)}
                        className="form-select appearance-none bg-dark-300 border border-dark-400 focus:border-gray-500 text-white rounded text-sm py-1.5 px-3 pr-8 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                      >
                        <option value="">Any</option>
                        <option value="TOP">Top</option>
                        <option value="JG">Jungle</option>
                        <option value="MID">Mid</option>
                        <option value="BOT">Bot</option>
                        <option value="SUP">Support</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-200/70 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-medium text-gray-300 mb-3 border-b border-dark-300 pb-2">
            Team 2
          </h3>
          <div className="space-y-3">
            {players.slice(5, 10).map((player, index) => (
              <div
                key={index + 5}
                className="bg-dark-200 p-3 rounded-md border border-dark-300 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-400">Player {index + 6}</div>
                  {player.name && (
                    <div className="text-xs bg-dark-300 px-2 py-1 rounded-full">
                      {getRankName?.(player.rank as keyof typeof RANK_DESCRIPTIONS) || player.rank}
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <input
                    type="text"
                    value={player.name}
                    onChange={e => handlePlayerChange(index + 5, 'name', e.target.value)}
                    placeholder="Player Name"
                    className="form-input w-full bg-dark-300 border-dark-300 text-white rounded text-sm py-1.5"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <select
                      value={player.rank}
                      onChange={e => handlePlayerChange(index + 5, 'rank', e.target.value)}
                      className="form-select appearance-none bg-dark-300 border border-dark-400 focus:border-gray-500 text-white rounded text-sm py-1.5 px-3 pr-8 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                      required
                    >
                      <option value="" disabled selected>
                        Select rank...
                      </option>
                      {Object.entries(RANK_DESCRIPTIONS).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  {includeRoles && (
                    <div className="relative w-24">
                      <select
                        value={player.role || ''}
                        onChange={e => handlePlayerChange(index + 5, 'role', e.target.value)}
                        className="form-select appearance-none bg-dark-300 border border-dark-400 focus:border-gray-500 text-white rounded text-sm py-1.5 px-3 pr-8 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                      >
                        <option value="">Any</option>
                        <option value="TOP">Top</option>
                        <option value="JG">Jungle</option>
                        <option value="MID">Mid</option>
                        <option value="BOT">Bot</option>
                        <option value="SUP">Support</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 border-t border-dark-300 pt-4">
        <div className="flex space-x-3">
          <Button
            onClick={handleGenerateTeams}
            disabled={isGenerating}
            variant="primary"
            type="button"
            className="px-6 py-2.5"
          >
            {isGenerating ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Teams'
            )}
          </Button>

          <Button onClick={resetForm} variant="outline" type="button">
            Reset
          </Button>
        </div>

        <Button onClick={fillTestData} variant="text" type="button" className="text-sm">
          Fill Test Data
        </Button>
      </div>
    </div>
  );
};
