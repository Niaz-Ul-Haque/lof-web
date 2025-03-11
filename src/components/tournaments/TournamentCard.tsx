import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tournament } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const {
    id,
    name,
    description,
    startDate,
    endDate,
    status,
    teams,
    poster,
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

  const getStatusText = () => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Tournament Poster/Image */}
      <div className="relative w-full h-48 bg-dark-200">
        {poster ? (
          <Image
            src={poster}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/tournament.jpg"
              alt={name}
              fill
              className="object-cover opacity-50"
            />
            <span className="text-lg font-bold text-white z-10">{name}</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor()}`}>
          {getStatusText()}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        
        <div className="mb-4 text-sm text-gray-400">
          {startDate === endDate ? (
            <p>{formatDate(startDate)}</p>
          ) : (
            <p>{formatDate(startDate)} - {formatDate(endDate)}</p>
          )}
        </div>
        
        <p className="text-gray-300 mb-4 flex-grow line-clamp-3">
          {description}
        </p>
        
        <div className="flex justify-between items-center text-sm">
          <div className="text-teal">
            {teams?.length || 0} Teams
          </div>
          
          <Link
            href={`/tournaments/${id}`}
            className="text-gold hover:text-teal transition-colors font-medium flex items-center"
          >
            View Details
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default TournamentCard;