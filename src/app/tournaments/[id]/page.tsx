'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ThreeJSBackground } from '@/components/ui/ThreeJSBackground';
import TournamentDetails from '@/components/tournaments/TournamentDetails';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Button from '@/components/ui/Button';
import { Tournament } from '@/lib/types';
import { getTournamentById } from '@/lib/constants';

export default function TournamentDetailPage() {
  const params = useParams();
  const tournamentId = params.id as string;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      try {
        const foundTournament = getTournamentById(tournamentId);

        if (foundTournament) {
          if (foundTournament.detailedDescription) {
            const enrichedTournament = {
              ...foundTournament,
              description: foundTournament.detailedDescription,
            };
            setTournament(enrichedTournament);
          } else {
            setTournament(foundTournament);
          }
        } else {
          setError(
            'Tournament not found. The tournament may have been removed or the ID is invalid.'
          );
        }
      } catch (err) {
        console.error('Error loading tournament:', err);
        setError('Failed to load tournament. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  }, [loading, tournamentId]);

  return (
    <div className="relative min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/tournaments"
            className="text-gray-400 hover:text-white transition-colors inline-flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Tournaments
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">
            <p className="mb-6">{error}</p>
            <Button href="/tournaments" variant="primary">
              View All Tournaments
            </Button>
          </div>
        ) : tournament ? (
          <TournamentDetails tournament={tournament} />
        ) : (
          <div className="text-center text-gray-400 py-12">Tournament not found.</div>
        )}
      </div>
    </div>
  );
}
