'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { Announcement } from '@/lib/types';

const AnnouncementsSection: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (loading && announcements.length === 0) {
      const dummyAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'Tournament coming soon with $$$!',
          content: 'Register yourself for our upcoming tournament. More details coming soon!',
          date: new Date().toISOString(),
          pinned: true,
        },
        {
          id: '2',
          title: 'New Ranking System',
          content:
            "We've updated our tier points system for better team balancing. Check the FAQ for details.",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          title: 'Discord Server Upgrade',
          content:
            'Our Discord server has been upgraded with new features! Join us for voice channels, role assignments, and more.',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setAnnouncements(dummyAnnouncements);
      setLoading(false);
    }
  }, [loading, announcements.length]);

  return (
    <section className="py-16 bg-dark-100">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-12">Announcements</h2>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map(announcement => (
              <Card
                key={announcement.id}
                variant={announcement.pinned ? 'highlighted' : 'default'}
                className="p-6"
              >
                {announcement.pinned && (
                  <div className="flex items-center mb-3">
                    <span className="bg-gold text-black text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      PINNED
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>

                <p className="text-gray-400 text-sm mb-4">{formatDate(announcement.date)}</p>

                <div className="text-gray-300 mb-4 line-clamp-4">{announcement.content}</div>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && announcements.length === 0 && (
          <div className="text-center text-gray-400">No announcements available at this time.</div>
        )}
      </div>
    </section>
  );
};

export default AnnouncementsSection;
