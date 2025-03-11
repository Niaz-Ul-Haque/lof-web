'use client';

import React, { useState } from 'react';
import Image from 'next/image';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Tournament, TournamentTeam } from '@/lib/types';
import { formatDate } from '@/lib/utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Button from '@/components/ui/Button';
import BracketVisualization from './BracketVisualization';

interface TournamentDetailsProps {
  tournament: Tournament;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({ tournament }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'bracket' | 'rules'>(
    'overview'
  );

  const {
    name,
    description,
    format,
    startDate,
    endDate,
    status,
    teams,
    poster,
    flyer,
    videoLink,
    sponsors,
    rules,
    prizes,
  } = tournament;

  const getStatusBadgeColor = () => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-900 text-blue-300';
      case 'active':
        return 'bg-green-900 text-green-300';
      case 'completed':
        return 'bg-gray-700 text-gray-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const renderTeam = (team: TournamentTeam) => (
    <div key={team.id} className="bg-dark-200 rounded-lg p-4 flex flex-col">
      <div className="flex items-center space-x-4 mb-4">
        {team.logo ? (
          <div className="w-12 h-12 relative">
            <Image src={team.logo} alt={team.name} fill className="object-contain rounded-full" />
          </div>
        ) : (
          <div className="w-12 h-12 bg-dark-300 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">{team.name[0]}</span>
          </div>
        )}

        <h3 className="text-lg font-bold">{team.name}</h3>
      </div>

      <div className="flex-grow">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Players:</h4>
        <ul className="space-y-1">
          {team.players.map(player => (
            <li
              key={player.id || player.name}
              className="text-sm flex items-center justify-between"
            >
              <span>{player.name}</span>
              {player.rank && <span className="text-gray-500">{player.rank}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-dark-300">
        <a
          href={`https://www.op.gg/multisearch/na?summoners=${team.players.map(p => encodeURIComponent(p.name)).join(',')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-teal hover:text-gold transition-colors"
        >
          View Team on OP.GG
        </a>
      </div>
    </div>
  );

  return (
    <div className="bg-dark-100 rounded-lg overflow-hidden">
      <div className="relative h-64 bg-dark-300">
        {poster ? (
          <Image src={poster} alt={name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/tournament.jpg"
              alt={name}
              fill
              className="object-cover opacity-50"
            />
            <span className="text-2xl font-bold text-white z-10">{name}</span>
          </div>
        )}

        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor()}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-dark-100 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-6">
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-300">
              {formatDate(startDate)} - {formatDate(endDate)}
            </span>
            <span className="text-sm text-gray-300">Format: {format}</span>
          </div>
        </div>
      </div>

      <div className="border-b border-dark-200">
        <div className="flex overflow-x-auto scrollbar-hide">
          <button
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-gold border-b-2 border-gold'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'bracket'
                ? 'text-gold border-b-2 border-gold'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('bracket')}
          >
            Bracket
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'teams'
                ? 'text-gold border-b-2 border-gold'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('teams')}
          >
            Teams ({teams?.length || 0})
          </button>
          {rules && (
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'rules'
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('rules')}
            >
              Rules
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Tournament Description</h2>
              <div className="text-gray-300 whitespace-pre-line">{description}</div>
            </div>

            {prizes && (
              <div>
                <h2 className="text-xl font-bold mb-4">Prizes</h2>
                <div className="text-gray-300 whitespace-pre-line">{prizes}</div>
              </div>
            )}

            {(flyer || videoLink) && (
              <div>
                <h2 className="text-xl font-bold mb-4">Media</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {flyer && (
                    <div className="relative h-80 bg-dark-200 rounded-lg overflow-hidden">
                      <Image src={flyer} alt={`${name} Flyer`} fill className="object-contain" />
                    </div>
                  )}

                  {videoLink && (
                    <div className="relative h-80 bg-dark-200 rounded-lg overflow-hidden">
                      <iframe
                        src={videoLink.replace('watch?v=', 'embed/')}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              </div>
            )}

            {sponsors && sponsors.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Sponsors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sponsors.map(sponsor => (
                    <a
                      key={sponsor.id}
                      href={sponsor.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-dark-200 rounded-lg p-4 flex flex-col items-center justify-center transition-transform hover:-translate-y-1"
                    >
                      <div className="relative w-24 h-24 mb-2">
                        <Image
                          src={sponsor.logo}
                          alt={sponsor.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h3 className="text-sm font-medium text-center">{sponsor.name}</h3>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bracket' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Tournament Bracket</h2>
            <BracketVisualization tournament={tournament} />
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Participating Teams</h2>
            {teams && teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map(team => renderTeam(team))}
              </div>
            ) : (
              <p className="text-gray-400">
                No teams have been registered for this tournament yet.
              </p>
            )}
          </div>
        )}

        {activeTab === 'rules' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Tournament Rules</h2>
            <div className="text-gray-300 whitespace-pre-line">{rules}</div>
          </div>
        )}
      </div>

      <div className="p-6 bg-dark-200 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="text-sm text-gray-400">
          Registration {status === 'upcoming' ? 'closes' : 'closed'} on {formatDate(startDate)}
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
