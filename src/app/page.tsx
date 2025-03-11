import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import AnnouncementsSection from '@/components/landing/AnnouncementsSection';
import SponsorsSection from '@/components/landing/SponsorsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AnnouncementsSection />
      <SponsorsSection />
    </>
  );
}