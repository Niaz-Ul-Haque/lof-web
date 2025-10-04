import React from 'react';
import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Custom 5v5 Team Generator | League of Flex',
  description:
    'Create balanced teams for League of Legends custom games. Our algorithm ensures fair matchups based on player ranks. Free team balancing tool with captains mode.',
  keywords:
    'League of Legends team generator, LoL 5v5 customs, balanced teams, team maker, custom games, LoL team balancer, captains mode',
  openGraph: {
    title: 'Custom 5v5 Team Generator | League of Flex',
    description: 'Create perfectly balanced teams for your LoL customs with our free generator',
    url: 'https://leagueofflex.com/customs',
    type: 'website',
    images: [
      {
        url: 'https://leagueofflex.com/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'League of Flex Custom Team Generator',
      },
    ],
  },
  alternates: {
    canonical: 'https://leagueofflex.com/customs',
  },
};

export default function CustomsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
