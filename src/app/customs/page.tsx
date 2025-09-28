/* eslint-disable */
'use client';

import React, { useState } from 'react';
import { CustomsForm } from '@/components/customs/CustomsForm';
import TeamDisplay from '@/components/customs/TeamDisplay';
import CaptainsMode from '@/components/customs/captains/CaptainsMode';
import { CustomMatch } from '@/lib/types';
import { DEFAULT_TIER_POINTS } from '@/lib/constants';

export default function CustomsPage() {
  const [activeTab, setActiveTab] = useState<'balanced' | 'captains'>('balanced');
  const [generatedMatch, setGeneratedMatch] = useState<CustomMatch | null>(null);
  const [previousEntries, setPreviousEntries] = useState<any>(null);

  const handleTeamsGenerated = (match: CustomMatch, entries: any) => {
    setGeneratedMatch(match);
    setPreviousEntries(entries);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 100);
  };

  const handleReset = (entries = null) => {
    setPreviousEntries(entries);
    setGeneratedMatch(null);
  };

  return (
    <div className="relative min-h-screen pt-20 pb-16" style={{ background: '#1d1c24' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">
              Custom 5v5{' '}
              <span className="text-gold" style={{ color: '#d3a536' }}>
                Team Generator
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {activeTab === 'balanced' 
                ? 'Enter 10 player names and ranks to generate balanced teams for your custom matches.'
                : 'Let captains draft their teams from a pool of players.'
              }
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-dark-100 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab('balanced')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'balanced'
                    ? 'bg-gold text-black shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-dark-200'
                }`}
                style={{ backgroundColor: activeTab === 'balanced' ? '#d3a536' : undefined }}
              >
                Balanced 5v5
              </button>
              <button
                onClick={() => setActiveTab('captains')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'captains'
                    ? 'bg-gold text-black shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-dark-200'
                }`}
                style={{ backgroundColor: activeTab === 'captains' ? '#d3a536' : undefined }}
              >
                Captains Mode
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'balanced' ? (
            generatedMatch ? (
              <TeamDisplay
                match={generatedMatch}
                onReset={handleReset}
                previousEntries={previousEntries}
              />
            ) : (
              <CustomsForm onTeamsGenerated={handleTeamsGenerated} previousData={previousEntries} />
            )
          ) : (
            <CaptainsMode />
          )}

          <div className="mt-16 bg-dark-100 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Rank Point Values</h2>
            <p className="text-gray-300 mb-4">
              Our system uses these point values to calculate team balance:
            </p>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-dark-300 text-left">
                    <th className="py-3 px-6 font-medium">Rank</th>
                    <th className="py-3 px-6 font-medium">Code</th>
                    <th className="py-3 px-6 font-medium">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200">
                  {Object.entries(DEFAULT_TIER_POINTS).map(([code, points], index) => (
                    <tr key={code} className={index % 2 === 0 ? 'bg-dark-200' : 'bg-dark-100'}>
                      <td className="py-3 px-6">
                        {code === 'I'
                          ? 'Iron'
                          : code === 'IB'
                            ? 'Iron-Bronze'
                            : code === 'B'
                              ? 'Bronze'
                              : code === 'BS'
                                ? 'Bronze-Silver'
                                : code === 'S'
                                  ? 'Silver'
                                  : code === 'SG'
                                    ? 'Silver-Gold'
                                    : code === 'G'
                                      ? 'Gold'
                                      : code === 'GP'
                                        ? 'Gold-Platinum'
                                        : code === 'P'
                                          ? 'Platinum'
                                          : code === 'PE'
                                            ? 'Platinum-Emerald'
                                            : code === 'E'
                                              ? 'Emerald'
                                              : code === 'ED'
                                                ? 'Emerald-Diamond'
                                                : code === 'D'
                                                  ? 'Diamond'
                                                  : code === 'DM'
                                                    ? 'Diamond-Master'
                                                    : code === 'M'
                                                      ? 'Master'
                                                      : code === 'GM'
                                                        ? 'Grandmaster'
                                                        : code === 'C'
                                                          ? 'Challenger'
                                                          : code}
                      </td>
                      <td className="py-3 px-6">{code}</td>
                      <td className="py-3 px-6">{points as number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-dark-100 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {activeTab === 'balanced' ? 'About Team Generation' : 'About Captains Mode'}
            </h2>
            {activeTab === 'balanced' ? (
              <div className="text-gray-300 space-y-4">
                <p>
                  Our team generator creates balanced 5v5 teams based on player ranks. The algorithm
                  distributes players to minimize the difference in average team strength.
                </p>
                <p>
                  Each rank has an assigned point value that&quot;s used to calculate team balance.
                  The system will attempt to create teams with similar average rank values.
                </p>
                <p>
                  For best results, provide accurate rank information. If role preferences are
                  included, the system will try to respect them while maintaining team balance.
                </p>
              </div>
            ) : (
              <div className="text-gray-300 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gold mb-2">🎯 How to Use Captains Mode</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-white">1. Player Input</h4>
                      <p className="text-sm">Enter 10 players with their ranks using manual entry or bulk import.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">2. Captain Selection</h4>
                      <p className="text-sm">Auto-select finds captains with similar skill levels, or choose manually. Configure draft settings like pick order and timer.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">3. Draft Phase - Multiple Ways to Pick</h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li><strong>🖱️ Drag & Drop:</strong> Drag player cards to team panels</li>
                        <li><strong>🖱️ Double-Click:</strong> Double-click any player card to auto-pick for active team</li>
                        <li><strong>🔲 Click Buttons:</strong> Use "Team A" or "Team B" buttons on player cards</li>
                        <li><strong>⌨️ Keyboard:</strong> Focus a player card and press A or B keys</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">4. Smart Features</h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li><strong>⏰ Turn Timer:</strong> Configurable countdown with auto-pick on timeout</li>
                        <li><strong>🔄 Undo/Reset:</strong> Undo last pick or reset entire draft</li>
                        <li><strong>🤖 Auto-Pick Strategies:</strong> Best fit, highest MMR, or random from top 3</li>
                        <li><strong>📊 Live Stats:</strong> Real-time team balance and point totals</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
