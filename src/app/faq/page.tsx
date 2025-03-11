/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import { DEFAULT_TIER_POINTS } from '@/lib/constants';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen?: boolean;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen = false }) => {
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  return (
    <div className="border-b border-dark-200 last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-medium">{question}</h3>
        <svg
          className={`w-5 h-5 transition-transform ${expanded ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <div className="text-gray-300">{answer}</div>
      </div>
    </div>
  );
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<'general' | 'customs' | 'tournaments'>('general');

  return (
    <div className="relative min-h-screen pt-20 pb-16">
      {/* 3JS Background */}
      {/* <ThreeJSBackground variant="random" intensity="high" color1="#D4AF37" color2="#00BCD4" /> */}
      
      {/* Page Content */}
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gold">FAQ</span> & Rules
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find answers to frequently asked questions about League of Flex, our custom team generator,
            tournaments, and community guidelines.
          </p>
        </div>
        
        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-dark-200 rounded-lg p-1">
            <button
              className={`px-6 py-2 text-sm font-medium rounded-md ${
                activeCategory === 'general'
                  ? 'bg-dark-100 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveCategory('general')}
            >
              General
            </button>
            <button
              className={`px-6 py-2 text-sm font-medium rounded-md ${
                activeCategory === 'customs'
                  ? 'bg-dark-100 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveCategory('customs')}
            >
              Customs
            </button>
            <button
              className={`px-6 py-2 text-sm font-medium rounded-md ${
                activeCategory === 'tournaments'
                  ? 'bg-dark-100 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveCategory('tournaments')}
            >
              Tournaments
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* FAQ Content */}
          <div className="lg:col-span-2">
            <div className="bg-dark-100 rounded-lg p-6">
              {/* General FAQs */}
              {activeCategory === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">General Information</h2>
                  
                  <FAQItem
                    question="What is League of Flex?"
                    answer={
                      <p>
                        League of Flex is an esports-themed web app tailored for our community Discord server. It provides two primary functionalities: custom 5v5 team generation for in-house games and tournament management for organized competitions. Our goal is to create balanced and enjoyable gameplay experiences for players of all skill levels.
                      </p>
                    }
                    isOpen={true}
                  />
                  
                  <FAQItem
                    question="How do I join the community?"
                    answer={
                      <p>
                        You can join our community by becoming a member of our Discord server. Click on the "Join Discord" button in the navigation bar or footer to receive an invitation link. Once you're in the server, you'll have access to announcements, event details, and can participate in customs and tournaments.
                      </p>
                    }
                  />
                  
                  <FAQItem
                    question="Is League of Flex affiliated with Riot Games?"
                    answer={
                      <p>
                        No, League of Flex is a community-driven platform and is not affiliated with or endorsed by Riot Games. We're a fan-made platform created to enhance the experience of playing League of Legends with friends and community members.
                      </p>
                    }
                  />
                  
                  <FAQItem
                    question="How do I report bugs or suggest features?"
                    answer={
                      <div>
                        <p>
                          If you encounter any issues or have suggestions for improvements, you can:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Contact the Staff/Moderators in our Discord server</li>
                        </ul>
                        <p className="mt-2">
                          We appreciate your feedback and are constantly working to improve the platform.
                        </p>
                      </div>
                    }
                  />
                  
                  <FAQItem
                    question="How can I support League of Flex?"
                    answer={
                      <div>
                        <p>
                          There are several ways you can support our community:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Invite friends to join the Discord server</li>
                          <li>Participate in customs and tournaments</li>
                          <li>Volunteer to help with tournament organization</li>
                          <li>Provide feedback to help us improve</li>
                          <li>Share your experiences on social media</li>
                        </ul>
                      </div>
                    }
                  />
                </div>
              )}
              
              {/* Customs FAQs */}
              {activeCategory === 'customs' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Custom Games</h2>
                  
                  <FAQItem
                    question="How does the team generation algorithm work?"
                    answer={
                      <div>
                        <p>
                          Our team generation algorithm creates balanced teams by:
                        </p>
                        <ol className="list-decimal pl-6 mt-2 space-y-2">
                          <li>
                            Assigning point values to each player based on their rank using our tier points system
                          </li>
                          <li>
                            Distributing players between two teams to minimize the difference in average team strength
                          </li>
                          <li>
                            Optionally considering role preferences when specified
                          </li>
                          <li>
                            Making final adjustments to ensure the most balanced outcome possible
                          </li>
                        </ol>
                        <p className="mt-2">
                          The goal is to create fair and competitive matches where both teams have approximately equal chances of winning.
                        </p>
                      </div>
                    }
                    isOpen={true}
                  />
                  
                  <FAQItem
                    question="What are the tier points for each rank?"
                    answer={
                      <div>
                        <p>
                          Our system uses the following tier points to balance teams:
                        </p>
                        <div className="mt-2 overflow-x-auto max-h-80 overflow-y-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="bg-dark-300 text-left">
                                <th className="py-2 px-4">Rank</th>
                                <th className="py-2 px-4">Code</th>
                                <th className="py-2 px-4">Points</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(DEFAULT_TIER_POINTS).map(([code, points], index) => (
                                <tr key={code} className={index % 2 === 0 ? 'bg-dark-200' : 'bg-dark-100'}>
                                  <td className="py-2 px-4">
                                    {code === 'I' ? 'Iron' :
                                     code === 'IB' ? 'Iron-Bronze' :
                                     code === 'B' ? 'Bronze' :
                                     code === 'BS' ? 'Bronze-Silver' :
                                     code === 'S' ? 'Silver' :
                                     code === 'SG' ? 'Silver-Gold' :
                                     code === 'G' ? 'Gold' :
                                     code === 'GP' ? 'Gold-Platinum' :
                                     code === 'P' ? 'Platinum' :
                                     code === 'PE' ? 'Platinum-Emerald' :
                                     code === 'E' ? 'Emerald' :
                                     code === 'ED' ? 'Emerald-Diamond' :
                                     code === 'D' ? 'Diamond' :
                                     code === 'DM' ? 'Diamond-Master' :
                                     code === 'M' ? 'Master' :
                                     code === 'GM' ? 'Grandmaster' :
                                     code === 'C' ? 'Challenger' : code}
                                  </td>
                                  <td className="py-2 px-4">{code}</td>
                                  <td className="py-2 px-4">{points}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-2">
                          These values are used by our algorithm to calculate the average strength of each team.
                        </p>
                      </div>
                    }
                  />
                  
                  <FAQItem
                    question="How do I use the Customs page?"
                    answer={
                      <div>
                        <p>
                          Using the Customs page is simple:
                        </p>
                        <ol className="list-decimal pl-6 mt-2 space-y-2">
                          <li>Enter the names of 10 players who will be participating</li>
                          <li>Select the rank for each player using the dropdown menu</li>
                          <li>Optionally, enable and specify role preferences</li>
                          <li>Click "Generate Teams" to create balanced 5v5 teams</li>
                          <li>View the results and copy them to share with your group</li>
                          <li>Click "Generate New Teams" to start over if needed</li>
                        </ol>
                        <p className="mt-2">
                          For accurate team balancing, make sure to input the correct ranks for all players.
                        </p>
                      </div>
                    }
                  />
                  
                  <FAQItem
                    question="Can I save or share the generated teams?"
                    answer={
                      <p>
                        Yes, after generating teams, you can click the "Copy to Clipboard" button to copy a formatted version of the team rosters. You can then paste this information into Discord, chat, or any other platform to share with your group. We're also working on adding features to save your favorite team setups for future reference.
                      </p>
                    }
                  />
                  
                  <FAQItem
                    question="What if I have more or less than 10 players?"
                    answer={
                      <p>
                        Currently, the Customs feature is designed specifically for standard 5v5 games with exactly 10 players. If you have fewer players, you would need to fill in the remaining slots manually. For custom formats with different player counts, you can organize them manually or provide feedback for potential future enhancements to support custom player counts.
                      </p>
                    }
                  />
                </div>
              )}
              
              {/* Tournaments FAQs */}
              {activeCategory === 'tournaments' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Tournaments</h2>
                  
                  <FAQItem
                    question="How do I register my team for a tournament?"
                    answer={
                      <div>
                        <p>
                          To register your team for a tournament:
                        </p>
                        <ol className="list-decimal pl-6 mt-2 space-y-2">
                          <li>Visit the specific tournament page you're interested in</li>
                          <li>Join our discord to register</li>
                          <li>Fill out the registration form with your or your team information</li>
                          <li>Submit the form before the registration deadline</li>
                          <li>Wait for confirmation from the tournament organizers</li>
                        </ol>
                        <p className="mt-2">
                          Make sure to register before the deadline and ensure all team members meet the eligibility requirements specified in the tournament rules.
                        </p>
                      </div>
                    }
                    isOpen={true}
                  />
                  
                  <FAQItem
                    question="What tournament formats do you support?"
                    answer={
                      <div>
                        <p>
                          We support various tournament formats, including:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>
                            <strong>Single Elimination:</strong> Teams are eliminated after one loss
                          </li>
                          <li>
                            <strong>Double Elimination:</strong> Teams are eliminated after two losses
                          </li>
                          <li>
                            <strong>Round Robin:</strong> Each team plays against every other team once
                          </li>
                          <li>
                            <strong>Swiss:</strong> Teams play against opponents with similar records
                          </li>
                          <li>
                            <strong>Custom:</strong> Specialized formats for specific events
                          </li>
                        </ul>
                        <p className="mt-2">
                          The format for each tournament is clearly specified on the tournament page.
                        </p>
                      </div>
                    }
                  />
                  
                  <FAQItem
                    question="How many players can be on a tournament team?"
                    answer={
                      <p>
                        Standard tournament teams consist of 5 main players, but we typically allow up to 2 substitutes for a total of 7 registered players per team. All team members must be registered before the tournament begins. Specific player count requirements may vary by tournament, so always check the individual tournament rules for exact team size regulations.
                      </p>
                    }
                  />
                  
                  <FAQItem
                    question="Are there entry fees for tournaments?"
                    answer={
                      <p>
                        Most of our community tournaments are free to enter. However, some premium tournaments with larger prize pools may have an entry fee. Any required entry fees will be clearly stated on the tournament page. We strive to keep tournaments accessible to all community members while occasionally offering higher-stakes competitions for those interested.
                      </p>
                    }
                  />
                  
                  <FAQItem
                    question="What happens if a team member can't play?"
                    answer={
                      <div>
                        <p>
                          If a team member can't play during a tournament:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>You can use one of your registered substitutes</li>
                          <li>Your team must notify tournament organizers of any substitutions</li>
                          <li>Substitutions must be made before match check-in</li>
                          <li>Only registered substitutes can replace main players</li>
                        </ul>
                        <p className="mt-2">
                          If you don't have enough registered players/substitutes to field a full team, your team may have to forfeit the match according to tournament rules.
                        </p>
                      </div>
                    }
                  />
                  
                  <FAQItem
                    question="How are disputes handled during tournaments?"
                    answer={
                      <p>
                        Disputes during tournaments are handled by our designated tournament administrators. If an issue arises during a match, team captains should immediately notify the tournament admins through the designated channel in our Discord server. Admins will review the situation and make a ruling based on the tournament rules. All admin decisions are final. We recommend taking screenshots of any disputed situations to assist in resolution.
                      </p>
                    }
                  />
                </div>
              )}
            </div>
          </div>
          
     
        </div>
      </div>
    </div>
  );
}