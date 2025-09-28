/* eslint-disable */
'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Player, DraftState, DraftSettings } from '@/lib/types';
import { getTierPoints, calculatePlayerValue, getRankName } from '@/lib/utils';
import { RANK_DESCRIPTIONS } from '@/lib/constants';
import PickTimer from './PickTimer';

interface DraftBoardProps {
  draftState: DraftState;
  onPlayerPick: (player: Player, team: 'A' | 'B') => void;
  settings: DraftSettings;
}

interface DraggablePlayerProps {
  player: Player;
  isCurrentTurn?: boolean;
  currentTeam?: 'A' | 'B' | null;
  onKeyboardPick?: (team: 'A' | 'B') => void;
}

const DraggablePlayer: React.FC<DraggablePlayerProps> = ({ 
  player, 
  isCurrentTurn = false, 
  currentTeam = null,
  onKeyboardPick 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const tierPoints = getTierPoints();
  const playerPoints = calculatePlayerValue(player, tierPoints);

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-dark-300 rounded-lg p-3 transition-all select-none
        ${isDragging ? 'opacity-50 scale-105 shadow-lg z-10 cursor-grabbing' : 'cursor-grab hover:cursor-pointer'}
        ${isCurrentTurn ? 'ring-2 ring-gold shadow-md' : ''}
        hover:bg-dark-200 focus:outline-none focus:ring-2 focus:ring-blue-500
        ${currentTeam ? 'hover:scale-105' : ''}
      `}
      tabIndex={0}
      role="button"
      aria-label={`${player.name}, ${getRankName(player.rank as any)}, ${playerPoints} points. Double-click or use buttons to pick.`}
      onKeyDown={(e) => {
        if (onKeyboardPick && (e.key === 'a' || e.key === 'A')) {
          e.preventDefault();
          onKeyboardPick('A');
        } else if (onKeyboardPick && (e.key === 'b' || e.key === 'B')) {
          e.preventDefault();
          onKeyboardPick('B');
        }
      }}
      onDoubleClick={() => {
        if (onKeyboardPick && currentTeam) {
          onKeyboardPick(currentTeam);
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-white">{player.name}</p>
          <p className={`text-sm ${getRankColorClass(player.rank)}`}>
            {getRankName(player.rank as any)} ({playerPoints} pts)
          </p>
        </div>
        {onKeyboardPick && (
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onKeyboardPick('A');
              }}
              disabled={currentTeam !== 'A'}
              className={`px-2 py-1 rounded text-xs font-medium transition-all focus:outline-none focus:ring-1 ${
                currentTeam === 'A'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              aria-label={`Pick ${player.name} for Team A`}
              title={currentTeam === 'A' ? 'Pick for Team A' : 'Not Team A\'s turn'}
            >
              Team A
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onKeyboardPick('B');
              }}
              disabled={currentTeam !== 'B'}
              className={`px-2 py-1 rounded text-xs font-medium transition-all focus:outline-none focus:ring-1 ${
                currentTeam === 'B'
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              aria-label={`Pick ${player.name} for Team B`}
              title={currentTeam === 'B' ? 'Pick for Team B' : 'Not Team B\'s turn'}
            >
              Team B
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TeamPanel: React.FC<{
  team: Player[];
  teamName: string;
  captain: Player | null;
  isCurrentTurn: boolean;
  teamColor: string;
  teamId: string;
  onDrop: (player: Player) => void;
}> = ({ team, teamName, captain, isCurrentTurn, teamColor, teamId, onDrop }) => {
  const tierPoints = getTierPoints();
  const teamTotal = team.reduce((sum, player) => sum + calculatePlayerValue(player, tierPoints), 0);
  const teamAverage = team.length > 0 ? teamTotal / team.length : 0;

  const { setNodeRef, isOver } = useDroppable({
    id: teamId,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-dark-200 rounded-lg p-4 min-h-96 transition-all
        ${isCurrentTurn ? 'ring-2 ring-gold shadow-lg' : ''}
        ${isOver && isCurrentTurn ? 'bg-dark-100 ring-4 ring-gold' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-xl font-bold ${teamColor}`}>
            {teamName}
            {isCurrentTurn && <span className="ml-2 text-gold">← PICKING</span>}
          </h3>
          <p className="text-sm text-gray-400">
            {team.length}/5 players • {teamTotal.toFixed(1)} pts total • {teamAverage.toFixed(1)} avg
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {captain && (
          <div className="bg-dark-100 rounded-lg p-3 border-l-4 border-gold">
            <div className="flex items-center">
              <span className="text-gold text-xs font-bold mr-2">CAPTAIN</span>
              <div>
                <p className="font-medium text-white">{captain.name}</p>
                <p className="text-sm text-gray-300">
                  {getRankName(captain.rank as any)} ({calculatePlayerValue(captain, tierPoints)} pts)
                </p>
              </div>
            </div>
          </div>
        )}

        {team.filter(p => p.id !== captain?.id).map(player => (
          <div key={player.id} className="bg-dark-300 rounded-lg p-3">
            <div>
              <p className="font-medium text-white">{player.name}</p>
              <p className="text-sm text-gray-300">
                {getRankName(player.rank as any)} ({calculatePlayerValue(player, tierPoints)} pts)
              </p>
            </div>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: 5 - team.length }).map((_, index) => (
          <div key={`empty-${index}`} className="bg-dark-400 rounded-lg p-3 border-2 border-dashed border-gray-600">
            <p className="text-gray-500 text-center text-sm">Empty slot</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DraftBoard: React.FC<DraftBoardProps> = ({ draftState, onPlayerPick, settings }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentTeam = draftState.currentTurnIndex < draftState.orderQueue.length
    ? draftState.orderQueue[draftState.currentTurnIndex]
    : null;

  const isTeamATurn = currentTeam === 'A';
  const isTeamBTurn = currentTeam === 'B';

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !currentTeam) return;

    const playerId = active.id as string;
    const player = draftState.pool.find(p => p.id === playerId);

    if (!player) return;

    // Only allow dropping on the current team's turn
    if (over.id === 'team-a' && isTeamATurn) {
      onPlayerPick(player, 'A');
    } else if (over.id === 'team-b' && isTeamBTurn) {
      onPlayerPick(player, 'B');
    }
  };

  const handleKeyboardPick = (player: Player, team: 'A' | 'B') => {
    if (!currentTeam) return;
    
    // Only allow picking for the current team
    if (currentTeam === team) {
      onPlayerPick(player, team);
    }
  };

  const isDraftComplete = draftState.currentTurnIndex >= draftState.orderQueue.length;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Draft Status and Timer */}
        <div className="bg-dark-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Draft in Progress</h2>
              <div className="text-sm text-gray-300">
                <span>Pick {Math.min(draftState.currentTurnIndex + 1, draftState.orderQueue.length)} of {draftState.orderQueue.length}</span>
                {currentTeam && (
                  <span className="ml-4">
                    Current turn: <span className={currentTeam === 'A' ? 'text-blue-400' : 'text-red-400'}>
                      Team {currentTeam} ({currentTeam === 'A' ? draftState.captainA?.name : draftState.captainB?.name})
                    </span>
                  </span>
                )}
              </div>
            </div>

            {draftState.timer.active && !isDraftComplete && (
              <PickTimer
                secondsRemaining={draftState.timer.remaining}
                isActive={draftState.timer.active}
              />
            )}
          </div>

          {/* Pick Order Progress */}
          <div className="mt-4 flex items-center space-x-1">
            <span className="text-sm text-gray-400 mr-2">Pick order:</span>
            {draftState.orderQueue.map((team, index) => (
              <div
                key={index}
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${index < draftState.currentTurnIndex
                    ? team === 'A' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
                    : index === draftState.currentTurnIndex
                      ? team === 'A' ? 'bg-blue-400 text-white ring-2 ring-gold' : 'bg-red-400 text-white ring-2 ring-gold'
                      : 'bg-gray-600 text-gray-400'
                  }
                `}
              >
                {team}
              </div>
            ))}
          </div>
        </div>

        {/* Teams and Player Pool */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team A */}
          <div className={`${isTeamATurn ? 'order-1' : 'order-1'}`}>
            <TeamPanel
              team={draftState.teamA}
              teamName={`Team ${draftState.captainA?.name || 'A'}`}
              captain={draftState.captainA}
              isCurrentTurn={isTeamATurn}
              teamColor="text-blue-400"
              teamId="team-a"
              onDrop={(player) => onPlayerPick(player, 'A')}
            />
          </div>

          {/* Player Pool */}
          <div className="order-2">
            <div className="bg-dark-200 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4 text-center">
                Player Pool ({draftState.pool.length} remaining)
              </h3>
              
              <SortableContext items={draftState.pool.map(p => p.id!)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 max-h-96 overflow-y-auto" role="listbox" aria-label="Available players">
                  {draftState.pool.map(player => (
                    <DraggablePlayer
                      key={player.id}
                      player={player}
                      isCurrentTurn={currentTeam !== null}
                      currentTeam={currentTeam}
                      onKeyboardPick={currentTeam ? (team) => handleKeyboardPick(player, team) : undefined}
                    />
                  ))}
                  
                  {draftState.pool.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>All players have been drafted!</p>
                    </div>
                  )}
                </div>
              </SortableContext>

              {!isDraftComplete && currentTeam && (
                <div className="mt-4 p-4 bg-dark-100 rounded-lg border-l-4 border-gold">
                  <div className="text-center mb-3">
                    <p className="text-sm font-medium text-gray-300">
                      <span className={`font-bold ${currentTeam === 'A' ? 'text-blue-400' : 'text-red-400'}`}>
                        Team {currentTeam}
                      </span> is picking
                    </p>
                    <div className="text-xs text-gray-400 mt-2 space-y-1">
                      <p><strong>🖱️ Drag & Drop:</strong> Drag player card to team panel</p>
                      <p><strong>🖱️ Double-Click:</strong> Double-click player card to auto-pick</p>
                      <p><strong>🔲 Buttons:</strong> Use "Team A" or "Team B" buttons</p>
                      <p><strong>⌨️ Keyboard:</strong> Focus player card, press A or B key</p>
                    </div>
                  </div>
                  
                  {draftState.timer.active && (
                    <div className="text-center text-xs">
                      <p className="text-orange-400">
                        ⏰ Auto-pick in {draftState.timer.remaining}s if no selection made
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!isDraftComplete && !currentTeam && (
                <div className="mt-4 p-3 bg-green-900 border border-green-700 rounded-lg text-center">
                  <p className="text-green-400 font-medium">🎉 Draft Complete!</p>
                  <p className="text-green-300 text-sm mt-1">All players have been picked. Review teams above.</p>
                </div>
              )}
            </div>
          </div>

          {/* Team B */}
          <div className="order-3">
            <TeamPanel
              team={draftState.teamB}
              teamName={`Team ${draftState.captainB?.name || 'B'}`}
              captain={draftState.captainB}
              isCurrentTurn={isTeamBTurn}
              teamColor="text-red-400"
              teamId="team-b"
              onDrop={(player) => onPlayerPick(player, 'B')}
            />
          </div>
        </div>

        {isDraftComplete && (
          <div className="bg-green-900 border border-green-700 rounded-lg p-4 text-center">
            <h3 className="text-lg font-bold text-green-400 mb-2">Draft Complete!</h3>
            <p className="text-green-300">All players have been drafted. Ready to finalize teams.</p>
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default DraftBoard;