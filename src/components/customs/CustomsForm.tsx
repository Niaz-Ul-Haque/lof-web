/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Player, CustomMatch } from '@/lib/types';
import { generateBalancedTeams, generateTeamName } from '@/lib/teamGeneration';
import { getTierPoints, getRankName, calculatePlayerValue } from '@/lib/utils';
import { DEFAULT_TIER_POINTS, RANK_DESCRIPTIONS } from '@/lib/constants';

interface CustomsFormProps {
  onTeamsGenerated: (match: CustomMatch, entries: any) => void;
  previousData?: any;
}

interface ExtendedPlayer extends Player {
  tag?: string;
}

export const CustomsForm: React.FC<CustomsFormProps> = ({ onTeamsGenerated, previousData }) => {
  const [players, setPlayers] = useState<ExtendedPlayer[]>(
    previousData?.players ||
      Array(10)
        .fill(null)
        .map(() => ({ name: '', rank: '', tag: '' }))
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [includeRoles, setIncludeRoles] = useState<boolean>(previousData?.includeRoles || false);
  const [teamNames, setTeamNames] = useState({
    blueTeam: previousData?.teamNames?.blueTeam || '',
    redTeam: previousData?.teamNames?.redTeam || '',
  });
  const [editingTeamName, setEditingTeamName] = useState({
    blueTeam: false,
    redTeam: false,
  });
  const [tagInputFocused, setTagInputFocused] = useState<number[]>([]);

  useEffect(() => {
    const updatedPlayers = [...players];
    let changed = false;

    updatedPlayers.forEach((player, index) => {
      if (tagInputFocused.includes(index) && (player.tag === undefined || player.tag === '')) {
        updatedPlayers[index] = { ...player, tag: '#' };
        changed = true;
      }
    });

    if (changed) {
      setPlayers(updatedPlayers);
    }
  }, [tagInputFocused]);

  const handlePlayerChange = (index: number, field: keyof ExtendedPlayer, value: string) => {
    const updatedPlayers = [...players];

    if (field === 'tag') {
      if (!value.startsWith('#')) {
        value = '#' + value;
      }

      const tagContent = value.substring(1);

      if (tagContent.length > 5) {
        value = '#' + tagContent.substring(0, 5);
      }
    }

    if (field === 'name' && value.length > 16) {
      value = value.substring(0, 16);
    }

    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setPlayers(updatedPlayers);
    setErrors([]);
  };

  const handleTagInputFocus = (index: number) => {
    setTagInputFocused(prev => [...prev, index]);

    const player = players[index];
    if (!player.tag) {
      const updatedPlayers = [...players];
      updatedPlayers[index] = { ...updatedPlayers[index], tag: '#' };
      setPlayers(updatedPlayers);
    }
  };

  const validatePlayerFields = () => {
    const validationErrors = [];

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      if (!player.name.trim()) continue;

      if (player.name.trim().length < 3 || player.name.trim().length > 16) {
        validationErrors.push(`Player ${i + 1}'s name must be 3-16 characters long`);
      }

      const tagContent = player.tag ? player.tag.substring(1) : '';
      if (tagContent && (tagContent.length < 2 || tagContent.length > 5)) {
        validationErrors.push(`Player ${i + 1}'s tag must be 3-5 characters long (after #)`);
      }
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleGenerateTeams = () => {
    try {
      setIsGenerating(true);
      setErrors([]);

      const validationErrors = [];

      if (!validatePlayerFields()) {
        setIsGenerating(false);
        return;
      }

      const emptyNameIndex = players.findIndex(player => !player.name.trim());
      if (emptyNameIndex !== -1) {
        validationErrors.push(`Player ${emptyNameIndex + 1} needs a name`);
      }

      const emptyRankIndex = players.findIndex(player => !player.rank);
      if (emptyRankIndex !== -1) {
        validationErrors.push(`Player ${emptyRankIndex + 1} needs a rank`);
      }

      const processedPlayers = players.map(player => {
        const tagTrimmed = player.tag ? player.tag.trim() : '';
        const fullName = tagTrimmed ? `${player.name.trim()}${tagTrimmed}` : player.name.trim();

        const tierPoints = getTierPoints();
        const pointValue = calculatePlayerValue({ ...player, name: fullName }, tierPoints);

        return {
          ...player,
          name: fullName,
          points: pointValue,
        };
      });

      const names = processedPlayers.map(player => player.name.toLowerCase());
      const duplicateNameIndices = names
        .map((name, index) => (names.indexOf(name) !== index ? index : -1))
        .filter(idx => idx !== -1);

      if (duplicateNameIndices.length > 0) {
        duplicateNameIndices.forEach(index => {
          validationErrors.push(`Duplicate name: ${processedPlayers[index].name}`);
        });
      }

      if (players.length !== 10) {
        validationErrors.push('Team generation requires exactly 10 players');
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsGenerating(false);
        return;
      }

      const tierPoints = getTierPoints();

      const match = generateBalancedTeams(processedPlayers, tierPoints);

      match.blueTeam.name = teamNames.blueTeam || generateTeamName();
      match.redTeam.name = teamNames.redTeam || generateTeamName();

      const formEntries = {
        players: processedPlayers,
        includeRoles: includeRoles,
        teamNames: {
          blueTeam: match.blueTeam.name,
          redTeam: match.redTeam.name,
        },
      };

      onTeamsGenerated(match, formEntries);
    } catch (err) {
      console.error('Error generating teams:', err);
      setErrors(['Failed to generate teams. Please try again.']);
    } finally {
      setIsGenerating(false);
    }
  };

  const fillTestData = () => {
    const testNames = [
      'AsahiKen',
      'Batman',
      'JuanTheGamer183',
      'Quixxy',
      'WreckBoy',
      'theshadowvoid',
      'Gato0083',
      'DinoNugQueen',
      'PhantomSlayer',
      'WildHeart',
    ];

    const testTags = [
      '#NA1',
      '#EUW',
      '#OCE',
      '#EUNE',
      '#LAN',
      '#JP',
      '#TR',
      '#RU',
      '#KR',
      '#LCK',
    ];

    const testRanks = ['B', 'S', 'G', 'G', 'P', 'D', 'P', 'E', 'S', 'G'];

    const testPlayers = testNames.map((name, index) => ({
      name,
      tag: testTags[index],
      rank: testRanks[index],
      role: includeRoles ? ['TOP', 'JG', 'MID', 'BOT', 'SUP'][index % 5] : undefined,
    }));

    setPlayers(testPlayers);
    setErrors([]);
  };

  const resetForm = () => {
    setPlayers(
      Array(10)
        .fill(null)
        .map(() => ({ name: '', rank: '', tag: '' }))
    );
    setErrors([]);
    setTeamNames({
      blueTeam: '',
      redTeam: '',
    });
    setEditingTeamName({
      blueTeam: false,
      redTeam: false,
    });
    setTagInputFocused([]);
  };

  const handleTeamNameChange = (team: 'blueTeam' | 'redTeam', value: string) => {
    setTeamNames(prev => ({
      ...prev,
      [team]: value,
    }));
  };

  return (
    <div className="bg-dark-100 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center border-b border-dark-300 pb-3">
        Custom 5v5 Team Generator
      </h2>

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

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-900/20 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-blue-300 font-medium">Blue Team Name (Optional)</h3>
              <button
                onClick={() => setEditingTeamName(prev => ({ ...prev, blueTeam: !prev.blueTeam }))}
                className="text-blue-300 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>

            {editingTeamName.blueTeam ? (
              <input
                type="text"
                value={teamNames.blueTeam}
                onChange={e => handleTeamNameChange('blueTeam', e.target.value)}
                placeholder="Enter team name (or leave empty for random)"
                className="mt-2 w-full bg-dark-300 border-dark-300 text-white rounded text-sm py-1.5 px-2"
              />
            ) : (
              <p className="text-gray-400 text-sm mt-2">
                {teamNames.blueTeam || 'Random name will be generated'}
              </p>
            )}
          </div>

          <div className="bg-red-900/20 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-red-300 font-medium">Red Team Name (Optional)</h3>
              <button
                onClick={() => setEditingTeamName(prev => ({ ...prev, redTeam: !prev.redTeam }))}
                className="text-red-300 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>

            {editingTeamName.redTeam ? (
              <input
                type="text"
                value={teamNames.redTeam}
                onChange={e => handleTeamNameChange('redTeam', e.target.value)}
                placeholder="Enter team name (or leave empty for random)"
                className="mt-2 w-full bg-dark-300 border-dark-300 text-white rounded text-sm py-1.5 px-2"
              />
            ) : (
              <p className="text-gray-400 text-sm mt-2">
                {teamNames.redTeam || 'Random name will be generated'}
              </p>
            )}
          </div>
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

                <div className="mb-2 flex space-x-2">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={player.name}
                      onChange={e => handlePlayerChange(index, 'name', e.target.value)}
                      placeholder="Player Name"
                      className="form-input w-full bg-dark-300 border-dark-300 text-white rounded text-sm py-1.5"
                      minLength={3}
                      maxLength={16}
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      value={player.tag || ''}
                      onChange={e => handlePlayerChange(index, 'tag', e.target.value)}
                      onFocus={() => handleTagInputFocus(index)}
                      placeholder="#Tag"
                      className="form-input w-full bg-dark-300 border-dark-300 text-white rounded text-sm py-1.5"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <select
                      value={player.rank}
                      onChange={e => handlePlayerChange(index, 'rank', e.target.value)}
                      className="form-select appearance-none bg-dark-300 border border-dark-400 focus:border-gray-500 text-white rounded text-sm py-1.5 px-3 pr-8 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                      required
                    >
                      <option value="" disabled>
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

                <div className="mb-2 flex space-x-2">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={player.name}
                      onChange={e => handlePlayerChange(index + 5, 'name', e.target.value)}
                      placeholder="Player Name"
                      className="form-input w-full bg-dark-300 border-dark-300 text-white rounded text-sm py-1.5"
                      minLength={3}
                      maxLength={16}
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      value={player.tag || ''}
                      onChange={e => handlePlayerChange(index + 5, 'tag', e.target.value)}
                      onFocus={() => handleTagInputFocus(index + 5)}
                      placeholder="#Tag"
                      className="form-input w-full bg-dark-300 border-dark-300 text-white rounded text-sm py-1.5"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <select
                      value={player.rank}
                      onChange={e => handlePlayerChange(index + 5, 'rank', e.target.value)}
                      className="form-select appearance-none bg-dark-300 border border-dark-400 focus:border-gray-500 text-white rounded text-sm py-1.5 px-3 pr-8 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                      required
                    >
                      <option value="" disabled>
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

      <div className="flex flex-col border-t border-dark-300 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:space-y-0 mb-4">
          <div className="flex space-x-3">
            <Button
              onClick={handleGenerateTeams}
              disabled={isGenerating}
              variant="primary"
              type="button"
              className="px-6 py-2.5 bg-[#51b6ca] border-[#51b6ca]"
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

        {errors.length > 0 && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-md shadow-sm">
            <div className="flex items-center mb-2">
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
              <span className="font-medium">Please fix the following errors:</span>
            </div>
            <ul className="list-disc pl-10 space-y-1 text-sm">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
