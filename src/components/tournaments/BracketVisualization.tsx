'use client';

import React, { useMemo } from 'react';
import { Tournament, TournamentMatch, TournamentTeam } from '@/lib/types';

interface BracketVisualizationProps {
  tournament: Tournament;
}

const BracketVisualization: React.FC<BracketVisualizationProps> = ({ tournament }) => {
  const { matches, teams } = tournament;

  const matchesByRound = useMemo(() => {
    const grouped: { [round: number]: TournamentMatch[] } = {};

    if (matches && matches.length > 0) {
      matches.forEach(match => {
        if (!grouped[match.round]) {
          grouped[match.round] = [];
        }

        grouped[match.round].push(match);
      });
    }

    return grouped;
  }, [matches]);

  const totalRounds = useMemo(() => {
    return matches && matches.length > 0 ? Math.max(...matches.map(match => match.round)) : 0;
  }, [matches]);

  const findTeam = (teamId: string): TournamentTeam | undefined => {
    return teams.find(team => team.id === teamId);
  };

  if (!matches || matches.length === 0) {
    return (
      <div className="p-8 text-center bg-dark-200 rounded-lg">
        <p className="text-gray-400">
          Bracket not available yet. Check back later for match information.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="bracket-container min-w-fit">
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map(round => (
          <div key={round} className="round">
            <div className="mb-2 text-center text-sm font-medium text-gray-400">
              {round === totalRounds
                ? 'Final'
                : round === totalRounds - 1
                  ? 'Semifinals'
                  : `Round ${round}`}
            </div>

            {matchesByRound[round]?.map(match => (
              <div key={match.matchNumber} className="match">
                <div
                  className={`match-team ${match.winnerId === match.team1Id ? 'winner bg-teal bg-opacity-10' : ''}`}
                >
                  <span className="font-medium">{findTeam(match.team1Id)?.name || 'TBD'}</span>

                  <span className="text-sm">{match.score ? match.score.split('-')[0] : ''}</span>
                </div>

                <div
                  className={`match-team ${match.winnerId === match.team2Id ? 'winner bg-teal bg-opacity-10' : ''}`}
                >
                  <span className="font-medium">{findTeam(match.team2Id)?.name || 'TBD'}</span>

                  <span className="text-sm">{match.score ? match.score.split('-')[1] : ''}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BracketVisualization;
