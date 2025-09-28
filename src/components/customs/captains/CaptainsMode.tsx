/* eslint-disable */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Player, CustomMatch, DraftState, DraftSettings } from '@/lib/types';
import { DEFAULT_TIER_POINTS } from '@/lib/constants';
import { getTierPoints, calculatePlayerValue, isClient } from '@/lib/utils';
import { 
  selectCaptainsAuto, 
  expandPickOrder, 
  validatePickOrder,
  selectBestFitPlayer,
  selectHighestMMRPlayer,
  selectRandomTop3Player 
} from '@/lib/teamGeneration';
import TeamDisplay from '@/components/customs/TeamDisplay';
import CaptainSelector from './CaptainSelector';
import DraftBoard from './DraftBoard';
import PickControls from './PickControls';

interface PlayerInputProps {
  onPlayersSubmit: (players: Player[]) => void;
}

const PlayerInput: React.FC<PlayerInputProps> = ({ onPlayersSubmit }) => {
  const [players, setPlayers] = useState<Player[]>(
    Array(10).fill(null).map((_, index) => ({ name: '', rank: '', id: `${index}` }))
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'manual' | 'bulk'>('manual');
  const [bulkText, setBulkText] = useState('');

  const handlePlayerChange = (index: number, field: keyof Player, value: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setPlayers(updatedPlayers);
    setErrors([]);
  };

  const validatePlayers = (): string[] => {
    const validationErrors: string[] = [];
    const filledPlayers = players.filter(p => p.name.trim());
    
    if (filledPlayers.length !== 10) {
      validationErrors.push('Please provide exactly 10 players.');
    }

    const uniqueNames = new Set(filledPlayers.map(p => p.name.toLowerCase().trim()));
    if (uniqueNames.size !== filledPlayers.length) {
      validationErrors.push('Player names must be unique.');
    }

    const tierPoints = getTierPoints();
    const invalidRanks = filledPlayers.filter(p => !tierPoints[p.rank]);
    if (invalidRanks.length > 0) {
      validationErrors.push(`Invalid ranks found for: ${invalidRanks.map(p => p.name).join(', ')}`);
    }

    return validationErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validatePlayers();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const filledPlayers = players.filter(p => p.name.trim()).map(player => ({
      ...player,
      name: player.name.trim(),
      id: player.id || `${player.name}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    onPlayersSubmit(filledPlayers);
  };

  const handleBulkImport = () => {
    const lines = bulkText.split('\n').filter(line => line.trim());
    if (lines.length !== 10) {
      setErrors(['Please provide exactly 10 lines of player data.']);
      return;
    }

    const importedPlayers: Player[] = [];
    const errors: string[] = [];

    lines.forEach((line, index) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 2) {
        errors.push(`Line ${index + 1}: Invalid format. Expected "Name Rank"`);
        return;
      }

      const rank = parts[parts.length - 1].toUpperCase();
      const name = parts.slice(0, -1).join(' ');

      if (!name) {
        errors.push(`Line ${index + 1}: Missing player name`);
        return;
      }

      const tierPoints = getTierPoints();
      if (!tierPoints[rank]) {
        errors.push(`Line ${index + 1}: Invalid rank "${rank}"`);
        return;
      }

      importedPlayers.push({
        name,
        rank,
        id: `${index}`,
      });
    });

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    setPlayers([...importedPlayers]);
    setActiveTab('manual');
    setErrors([]);
  };

  const fillTestData = () => {
    const testPlayers: Player[] = [
      { name: 'Player1', rank: 'D', id: '1' },
      { name: 'Player2', rank: 'D', id: '2' },
      { name: 'Player3', rank: 'P', id: '3' },
      { name: 'Player4', rank: 'P', id: '4' },
      { name: 'Player5', rank: 'G', id: '5' },
      { name: 'Player6', rank: 'G', id: '6' },
      { name: 'Player7', rank: 'S', id: '7' },
      { name: 'Player8', rank: 'S', id: '8' },
      { name: 'Player9', rank: 'B', id: '9' },
      { name: 'Player10', rank: 'B', id: '10' },
    ];
    setPlayers(testPlayers);
    setErrors([]);
  };

  return (
    <div className="bg-dark-100 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Enter Players for Captains Mode</h2>
        <div className="mb-6 p-4 bg-dark-200 rounded-lg border-l-4 border-gold">
          <h3 className="text-lg font-semibold text-gold mb-3">📋 How Captains Mode Works</h3>
          <div className="text-gray-300 space-y-2 text-sm">
            <div><strong>Step 1:</strong> Enter exactly <strong>10 players</strong> with their ranks</div>
            <div><strong>Step 2:</strong> Select 2 captains (auto-select finds similar skill levels)</div>
            <div><strong>Step 3:</strong> Configure draft settings (pick order, timer, auto-pick strategy)</div>
            <div><strong>Step 4:</strong> Draft remaining 8 players using drag & drop, double-click, or buttons</div>
            <div><strong>Step 5:</strong> Review final balanced teams with statistics</div>
          </div>
        </div>      {/* Tab Navigation */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2 rounded-l-md font-medium transition-colors ${
            activeTab === 'manual'
              ? 'bg-gold text-black'
              : 'bg-dark-200 text-gray-400 hover:text-white'
          }`}
          style={{ backgroundColor: activeTab === 'manual' ? '#d3a536' : undefined }}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 rounded-r-md font-medium transition-colors ${
            activeTab === 'bulk'
              ? 'bg-gold text-black'
              : 'bg-dark-200 text-gray-400 hover:text-white'
          }`}
          style={{ backgroundColor: activeTab === 'bulk' ? '#d3a536' : undefined }}
        >
          Bulk Import
        </button>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg">
          <ul className="list-disc list-inside text-red-300">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'manual' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player, index) => (
              <div key={index} className="bg-dark-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Player {index + 1}</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Player Name"
                    value={player.name}
                    onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                    className="w-full bg-dark-300 text-white border border-dark-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <select
                    value={player.rank}
                    onChange={(e) => handlePlayerChange(index, 'rank', e.target.value)}
                    className="w-full bg-dark-300 text-white border border-dark-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Select Rank</option>
                    {Object.entries(DEFAULT_TIER_POINTS).map(([code, points]) => (
                      <option key={code} value={code}>
                        {code} - {points} pts
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={fillTestData}
              className="bg-transparent text-gold hover:text-teal hover:underline text-sm transition-colors"
              style={{ color: '#d3a536' }}
            >
              Fill Test Data
            </button>
            <button
              onClick={handleSubmit}
              className="bg-gold text-black px-8 py-3 rounded-md font-bold text-lg hover:bg-opacity-90 transition-colors"
              style={{ backgroundColor: '#d3a536' }}
            >
              Continue to Captain Selection
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bulk Import (10 lines, format: "Name Rank")
            </label>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={`Player1 D\nPlayer2 P\nPlayer3 G\n...`}
              rows={12}
              className="w-full bg-dark-300 text-white border border-dark-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold font-mono text-sm"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleBulkImport}
              className="bg-gold text-black px-8 py-3 rounded-md font-bold text-lg hover:bg-opacity-90 transition-colors"
              style={{ backgroundColor: '#d3a536' }}
            >
              Import Players
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DEFAULT_DRAFT_SETTINGS: DraftSettings = {
  firstPick: 'coin',
  pickOrder: '1-2-2-2-1',
  turnSeconds: 30,
  autoPick: 'bestFit',
  similarityWindow: 1.0,
};

const CaptainsMode: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [draftSettings, setDraftSettings] = useState<DraftSettings>(DEFAULT_DRAFT_SETTINGS);
  const [draftState, setDraftState] = useState<DraftState | null>(null);
  const [finalMatch, setFinalMatch] = useState<CustomMatch | null>(null);
  const [phase, setPhase] = useState<'input' | 'captainSelect' | 'draft' | 'complete'>('input');
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    if (isClient()) {
      const savedSettings = localStorage.getItem('captainsModeSettings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setDraftSettings({ ...DEFAULT_DRAFT_SETTINGS, ...parsed });
        } catch (error) {
          console.warn('Failed to parse saved draft settings:', error);
        }
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (isClient()) {
      localStorage.setItem('captainsModeSettings', JSON.stringify(draftSettings));
    }
  }, [draftSettings]);

  const handlePlayerPick = useCallback((player: Player, team: 'A' | 'B') => {
    setDraftState(prev => {
      if (!prev) return prev;
      
      // Validate that the player is still in the pool (prevent double-picking)
      const playerInPool = prev.pool.find(p => p.id === player.id);
      if (!playerInPool) {
        console.warn('Player already picked or not in pool:', player.name);
        return prev;
      }

      // Validate it's the correct team's turn
      if (prev.currentTurnIndex >= prev.orderQueue.length) {
        console.warn('Draft is complete, no more picks allowed');
        return prev;
      }

      const currentTeamTurn = prev.orderQueue[prev.currentTurnIndex];
      if (team !== currentTeamTurn) {
        console.warn(`Not ${team}'s turn. Current turn: ${currentTeamTurn}`);
        return prev;
      }

      const newTeamA = team === 'A' ? [...prev.teamA, player] : prev.teamA;
      const newTeamB = team === 'B' ? [...prev.teamB, player] : prev.teamB;
      const newPool = prev.pool.filter(p => p.id !== player.id);
      
      const newHistory = [
        ...prev.history,
        { playerId: player.id!, to: team, from: 'pool' as const },
      ];

      const nextTurnIndex = prev.currentTurnIndex + 1;
      const isComplete = nextTurnIndex >= prev.orderQueue.length || newPool.length === 0;

      return {
        ...prev,
        teamA: newTeamA,
        teamB: newTeamB,
        pool: newPool,
        currentTurnIndex: nextTurnIndex,
        timer: { 
          remaining: isComplete ? 0 : draftSettings.turnSeconds, 
          active: !isComplete 
        },
        history: newHistory,
      };
    });
  }, [draftSettings.turnSeconds]);

  const handleAutoPick = useCallback((state: DraftState) => {
    // Double-check state to prevent race conditions
    if (!state || state.pool.length === 0 || state.currentTurnIndex >= state.orderQueue.length) {
      console.log('Auto-pick cancelled: invalid state');
      return;
    }

    const tierPoints = getTierPoints();
    const currentTeam = state.orderQueue[state.currentTurnIndex];
    let selectedPlayer: Player;

    console.log(`Auto-pick for Team ${currentTeam}, pool size: ${state.pool.length}`);

    try {
      switch (draftSettings.autoPick) {
        case 'bestFit':
          selectedPlayer = selectBestFitPlayer(state.pool, state.teamA, state.teamB, currentTeam, tierPoints);
          break;
        case 'highestMMR':
          selectedPlayer = selectHighestMMRPlayer(state.pool, tierPoints);
          break;
        case 'randomTop3':
          selectedPlayer = selectRandomTop3Player(state.pool, tierPoints);
          break;
        default:
          // Skip pick
          console.log('Auto-pick disabled, skipping turn');
          setDraftState(prev => {
            if (!prev || prev.currentTurnIndex !== state.currentTurnIndex) return prev;
            return {
              ...prev,
              currentTurnIndex: prev.currentTurnIndex + 1,
              timer: { 
                remaining: draftSettings.turnSeconds, 
                active: prev.currentTurnIndex + 1 < prev.orderQueue.length 
              },
            };
          });
          return;
      }

      console.log(`Auto-picking ${selectedPlayer.name} for Team ${currentTeam}`);
      handlePlayerPick(selectedPlayer, currentTeam);
    } catch (error) {
      console.error('Auto-pick failed:', error);
      // Skip turn on error
      setDraftState(prev => {
        if (!prev || prev.currentTurnIndex !== state.currentTurnIndex) return prev;
        return {
          ...prev,
          currentTurnIndex: prev.currentTurnIndex + 1,
          timer: { 
            remaining: draftSettings.turnSeconds, 
            active: prev.currentTurnIndex + 1 < prev.orderQueue.length 
          },
        };
      });
    }
  }, [draftSettings.autoPick, draftSettings.turnSeconds, handlePlayerPick]);

  // Timer management
  useEffect(() => {
    if (draftState?.timer.active && draftState.timer.remaining > 0) {
      const interval = setInterval(() => {
        setDraftState(prev => {
          if (!prev || !prev.timer.active || prev.pool.length === 0) return prev;
          
          const newRemaining = Math.max(0, prev.timer.remaining - 1);
          
          if (newRemaining === 0 && prev.currentTurnIndex < prev.orderQueue.length) {
            // Auto-pick on timeout - but don't update state here to avoid race condition
            setTimeout(() => handleAutoPick(prev), 0);
            return {
              ...prev,
              timer: {
                ...prev.timer,
                remaining: newRemaining,
                active: false, // Stop timer until next turn
              },
            };
          }
          
          return {
            ...prev,
            timer: {
              ...prev.timer,
              remaining: newRemaining,
            },
          };
        });
      }, 1000);
      
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [draftState?.timer.active, handleAutoPick]);

  const handlePlayersSubmit = (submittedPlayers: Player[]) => {
    if (submittedPlayers.length !== 10) {
      alert('Please provide exactly 10 players for Captains Mode.');
      return;
    }

    // Validate unique players
    const uniqueNames = new Set(submittedPlayers.map(p => p.name.toLowerCase().trim()));
    if (uniqueNames.size !== 10) {
      alert('Player names must be unique. Please check for duplicates.');
      return;
    }

    // Validate ranks
    const tierPoints = getTierPoints();
    const invalidPlayers = submittedPlayers.filter(p => !tierPoints[p.rank]);
    if (invalidPlayers.length > 0) {
      alert(`Invalid ranks found for players: ${invalidPlayers.map(p => p.name).join(', ')}`);
      return;
    }

    const playersWithIds = submittedPlayers.map(player => ({
      ...player,
      id: player.id || `${player.name}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    setPlayers(playersWithIds);
    setPhase('captainSelect');
  };

  const handleCaptainsConfirm = (captainA: Player, captainB: Player) => {
    const remainingPool = players.filter(p => p.id !== captainA.id && p.id !== captainB.id);
    
    if (!validatePickOrder(draftSettings.pickOrder, remainingPool.length)) {
      alert(`Invalid pick order. Expected ${remainingPool.length} total picks.`);
      return;
    }

    const orderQueue = expandPickOrder(draftSettings.pickOrder, draftSettings.firstPick);
    
    setDraftState({
      allPlayers: players,
      captainA,
      captainB,
      teamA: [captainA],
      teamB: [captainB],
      pool: remainingPool,
      orderQueue,
      currentTurnIndex: 0,
      timer: { remaining: draftSettings.turnSeconds, active: true },
      history: [],
    });
    
    setPhase('draft');
  };

  const handleUndoLastPick = () => {
    setDraftState(prev => {
      if (!prev || prev.history.length === 0) return prev;

      const lastAction = prev.history[prev.history.length - 1];
      const playerToRestore = prev.allPlayers.find(p => p.id === lastAction.playerId);
      
      if (!playerToRestore) return prev;

      const newTeamA = lastAction.to === 'A' 
        ? prev.teamA.filter(p => p.id !== lastAction.playerId)
        : prev.teamA;
      const newTeamB = lastAction.to === 'B' 
        ? prev.teamB.filter(p => p.id !== lastAction.playerId)
        : prev.teamB;
      const newPool = [...prev.pool, playerToRestore];
      const newHistory = prev.history.slice(0, -1);

      return {
        ...prev,
        teamA: newTeamA,
        teamB: newTeamB,
        pool: newPool,
        currentTurnIndex: Math.max(0, prev.currentTurnIndex - 1),
        timer: { remaining: draftSettings.turnSeconds, active: true },
        history: newHistory,
      };
    });
  };

  const handleResetDraft = () => {
    if (!draftState) return;
    
    setDraftState({
      ...draftState,
      teamA: [draftState.captainA!],
      teamB: [draftState.captainB!],
      pool: draftState.allPlayers.filter(p => 
        p.id !== draftState.captainA?.id && p.id !== draftState.captainB?.id
      ),
      currentTurnIndex: 0,
      timer: { remaining: draftSettings.turnSeconds, active: true },
      history: [],
    });
  };

  const handleFinalizeDraft = () => {
    if (!draftState) return;

    const tierPoints = getTierPoints();
    const blueTeamTotal = draftState.teamA.reduce((sum, player) => 
      sum + calculatePlayerValue(player, tierPoints), 0);
    const redTeamTotal = draftState.teamB.reduce((sum, player) => 
      sum + calculatePlayerValue(player, tierPoints), 0);

    const match: CustomMatch = {
      id: `captains-${Date.now()}`,
      createdAt: new Date().toISOString(),
      blueTeam: {
        name: draftState.captainA?.name ? `Team ${draftState.captainA.name}` : 'Team A',
        players: draftState.teamA,
        averageRank: blueTeamTotal / draftState.teamA.length,
      },
      redTeam: {
        name: draftState.captainB?.name ? `Team ${draftState.captainB.name}` : 'Team B',
        players: draftState.teamB,
        averageRank: redTeamTotal / draftState.teamB.length,
      },
    };

    setFinalMatch(match);
    setPhase('complete');
  };

  const handleReset = () => {
    setPlayers([]);
    setDraftState(null);
    setFinalMatch(null);
    setPhase('input');
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const isDraftComplete = draftState && 
    draftState.teamA.length === 5 &&
    draftState.teamB.length === 5 &&
    draftState.pool.length === 0;

  if (phase === 'complete' && finalMatch) {
    return (
      <TeamDisplay
        match={finalMatch}
        onReset={handleReset}
        previousEntries={null}
      />
    );
  }

  return (
    <div className="space-y-6">
      {phase === 'input' && (
        <PlayerInput onPlayersSubmit={handlePlayersSubmit} />
      )}

      {phase === 'captainSelect' && (
        <CaptainSelector
          players={players}
          settings={draftSettings}
          onSettingsChange={setDraftSettings}
          onConfirm={handleCaptainsConfirm}
        />
      )}

      {phase === 'draft' && draftState && (
        <div className="space-y-6">
          <PickControls
            settings={draftSettings}
            onSettingsChange={setDraftSettings}
            onUndoLastPick={handleUndoLastPick}
            onResetDraft={handleResetDraft}
            canUndo={draftState.history.length > 0}
            draftInProgress={draftState.currentTurnIndex > 0}
          />
          
          <DraftBoard
            draftState={draftState}
            onPlayerPick={handlePlayerPick}
            settings={draftSettings}
          />

          {isDraftComplete && (
            <div className="text-center">
              <button
                onClick={handleFinalizeDraft}
                className="bg-gold text-black px-8 py-3 rounded-md font-bold text-lg hover:bg-opacity-90 transition-colors"
                style={{ backgroundColor: '#d3a536' }}
              >
                Finalize Teams
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CaptainsMode;