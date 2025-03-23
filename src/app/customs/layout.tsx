import React from 'react';
import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Custom 5v5 Team Generator | League of Flex',
  description:
    'Create balanced teams for League of Legends custom games. Our algorithm ensures fair matchups based on player ranks.',
  openGraph: {
    title: 'Custom 5v5 Team Generator | League of Flex',
    description: 'Create perfectly balanced teams for your LoL customs',
    images: ['/images/logo.png'],
  },
};

export default function CustomsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
