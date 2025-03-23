'use client';

import React, { useState, useEffect } from 'react';
import TournamentCard from '@/components/tournaments/TournamentCard';
import { Tournament } from '@/lib/types';
import { getAllTournaments } from '../../lib/constants';
export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      try {
        const allTournaments = getAllTournaments();
        setTournaments(allTournaments);
      } catch (err) {
        console.error('Error loading tournaments:', err);
        setError('Failed to load tournaments. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  }, [loading]);

  const filteredTournaments = tournaments.filter(tournament => {
    if (filter === 'all') return true;
    return tournament.status === filter;
  });

  return (
    <div className="relative min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gold">Tournaments</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Browse our upcoming, active, and past tournaments. Join the competition and showcase
            your skills in organized League of Legends events.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-dark-200 rounded-lg p-1">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'all' ? 'bg-dark-100 text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'active' ? 'bg-dark-100 text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'upcoming' ? 'bg-dark-100 text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'completed' ? 'bg-dark-100 text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map(tournament => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            {filter === 'all'
              ? 'No tournaments available at this time.'
              : `No ${filter} tournaments available at this time.`}
          </div>
        )}

        <div className="mt-16 bg-dark-100 rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Want to Participate?</h2>
          <p className="text-gray-300 mb-6">
            Our tournaments are open to all skill levels. Join our Discord server to stay updated on
            upcoming tournaments and registration deadlines. You can register yourself or your team
            through the registration form on each tournament page when its open.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="https://discord.gg/leagueofflex"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Join Our Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
