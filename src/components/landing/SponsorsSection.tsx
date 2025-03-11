'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sponsor } from '@/lib/types';

const SponsorsSection: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    if (loading && sponsors.length === 0) {
      const dummySponsors: Sponsor[] = [
        {
          id: '1',
          name: 'WreckBoy Inc.',
          description: 'Premium gaming peripherals and accessories',
          logo: '/images/sponsors/sponsor1.png',
        },
        {
          id: '2',
          name: 'Moyun & Friends Co.',
          description: 'Professional esports tournaments and events',
          logo: '/images/sponsors/sponsor2.png',
        },
        {
          id: '3',
          name: 'Crayfish Energy',
          description: 'Energy drinks designed for gamers',
          logo: '/images/sponsors/sponsor3.png',
        },
        {
          id: '4',
          name: 'Drilled by Drilla.',
          description: 'Streaming equipment and services',
          logo: '/images/sponsors/sponsor4.png',
        },
      ];
      
      setSponsors(dummySponsors);
      setLoading(false);
    }
  }, [loading, sponsors.length]);

  if (sponsors.length === 0 && !loading) {
    return null; // Don't render the section if there are no sponsors
  }

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-12">Our Sponsors</h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-dark-100 rounded-lg p-4 flex flex-col items-center justify-center transition-transform hover:-translate-y-2"
                >
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={sponsor.logo || '/images/logo.png'}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-1">{sponsor.name}</h3>
                  {sponsor.description && (
                    <p className="text-gray-400 text-sm text-center">{sponsor.description}</p>
                  )}
                </a>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 mb-6">
                Interested in sponsoring League of Flex tournaments or events?
              </p>
              <a
                href="https://discord.gg/leagueofflex"
                target='_blank'
                className="inline-flex items-center text-teal hover:text-gold transition-colors font-medium"
              >
                Contact us for sponsorship opportunities
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SponsorsSection;