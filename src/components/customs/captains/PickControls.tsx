/* eslint-disable */
'use client';

import React from 'react';
import { DraftSettings } from '@/lib/types';

interface PickControlsProps {
  settings: DraftSettings;
  onSettingsChange: (settings: DraftSettings) => void;
  onUndoLastPick: () => void;
  onResetDraft: () => void;
  canUndo: boolean;
  draftInProgress: boolean;
}

const PickControls: React.FC<PickControlsProps> = ({
  settings,
  onSettingsChange,
  onUndoLastPick,
  onResetDraft,
  canUndo,
  draftInProgress,
}) => {
  return (
    <div className="bg-dark-100 rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-gray-400">Pick Order:</span>
            <span className="ml-2 font-mono text-white">{settings.pickOrder}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">First Pick:</span>
            <span className="ml-2 text-white">
              {settings.firstPick === 'coin' ? 'Coin Flip' : `Captain ${settings.firstPick}`}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Timer:</span>
            <span className="ml-2 text-white">{settings.turnSeconds}s</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Auto-pick:</span>
            <span className="ml-2 text-white">{settings.autoPick}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onUndoLastPick}
            disabled={!canUndo}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              canUndo
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Undo Last Pick
          </button>
          
          <button
            onClick={onResetDraft}
            disabled={!draftInProgress}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              draftInProgress
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Reset Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickControls;