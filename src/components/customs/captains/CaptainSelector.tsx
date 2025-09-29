/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';
import { Player, DraftSettings } from '@/lib/types';
import { getTierPoints, calculatePlayerValue, getRankName } from '@/lib/utils';
import { selectCaptainsAuto } from '@/lib/teamGeneration';

interface CaptainSelectorProps {
  players: Player[];
  settings: DraftSettings;
  onSettingsChange: (settings: DraftSettings) => void;
  onConfirm: (captainA: Player, captainB: Player) => void;
}

const CaptainSelector: React.FC<CaptainSelectorProps> = ({
  players,
  settings,
  onSettingsChange,
  onConfirm,
}) => {
  const [captainA, setCaptainA] = useState<Player | null>(null);
  const [captainB, setCaptainB] = useState<Player | null>(null);
  const [isAutoSelected, setIsAutoSelected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const tierPoints = getTierPoints();

  const handleAutoSelect = () => {
    const [autoA, autoB] = selectCaptainsAuto(players, settings.similarityWindow, tierPoints);
    setCaptainA(autoA);
    setCaptainB(autoB);
    setIsAutoSelected(true);
  };

  const handleManualSelect = (player: Player, position: 'A' | 'B') => {
    if (position === 'A') {
      setCaptainA(player);
      if (captainB?.id === player.id) {
        setCaptainB(null);
      }
    } else {
      setCaptainB(player);
      if (captainA?.id === player.id) {
        setCaptainA(null);
      }
    }
    setIsAutoSelected(false);
  };

  const handleSwapCaptains = () => {
    const tempA = captainA;
    setCaptainA(captainB);
    setCaptainB(tempA);
  };

  const handleConfirm = () => {
    if (captainA && captainB && captainA.id !== captainB.id) {
      onConfirm(captainA, captainB);
    }
  };

  const availablePlayers = players.filter(p => 
    p.id !== captainA?.id && p.id !== captainB?.id
  );

  const getRankColorClass = (rank: string): string => {
    if (rank.includes('I')) return 'text-gray-400';
    if (rank.includes('B')) return 'text-amber-800';
    if (rank.includes('S')) return 'text-gray-300';
    if (rank.includes('G')) return 'text-yellow-500';
    if (rank.includes('P')) return 'text-cyan-400';
    if (rank.includes('E')) return 'text-emerald-400';
    if (rank.includes('D')) return 'text-blue-400';
    if (rank.includes('M')) return 'text-purple-400';
    if (rank === 'GM') return 'text-red-400';
    if (rank === 'C') return 'text-orange-400';
    return 'text-white';
  };

  const PICK_ORDER_PRESETS = [
    { label: 'Standard (1-2-2-2-1)', value: '1-2-2-2-1' },
  ];

  return (
    <div className="space-y-6">
      {/* Captain Selection */}
      <div className="bg-dark-100 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Select Captains</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-dark-200 text-white px-4 py-2 rounded-md hover:bg-dark-300 transition-colors"
          >
            {showSettings ? 'Hide Settings' : 'Show Settings'}
          </button>
        </div>

        {showSettings && (
          <div className="mb-6 p-4 bg-dark-200 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold mb-3">Draft Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Pick
                </label>
                <select
                  value={settings.firstPick}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    firstPick: e.target.value as 'A' | 'B' | 'coin'
                  })}
                  className="w-full bg-dark-300 text-white border border-dark-400 rounded-md px-3 py-2"
                >
                  <option value="coin">Coin Flip</option>
                  <option value="A">Captain A</option>
                  <option value="B">Captain B</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pick Order
                </label>
                <select
                  value={settings.pickOrder}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    pickOrder: e.target.value
                  })}
                  className="w-full bg-dark-300 text-white border border-dark-400 rounded-md px-3 py-2"
                >
                  {PICK_ORDER_PRESETS.map(preset => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Turn Timer (seconds)
                </label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={settings.turnSeconds}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    turnSeconds: parseInt(e.target.value) || 30
                  })}
                  className="w-full bg-dark-300 text-white border border-dark-400 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Auto-pick Strategy
                </label>
                <select
                  value={settings.autoPick}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    autoPick: e.target.value as DraftSettings['autoPick']
                  })}
                  className="w-full bg-dark-300 text-white border border-dark-400 rounded-md px-3 py-2"
                >
                  <option value="bestFit">Best Fit</option>
                  <option value="highestMMR">Highest MMR</option>
                  <option value="randomTop3">Random Top 3</option>
                  <option value="off">Off (Skip Turn)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Captain Similarity Window
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={settings.similarityWindow}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    similarityWindow: parseFloat(e.target.value) || 1.0
                  })}
                  className="w-full bg-dark-300 text-white border border-dark-400 rounded-md px-3 py-2"
                />
                <p className="text-xs text-gray-400 mt-1">
                  ±{settings.similarityWindow} rank points for auto-selection
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 p-4 bg-dark-200 rounded-lg">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gold mb-2">⚡ Captain Selection</h3>
            <p className="text-gray-300 text-sm mb-3">
              Choose two captains to lead the draft. Auto-select finds players with similar skill levels for fairness.
            </p>
          </div>
          
          <button
            onClick={handleAutoSelect}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors mr-4"
          >
            🎯 Auto-Select Captains
          </button>
          {isAutoSelected && (
            <span className="text-green-400 text-sm">
              ✓ Auto-selected based on similarity within ±{settings.similarityWindow} points
            </span>
          )}
        </div>

        {/* Captain Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Captain A */}
          <div className="bg-dark-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Captain A</h3>
            {captainA ? (
              <div className="bg-dark-300 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{captainA.name}</p>
                    <p className={`text-sm ${getRankColorClass(captainA.rank)}`}>
                      {getRankName(captainA.rank as any)} ({calculatePlayerValue(captainA, tierPoints)} pts)
                    </p>
                  </div>
                  <button
                    onClick={() => setCaptainA(null)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-dark-300 rounded-lg p-3 text-gray-400 text-center">
                No captain selected
              </div>
            )}

            <div className="mt-3 max-h-40 overflow-y-auto">
              <p className="text-sm text-gray-400 mb-2">Select Captain A:</p>
              {players.filter(p => p.id !== captainB?.id).map(player => (
                <button
                  key={player.id}
                  onClick={() => handleManualSelect(player, 'A')}
                  className={`w-full text-left p-2 rounded-md text-sm mb-1 transition-colors ${
                    captainA?.id === player.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark-400 hover:bg-dark-300 text-gray-300'
                  }`}
                >
                  <span className="font-medium">{player.name}</span>
                  <span className={`ml-2 ${getRankColorClass(player.rank)}`}>
                    {getRankName(player.rank as any)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Captain B */}
          <div className="bg-dark-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-red-400">Captain B</h3>
            {captainB ? (
              <div className="bg-dark-300 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{captainB.name}</p>
                    <p className={`text-sm ${getRankColorClass(captainB.rank)}`}>
                      {getRankName(captainB.rank as any)} ({calculatePlayerValue(captainB, tierPoints)} pts)
                    </p>
                  </div>
                  <button
                    onClick={() => setCaptainB(null)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-dark-300 rounded-lg p-3 text-gray-400 text-center">
                No captain selected
              </div>
            )}

            <div className="mt-3 max-h-40 overflow-y-auto">
              <p className="text-sm text-gray-400 mb-2">Select Captain B:</p>
              {players.filter(p => p.id !== captainA?.id).map(player => (
                <button
                  key={player.id}
                  onClick={() => handleManualSelect(player, 'B')}
                  className={`w-full text-left p-2 rounded-md text-sm mb-1 transition-colors ${
                    captainB?.id === player.id
                      ? 'bg-red-600 text-white'
                      : 'bg-dark-400 hover:bg-dark-300 text-gray-300'
                  }`}
                >
                  <span className="font-medium">{player.name}</span>
                  <span className={`ml-2 ${getRankColorClass(player.rank)}`}>
                    {getRankName(player.rank as any)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {captainA && captainB && (
            <button
              onClick={handleSwapCaptains}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Swap Captains
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={!captainA || !captainB || captainA.id === captainB.id}
            className={`px-8 py-3 rounded-md font-bold text-lg transition-colors ${
              captainA && captainB && captainA.id !== captainB.id
                ? 'bg-gold text-black hover:bg-opacity-90'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            style={{ backgroundColor: captainA && captainB && captainA.id !== captainB.id ? '#d3a536' : undefined }}
          >
            Start Draft
          </button>
        </div>

        {captainA && captainB && (
          <div className="mt-4 p-3 bg-dark-200 rounded-lg">
            <p className="text-sm text-gray-300">
              <strong>Captain Comparison:</strong> {captainA.name} ({calculatePlayerValue(captainA, tierPoints)} pts) vs {captainB.name} ({calculatePlayerValue(captainB, tierPoints)} pts)
              <br />
              <strong>Point Difference:</strong> {Math.abs(calculatePlayerValue(captainA, tierPoints) - calculatePlayerValue(captainB, tierPoints)).toFixed(1)} pts
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptainSelector;