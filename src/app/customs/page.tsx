"use client";

import React, { useState } from "react";
import { CustomsForm } from "@/components/customs/CustomsForm";
import TeamDisplay from "@/components/customs/TeamDisplay";
import { CustomMatch } from "@/lib/types";
import { DEFAULT_TIER_POINTS } from "@/lib/constants";

export default function CustomsPage() {
  const [generatedMatch, setGeneratedMatch] = useState<CustomMatch | null>(
    null
  );

  const handleTeamsGenerated = (match: CustomMatch) => {
    setGeneratedMatch(match);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleReset = () => {
    setGeneratedMatch(null);
  };

  return (
    <div className="relative min-h-screen pt-20 pb-16">
      {/* 3JS Background */}
      {/* <ThreeJSBackground  intensity="low" /> */}

      {/* Page Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">
              Custom 5v5 <span className="text-gold">Team Generator</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Enter 10 player names and ranks to generate balanced teams for
              your custom matches.
            </p>
          </div>

          {/* Main Content */}
          {generatedMatch ? (
            <TeamDisplay match={generatedMatch} onReset={handleReset} />
          ) : (
            <CustomsForm onTeamsGenerated={handleTeamsGenerated} />
          )}

          {/* Information Section - Tier Points */}
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
                  {Object.entries(DEFAULT_TIER_POINTS).map(
                    ([code, points], index) => (
                      <tr
                        key={code}
                        className={index % 2 === 0 ? "bg-dark-200" : "bg-dark-100"}
                      >
                        <td className="py-3 px-6">
                          {code === "I"
                            ? "Iron"
                            : code === "IB"
                            ? "Iron-Bronze"
                            : code === "B"
                            ? "Bronze"
                            : code === "BS"
                            ? "Bronze-Silver"
                            : code === "S"
                            ? "Silver"
                            : code === "SG"
                            ? "Silver-Gold"
                            : code === "G"
                            ? "Gold"
                            : code === "GP"
                            ? "Gold-Platinum"
                            : code === "P"
                            ? "Platinum"
                            : code === "PE"
                            ? "Platinum-Emerald"
                            : code === "E"
                            ? "Emerald"
                            : code === "ED"
                            ? "Emerald-Diamond"
                            : code === "D"
                            ? "Diamond"
                            : code === "DM"
                            ? "Diamond-Master"
                            : code === "M"
                            ? "Master"
                            : code === "GM"
                            ? "Grandmaster"
                            : code === "C"
                            ? "Challenger"
                            : code}
                        </td>
                        <td className="py-3 px-6">{code}</td>
                        <td className="py-3 px-6">{points as number}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-8 bg-dark-100 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">About Team Generation</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Our team generator creates balanced 5v5 teams based on player
                ranks. The algorithm distributes players to minimize the
                difference in average team strength.
              </p>
              <p>
                Each rank has an assigned point value that&quot;s used to calculate
                team balance. The system will attempt to create teams with
                similar average rank values.
              </p>
              <p>
                For best results, provide accurate rank information. If role
                preferences are included, the system will try to respect them
                while maintaining team balance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}