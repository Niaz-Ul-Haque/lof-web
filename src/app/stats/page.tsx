'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LoLStatsDashboard = dynamic(
  () => import('@/components/stats/LoLStatsDashboard'),
  { ssr: false }
);

export default function StatsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="text-4xl font-bold mb-8">LoL Stats Dashboard</h1> */}
      <br />
      <br />
      <br />
      <Suspense fallback={<div>Loading stats...</div>}>
        <LoLStatsDashboard />
      </Suspense>
    </div>
  );
}
