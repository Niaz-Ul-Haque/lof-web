import React from 'react';
import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'FAQ & Rules | League of Flex',
  description:
    'Find answers to frequently asked questions about League of Flex, our team generator, tournaments, and community guidelines.',
  keywords:
    'League of Legends FAQ, LoL custom games, tournament rules, team balancing, League of Flex help',
  openGraph: {
    title: 'FAQ & Rules | League of Flex',
    description:
      'Get answers to common questions about our League of Legends team generator, tournaments, and community.',
    images: ['/images/logo.png'],
  },
  alternates: {
    canonical: 'https://leagueofflex.com/faq',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
