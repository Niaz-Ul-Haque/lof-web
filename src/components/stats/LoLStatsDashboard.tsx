/* eslint-disable */
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Trophy, TrendingUp, Zap, Target, Calendar, Users, Award, Swords, UserPlus, History } from 'lucide-react';
import Papa from 'papaparse';

// Add TypeScript declaration for window.fs
declare global {
  interface Window {
    fs: {
      readFile(path: string, options: { encoding: string }): Promise<string>;
    };
  }
}



const LoLStatsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  type PlayerStats = {
    discord_username: string;
    display_name?: string;
    total_matches: number;
    win_rate: number;
    wins: number;
    losses: number;
    recent_form: string;
    current_streak: number;
    streak_type?: string;
    longest_win_streak?: number;
    last_played?: string;
    [key: string]: any;
  };

  const [players, setPlayers] = useState<PlayerStats[]>([]);
  type MatchData = {
    match_id: string;
    created_at: string;
    team1_players: string;
    team2_players: string;
    team1_name: string;
    team2_name: string;
    winner: string;
    [key: string]: any;
  };
  const [matchData, setMatchData] = useState<MatchData[]>([]);
  type MatchAnalysis = {
    headToHeadStats: Map<any, any>;
    teammateStats: Map<any, any>;
    playerMatchHistory: Map<any, any>;
    processedMatches: number;
    totalPlayers: number;
  };
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [rankingAlgorithm, setRankingAlgorithm] = useState('comprehensive');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null);

  // Load and process data
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       // Load player stats
  //       const playerStatsContent = await window.fs.readFile('player_stats_rows 2.csv', { encoding: 'utf8' });
  //       type PlayerStats = {
  //         discord_username: string;
  //         display_name?: string;
  //         total_matches: number;
  //         win_rate: number;
  //         wins: number;
  //         losses: number;
  //         recent_form: string;
  //         current_streak: number;
  //         streak_type?: string;
  //         longest_win_streak?: number;
  //         last_played?: string;
  //         [key: string]: any;
  //       };

  //       type MatchData = {
  //         match_id: string;
  //         created_at: string;
  //         team1_players: string;
  //         team2_players: string;
  //         team1_name: string;
  //         team2_name: string;
  //         winner: string;
  //         [key: string]: any;
  //       };

  //       const playerStatsData = Papa.parse<PlayerStats>(playerStatsContent, {
  //         header: true,
  //         dynamicTyping: true,
  //         skipEmptyLines: true
  //       });

  //       // Load match data  
  //       const matchesContent = await window.fs.readFile('matches_rows 2.csv', { encoding: 'utf8' });
  //       const matchesData = Papa.parse<MatchData>(matchesContent, {
  //         header: true,
  //         dynamicTyping: true,
  //         skipEmptyLines: true
  //       });

  //       const validPlayers: PlayerStats[] = playerStatsData.data.filter((p: PlayerStats) => p.discord_username && p.total_matches > 0);
  //       const allMatches: MatchData[] = matchesData.data; // Use ALL matches without strict filtering

  //       // Multiple ranking algorithms
  //       const algorithms = {
  //         comprehensive: (player: { total_matches: any; win_rate: any; recent_form: any; current_streak: any; }) => {
  //           const { total_matches, win_rate, recent_form, current_streak } = player;
  //           let score = win_rate || 0;
  //           const matchWeight = Math.min(total_matches / 50, 1.2);
  //           score *= matchWeight;
            
  //           if (recent_form) {
  //             const recentGames = recent_form.slice(-5);
  //             const recentWins = (recentGames.match(/W/g) || []).length;
  //             const recentWinRate = (recentWins / recentGames.length) * 100;
  //             const formBonus = (recentWinRate - 50) * 0.1;
  //             score += formBonus;
  //           }
            
  //           if (current_streak && current_streak > 2) {
  //             const streakBonus = Math.min(current_streak * 0.5, 3);
  //             score += streakBonus;
  //           }
            
  //           if (total_matches < 10) score *= 0.8;
  //           return Math.round(score * 100) / 100;
  //         },

  //         simple_winrate: (player: { win_rate: any; }) => {
  //           return player.win_rate || 0;
  //         },

  //         bayesian: (player: { total_matches: any; win_rate: any; }) => {
  //           const globalAvg = 50;
  //           const confidence = 20;
  //           const { total_matches, win_rate } = player;
            
  //           const bayesianAvg = ((confidence * globalAvg) + (total_matches * win_rate)) / (confidence + total_matches);
  //           return Math.round(bayesianAvg * 100) / 100;
  //         },

  //         elo_style: (player: { wins: any; losses: any; total_matches: any; }) => {
  //           const baseRating = 1000;
  //           const { wins, losses, total_matches } = player;
  //           if (total_matches === 0) return baseRating;
            
  //           const avgOpponentRating = 1000;
  //           const kFactor = Math.max(32 - (total_matches / 10), 10);
            
  //           let rating = baseRating;
  //           const winProb = 1 / (1 + Math.pow(10, (avgOpponentRating - rating) / 400));
            
  //           rating += kFactor * (wins - (total_matches * winProb));
  //           return Math.round(rating);
  //         },

  //         points_based: (player: { wins: any; total_matches: any; longest_win_streak: any; }) => {
  //           const { wins, total_matches, longest_win_streak } = player;
  //           let points = wins * 3;
            
  //           if (total_matches >= 50) points += 10;
  //           else if (total_matches >= 25) points += 5;
            
  //           if (longest_win_streak >= 10) points += 20;
  //           else if (longest_win_streak >= 5) points += 10;
            
  //           return points;
  //         },

  //         balanced: (player: { total_matches: any; win_rate: any; longest_win_streak: any; }) => {
  //           const { total_matches, win_rate, longest_win_streak } = player;
            
  //           const winRateScore = win_rate || 0;
  //           const activityScore = Math.min((total_matches / 80) * 100, 100);
  //           const streakScore = Math.min((longest_win_streak / 15) * 100, 100);
            
  //           const score = (winRateScore + activityScore + streakScore) / 3;
  //           return Math.round(score * 100) / 100;
  //         }
  //       };

  //       type AlgorithmKey = keyof typeof algorithms;
  //       const rankedPlayers = validPlayers.map(player => {
  //         // Ensure all required properties are present for algorithm functions
  //         const playerWithDefaults = {
  //           ...player,
  //           longest_win_streak: player.longest_win_streak ?? 0,
  //           recent_form: player.recent_form ?? '',
  //           current_streak: player.current_streak ?? 0,
  //           win_rate: player.win_rate ?? 0,
  //           total_matches: player.total_matches ?? 0,
  //           wins: player.wins ?? 0,
  //           losses: player.losses ?? 0,
  //         };
  //         const scores: Record<string, number> = {};
  //         (Object.keys(algorithms) as AlgorithmKey[]).forEach(algo => {
  //           scores[`${algo}_score`] = algorithms[algo](playerWithDefaults);
  //         });
          
  //         return {
  //           ...playerWithDefaults,
  //           ...scores,
  //           display_name: player.display_name || player.discord_username
  //         };
  //       });

  //       // Process match data for head-to-head and teammate analysis
  //       const processMatchAnalysis = () => {
  //         const headToHeadStats = new Map();
  //         const teammateStats = new Map();
  //         const playerMatchHistory = new Map();
          
  //         let processedCount = 0;
          
  //         allMatches.forEach((match) => {
  //           if (!match.team1_players || !match.team2_players || !match.match_id) return;
            
  //           try {
  //             const team1Players = JSON.parse(match.team1_players);
  //             const team2Players = JSON.parse(match.team2_players);
              
  //             if (!Array.isArray(team1Players) || !Array.isArray(team2Players)) return;
              
  //             processedCount++;
              
  //             const team1Won = match.winner === 'team1';
  //             const team2Won = match.winner === 'team2';
              
  //             // Process both teams
  //             const processTeam = (players: any[], won: boolean, teamName: any, opponentTeam: any, opponents: any[]) => {
  //               players.forEach((playerName: any) => {
  //                 const cleanPlayer = String(playerName).trim();
  //                 if (!cleanPlayer) return;
                  
  //                 // Initialize data structures
  //                 if (!headToHeadStats.has(cleanPlayer)) {
  //                   headToHeadStats.set(cleanPlayer, new Map());
  //                 }
  //                 if (!teammateStats.has(cleanPlayer)) {
  //                   teammateStats.set(cleanPlayer, new Map());
  //                 }
  //                 if (!playerMatchHistory.has(cleanPlayer)) {
  //                   playerMatchHistory.set(cleanPlayer, []);
  //                 }
                  
  //                 // Add to match history
  //                 playerMatchHistory.get(cleanPlayer).push({
  //                   matchId: match.match_id,
  //                   date: match.created_at,
  //                   teamName: teamName || 'Unknown Team',
  //                   teammates: players.filter((p: any) => String(p).trim() !== cleanPlayer).map((p: any) => String(p).trim()),
  //                   opponents: opponents.map((p: any) => String(p).trim()),
  //                   result: won ? 'WIN' : (team2Won || team1Won) ? 'LOSS' : 'DRAW',
  //                   opponentTeamName: opponentTeam || 'Unknown Team'
  //                 });
                  
  //                 // Track head-to-head
  //                 opponents.forEach((opponent: any) => {
  //                   const cleanOpponent = String(opponent).trim();
  //                   if (!cleanOpponent) return;
                    
  //                   if (!headToHeadStats.get(cleanPlayer).has(cleanOpponent)) {
  //                     headToHeadStats.get(cleanPlayer).set(cleanOpponent, { wins: 0, losses: 0, draws: 0 });
  //                   }
  //                   const h2h = headToHeadStats.get(cleanPlayer).get(cleanOpponent);
  //                   if (won) h2h.wins++;
  //                   else if (team2Won || team1Won) h2h.losses++;
  //                   else h2h.draws++;
  //                 });
                  
  //                 // Track teammates
  //                 players.forEach((teammate: any) => {
  //                   const cleanTeammate = String(teammate).trim();
  //                   if (cleanTeammate !== cleanPlayer && cleanTeammate) {
  //                     if (!teammateStats.get(cleanPlayer).has(cleanTeammate)) {
  //                       teammateStats.get(cleanPlayer).set(cleanTeammate, { matches_together: 0, wins_together: 0 });
  //                     }
  //                     const teamStat = teammateStats.get(cleanPlayer).get(cleanTeammate);
  //                     teamStat.matches_together++;
  //                     if (won) teamStat.wins_together++;
  //                   }
  //                 });
  //               });
  //             };
              
  //             // Process both teams
  //             processTeam(team1Players, team1Won, match.team1_name, match.team2_name, team2Players);
  //             processTeam(team2Players, team2Won, match.team2_name, match.team1_name, team1Players);
              
  //           } catch (error) {
  //             // Skip invalid matches
  //           }
  //         });
          
  //         return {
  //           headToHeadStats,
  //           teammateStats, 
  //           playerMatchHistory,
  //           processedMatches: processedCount,
  //           totalPlayers: headToHeadStats.size
  //         };
  //       };

  //       const analysis = processMatchAnalysis();
        
  //       setPlayers(rankedPlayers);
  //       setMatchData(allMatches);
  //       setMatchAnalysis(analysis);
  //       setLoading(false);
        
  //     } catch (error) {
  //       console.error('Error loading data:', error);
  //       setLoading(false);
  //     }
  //   };

  //   loadData();
  // }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load player stats using fetch
        const playerStatsRes = await fetch('/player_stats_rows (2).csv');
        const playerStatsContent = await playerStatsRes.text();
        
        const playerStatsData = Papa.parse(playerStatsContent, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });

        // Load match data using fetch
        const matchesRes = await fetch('/matches_rows (2).csv');
        const matchesContent = await matchesRes.text();
        const matchesData = Papa.parse(matchesContent, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });

        const validPlayers = playerStatsData.data.filter((p: any) => p.discord_username && p.total_matches > 0);
        const allMatches = matchesData.data; // Use ALL matches without strict filtering

        // Multiple ranking algorithms
        const algorithms = {
          comprehensive: (player: { total_matches: any; win_rate: any; recent_form: any; current_streak: any; }) => {
            const { total_matches, win_rate, recent_form, current_streak } = player;
            let score = win_rate || 0;
            const matchWeight = Math.min(total_matches / 50, 1.2);
            score *= matchWeight;
            
            if (recent_form) {
              const recentGames = recent_form.slice(-5);
              const recentWins = (recentGames.match(/W/g) || []).length;
              const recentWinRate = (recentWins / recentGames.length) * 100;
              const formBonus = (recentWinRate - 50) * 0.1;
              score += formBonus;
            }
            
            if (current_streak && current_streak > 2) {
              const streakBonus = Math.min(current_streak * 0.5, 3);
              score += streakBonus;
            }
            
            if (total_matches < 10) score *= 0.8;
            return Math.round(score * 100) / 100;
          },

          simple_winrate: (player: { win_rate: any; }) => {
            return player.win_rate || 0;
          },

          bayesian: (player: { total_matches: any; win_rate: any; }) => {
            const globalAvg = 50;
            const confidence = 20;
            const { total_matches, win_rate } = player;
            
            const bayesianAvg = ((confidence * globalAvg) + (total_matches * win_rate)) / (confidence + total_matches);
            return Math.round(bayesianAvg * 100) / 100;
          },

          elo_style: (player: { wins: any; losses: any; total_matches: any; }) => {
            const baseRating = 1000;
            const { wins, losses, total_matches } = player;
            if (total_matches === 0) return baseRating;
            
            const avgOpponentRating = 1000;
            const kFactor = Math.max(32 - (total_matches / 10), 10);
            
            let rating = baseRating;
            const winProb = 1 / (1 + Math.pow(10, (avgOpponentRating - rating) / 400));
            
            rating += kFactor * (wins - (total_matches * winProb));
            return Math.round(rating);
          },

          points_based: (player: { wins: any; total_matches: any; longest_win_streak: any; }) => {
            const { wins, total_matches, longest_win_streak } = player;
            let points = wins * 3;
            
            if (total_matches >= 50) points += 10;
            else if (total_matches >= 25) points += 5;
            
            if (longest_win_streak >= 10) points += 20;
            else if (longest_win_streak >= 5) points += 10;
            
            return points;
          },

          balanced: (player: { total_matches: any; win_rate: any; longest_win_streak: any; }) => {
            const { total_matches, win_rate, longest_win_streak } = player;
            
            const winRateScore = win_rate || 0;
            const activityScore = Math.min((total_matches / 80) * 100, 100);
            const streakScore = Math.min((longest_win_streak / 15) * 100, 100);
            
            const score = (winRateScore + activityScore + streakScore) / 3;
            return Math.round(score * 100) / 100;
          }
        };

        type AlgorithmKey = keyof typeof algorithms;
        const rankedPlayers = validPlayers.map(player => {
          // Ensure all required properties are present for algorithm functions
          const typedPlayer = player as {
            discord_username?: string;
            display_name?: string;
            total_matches?: number;
            win_rate?: number;
            wins?: number;
            losses?: number;
            recent_form?: string;
            current_streak?: number;
            streak_type?: string;
            longest_win_streak?: number;
            last_played?: string;
            [key: string]: any;
          };
          const discord_username = String(
            (player as { discord_username?: string }).discord_username ?? ''
          );
          const playerWithDefaults = {
            ...(typeof typedPlayer === 'object' && typedPlayer !== null ? typedPlayer : {}),
            discord_username,
            longest_win_streak: typedPlayer.longest_win_streak ?? 0,
            recent_form: typedPlayer.recent_form ?? '',
            current_streak: typedPlayer.current_streak ?? 0,
            win_rate: typedPlayer.win_rate ?? 0,
            total_matches: typedPlayer.total_matches ?? 0,
            wins: typedPlayer.wins ?? 0,
            losses: typedPlayer.losses ?? 0,
          };
          const scores: Record<string, number> = {};
          (Object.keys(algorithms) as AlgorithmKey[]).forEach(algo => {
            scores[`${algo}_score`] = algorithms[algo](playerWithDefaults);
          });
          
          return {
            ...playerWithDefaults,
            ...scores,
            display_name: (player as { display_name?: string; discord_username?: string }).display_name || discord_username
          };
        });

        // Process match data for head-to-head and teammate analysis
        const processMatchAnalysis = () => {
          const headToHeadStats = new Map();
          const teammateStats = new Map();
          const playerMatchHistory = new Map();
          
          let processedCount = 0;
          
          (allMatches as MatchData[]).forEach((match: MatchData) => {
            if (!match.team1_players || !match.team2_players || !match.match_id) return;
            
            try {
              const team1Players = JSON.parse(match.team1_players);
              const team2Players = JSON.parse(match.team2_players);
              
              if (!Array.isArray(team1Players) || !Array.isArray(team2Players)) return;
              
              processedCount++;
              
              const team1Won = match.winner === 'team1';
              const team2Won = match.winner === 'team2';
              
              // Process both teams
              const processTeam = (players: any[], won: boolean, teamName: any, opponentTeam: any, opponents: any[]) => {
                players.forEach((playerName: any) => {
                  const cleanPlayer = String(playerName).trim();
                  if (!cleanPlayer) return;
                  
                  // Initialize data structures
                  if (!headToHeadStats.has(cleanPlayer)) {
                    headToHeadStats.set(cleanPlayer, new Map());
                  }
                  if (!teammateStats.has(cleanPlayer)) {
                    teammateStats.set(cleanPlayer, new Map());
                  }
                  if (!playerMatchHistory.has(cleanPlayer)) {
                    playerMatchHistory.set(cleanPlayer, []);
                  }
                  
                  // Add to match history
                  playerMatchHistory.get(cleanPlayer).push({
                    matchId: match.match_id,
                    date: match.created_at,
                    teamName: teamName || 'Unknown Team',
                    teammates: players.filter((p: any) => String(p).trim() !== cleanPlayer).map((p: any) => String(p).trim()),
                    opponents: opponents.map((p: any) => String(p).trim()),
                    result: won ? 'WIN' : (team2Won || team1Won) ? 'LOSS' : 'DRAW',
                    opponentTeamName: opponentTeam || 'Unknown Team'
                  });
                  
                  // Track head-to-head
                  opponents.forEach((opponent: any) => {
                    const cleanOpponent = String(opponent).trim();
                    if (!cleanOpponent) return;
                    
                    if (!headToHeadStats.get(cleanPlayer).has(cleanOpponent)) {
                      headToHeadStats.get(cleanPlayer).set(cleanOpponent, { wins: 0, losses: 0, draws: 0 });
                    }
                    const h2h = headToHeadStats.get(cleanPlayer).get(cleanOpponent);
                    if (won) h2h.wins++;
                    else if (team2Won || team1Won) h2h.losses++;
                    else h2h.draws++;
                  });
                  
                  // Track teammates
                  players.forEach((teammate: any) => {
                    const cleanTeammate = String(teammate).trim();
                    if (cleanTeammate !== cleanPlayer && cleanTeammate) {
                      if (!teammateStats.get(cleanPlayer).has(cleanTeammate)) {
                        teammateStats.get(cleanPlayer).set(cleanTeammate, { matches_together: 0, wins_together: 0 });
                      }
                      const teamStat = teammateStats.get(cleanPlayer).get(cleanTeammate);
                      teamStat.matches_together++;
                      if (won) teamStat.wins_together++;
                    }
                  });
                });
              };
              
              // Process both teams
              processTeam(team1Players, team1Won, match.team1_name, match.team2_name, team2Players);
              processTeam(team2Players, team2Won, match.team2_name, match.team1_name, team1Players);
              
            } catch (error) {
              // Skip invalid matches
            }
          });
          
          return {
            headToHeadStats,
            teammateStats, 
            playerMatchHistory,
            processedMatches: processedCount,
            totalPlayers: headToHeadStats.size
          };
        };

        const analysis = processMatchAnalysis();
        
        setPlayers(rankedPlayers);
        setMatchData(allMatches as MatchData[]);
        setMatchAnalysis(analysis);
        setLoading(false);
        
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePlayerClick = (player: PlayerStats) => {
    setSelectedPlayer(player);
    setActiveTab('player-detail');
    setSearchTerm('');
  };

  // Filter and sort players based on search and selected algorithm
  const filteredPlayers = useMemo(() => {
    let filtered = players;
    
    // Apply search filter
    if (searchTerm) {
      filtered = players.filter(player => {
        const displayName = String(player.display_name || '').toLowerCase();
        const discordUsername = String(player.discord_username || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return displayName.includes(searchLower) || discordUsername.includes(searchLower);
      });
    }
    
    // Sort by selected algorithm
    const scoreKey = `${rankingAlgorithm}_score`;
    return filtered.sort((a, b) => (b[scoreKey] || 0) - (a[scoreKey] || 0));
  }, [players, searchTerm, rankingAlgorithm]);

  // Calculate stats for overview
  const overviewStats = useMemo(() => {
    if (players.length === 0) return {};
    
    const totalMatches = players.reduce((sum, p) => sum + p.total_matches, 0);
    const avgWinRate = players.reduce((sum, p) => sum + (p.win_rate || 0), 0) / players.length;
    const mostActive = players.reduce((max, p) => p.total_matches > max.total_matches ? p : max);
    const highestWinRate = players.filter(p => p.total_matches >= 20).reduce((max, p) => (p.win_rate || 0) > (max.win_rate || 0) ? p : max);
    const longestStreak = players.reduce((max, p) => (p.longest_win_streak || 0) > (max.longest_win_streak || 0) ? p : max);
    
    // Sort by comprehensive score for top 5
    const topPlayers = [...players].sort((a, b) => (b.comprehensive_score || 0) - (a.comprehensive_score || 0));
    
    return {
      totalPlayers: players.length,
      totalMatches,
      avgWinRate: Math.round(avgWinRate * 100) / 100,
      mostActive,
      highestWinRate,
      longestStreak,
      topPlayers
    };
  }, [players]);

  const formatRecentForm = (form: string) => {
    if (!form) return '';
    return form.split('').map((result: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, i: React.Key | null | undefined) => (
      <span 
        key={i}
        className={`inline-block w-6 h-6 text-xs font-bold rounded-full text-white text-center leading-6 mr-1 ${
          result === 'W' ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {result}
      </span>
    ));
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Users className="w-4 h-4" /> },
    { id: 'rankings', label: 'Overall Rankings', icon: <Trophy className="w-4 h-4" /> },
    { id: 'active', label: 'Most Active', icon: <Calendar className="w-4 h-4" /> },
    { id: 'winrate', label: 'Best Win Rates', icon: <Target className="w-4 h-4" /> },
    { id: 'streaks', label: 'Streaks', icon: <Zap className="w-4 h-4" /> },
    { id: 'form', label: 'Recent Form', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'matches', label: 'Match History', icon: <History className="w-4 h-4" /> }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-white">{overviewStats.totalPlayers}</div>
          <div className="text-amber-200">Total Players</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-white">{overviewStats.totalMatches}</div>
          <div className="text-amber-200">Total Matches Played</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-white">{overviewStats.avgWinRate}%</div>
          <div className="text-amber-200">Average Win Rate</div>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-400/20 to-amber-600/20 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Most Active Player</h3>
          </div>
          <div className="text-2xl font-bold text-yellow-300">{overviewStats.mostActive?.display_name}</div>
          <div className="text-yellow-200">{overviewStats.mostActive?.total_matches} matches played</div>
        </div>

        <div className="bg-gradient-to-br from-amber-400/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-white">Highest Win Rate</h3>
          </div>
          <div className="text-2xl font-bold text-amber-300">{overviewStats.highestWinRate?.display_name}</div>
          <div className="text-amber-200">{overviewStats.highestWinRate?.win_rate}% (20+ matches)</div>
        </div>

        <div className="bg-gradient-to-br from-orange-400/20 to-red-600/20 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl font-bold text-white">Longest Win Streak</h3>
          </div>
          <div className="text-2xl font-bold text-orange-300">{overviewStats.longestStreak?.display_name}</div>
          <div className="text-orange-200">{overviewStats.longestStreak?.longest_win_streak} wins in a row</div>
        </div>
      </div>

      {/* Top 5 Preview */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Top 5 Overall Rankings
        </h3>
        <div className="space-y-4">
          {(overviewStats.topPlayers || []).slice(0, 5).map((player, index) => (
            <div key={player.discord_username} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-white w-8">{getRankIcon(index + 1)}</div>
                <div>
                  <button
                    onClick={() => handlePlayerClick(player as PlayerStats)}
                    className="text-lg font-semibold text-amber-300 hover:text-amber-100 underline cursor-pointer"
                  >
                    {player.display_name}
                  </button>
                  <div className="text-sm text-amber-200">Score: {player.comprehensive_score}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{player.win_rate}% WR</div>
                <div className="text-amber-200 text-sm">{player.total_matches} matches</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSearchResults = () => {
    if (!searchTerm) return null;
    
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-white mb-4">
          Search Results for "{searchTerm}" ({filteredPlayers.length} found)
        </h3>
        {filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlayers.slice(0, 12).map((player, index) => (
              <div key={player.discord_username} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all">
                <button
                  onClick={() => handlePlayerClick(player as PlayerStats)}
                  className="w-full text-left"
                >
                  <div className="text-lg font-semibold text-amber-300 hover:text-amber-100">
                    {player.display_name}
                  </div>
                  <div className="text-sm text-amber-200 mt-1">@{player.discord_username}</div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-white">{player.win_rate}% WR</span>
                    <span className="text-amber-200">{player.total_matches} matches</span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-amber-200 py-8">
            No players found matching "{searchTerm}"
          </div>
        )}
      </div>
    );
  };

  const renderPlayerDetail = (player: PlayerStats) => {
    const algorithmOptions = [
      { value: 'comprehensive', label: 'Comprehensive' },
      { value: 'simple_winrate', label: 'Simple Win Rate' },
      { value: 'bayesian', label: 'Bayesian Average' },
      { value: 'elo_style', label: 'ELO-Style Rating' },
      { value: 'points_based', label: 'Points System' },
      { value: 'balanced', label: 'Balanced Score' }
    ];

    const getPlayerRank = (algorithm: string) => {
      const sortedPlayers = [...players].sort((a, b) => (b[`${algorithm}_score`] || 0) - (a[`${algorithm}_score`] || 0));
      return sortedPlayers.findIndex(p => p.discord_username === player.discord_username) + 1;
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-white">{player.display_name}</h2>
            <button
              onClick={() => setActiveTab('overview')}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
            >
              ← Back to Overview
            </button>
          </div>
          <div className="text-amber-200">@{player.discord_username}</div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white">{player.total_matches}</div>
            <div className="text-amber-200">Total Matches</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400">{player.wins}</div>
            <div className="text-amber-200">Wins</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-red-400">{player.losses}</div>
            <div className="text-amber-200">Losses</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400">{player.win_rate}%</div>
            <div className="text-amber-200">Win Rate</div>
          </div>
        </div>

        {/* Algorithm Rankings */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-6">Rankings Across All Algorithms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {algorithmOptions.map(algo => (
              <div key={algo.value} className="bg-white/5 rounded-lg p-4">
                <div className="text-white font-semibold">{algo.label}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-bold text-amber-300">#{getPlayerRank(algo.value)}</span>
                  <span className="text-white">{player[`${algo.value}_score`] || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Streak Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-amber-200">Longest Win Streak:</span>
                <span className="text-2xl font-bold text-green-400">{player.longest_win_streak || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-200">Current Streak:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white">{player.current_streak || 0}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    player.streak_type === 'WIN' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {player.streak_type || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Form</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-amber-200">Last 10 Games:</span>
                <div className="flex gap-1">
                  {formatRecentForm(player.recent_form)}
                </div>
              </div>
              <div className="text-sm text-amber-300">
                Last Played: {player.last_played ? new Date(player.last_played).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* All Matches This Player Participated In */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">All Matches Participated ({
            matchData.filter(match => {
              try {
                if (!match.team1_players || !match.team2_players) return false;
                const t1 = JSON.parse(match.team1_players);
                const t2 = JSON.parse(match.team2_players);
                return t1.includes(player.discord_username) || t2.includes(player.discord_username);
              } catch {
                return false;
              }
            }).length
          })</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {matchData
              .filter(match => {
                try {
                  if (!match.team1_players || !match.team2_players) return false;
                  const t1 = JSON.parse(match.team1_players);
                  const t2 = JSON.parse(match.team2_players);
                  return t1.includes(player.discord_username) || t2.includes(player.discord_username);
                } catch {
                  return false;
                }
              })
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((match, index) => {
                let team1Players, team2Players, playerTeam, result;
                try {
                  team1Players = JSON.parse(match.team1_players || '[]');
                  team2Players = JSON.parse(match.team2_players || '[]');
                  
                  const onTeam1 = team1Players.includes(player.discord_username);
                  const onTeam2 = team2Players.includes(player.discord_username);
                  
                  if (onTeam1) {
                    playerTeam = match.team1_name;
                    result = match.winner === 'team1' ? 'WIN' : match.winner === 'team2' ? 'LOSS' : 'DRAW';
                  } else if (onTeam2) {
                    playerTeam = match.team2_name;
                    result = match.winner === 'team2' ? 'WIN' : match.winner === 'team1' ? 'LOSS' : 'DRAW';
                  } else {
                    return null;
                  }
                  
                } catch (e) {
                  return null;
                }
                
                return (
                  <div key={`${match.match_id}-${index}`} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          result === 'WIN' ? 'bg-green-500 text-white' : 
                          result === 'LOSS' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {result}
                        </span>
                        <span className="text-white font-semibold">{match.team1_name} vs {match.team2_name}</span>
                        <span className="text-amber-300 text-sm">({playerTeam})</span>
                      </div>
                      <span className="text-amber-200 text-sm">
                        {new Date(match.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-amber-200 font-semibold mb-1">Team 1: {match.team1_name}</div>
                        <div className="text-white">{team1Players.join(', ')}</div>
                      </div>
                      <div>
                        <div className="text-amber-200 font-semibold mb-1">Team 2: {match.team2_name}</div>
                        <div className="text-white">{team2Players.join(', ')}</div>
                      </div>
                    </div>
                  </div>
                );
              }).filter(Boolean)}
          </div>
        </div>

        {/* Head-to-Head Stats */}
        {matchAnalysis && matchAnalysis.headToHeadStats && matchAnalysis.headToHeadStats.has(player.discord_username) && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Head-to-Head Records (Top 10)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2 px-4 text-white">Opponent</th>
                    <th className="text-left py-2 px-4 text-white">W-L-D</th>
                    <th className="text-left py-2 px-4 text-white">Win Rate</th>
                    <th className="text-left py-2 px-4 text-white">Total Games</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.from(matchAnalysis.headToHeadStats.get(player.discord_username).entries()) as [string, any][])
                    .sort(([, a], [, b]) => (b.wins + b.losses + b.draws) - (a.wins + a.losses + a.draws))
                    .slice(0, 10)
                    .map(([opponent, stats]) => {
                      const total = stats.wins + stats.losses + stats.draws;
                      const winRate = total > 0 ? ((stats.wins / total) * 100).toFixed(1) : '0.0';
                      return (
                        <tr key={opponent} className="border-b border-white/10">
                          <td className="py-2 px-4 text-amber-300">{opponent}</td>
                          <td className="py-2 px-4 text-white">{stats.wins}-{stats.losses}-{stats.draws}</td>
                          <td className="py-2 px-4 text-white">{winRate}%</td>
                          <td className="py-2 px-4 text-white">{total}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Best Teammates */}
        {matchAnalysis && matchAnalysis.teammateStats && matchAnalysis.teammateStats.has(player.discord_username) && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Best Teammates (3+ games together)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2 px-4 text-white">Teammate</th>
                    <th className="text-left py-2 px-4 text-white">W-L</th>
                    <th className="text-left py-2 px-4 text-white">Win Rate</th>
                    <th className="text-left py-2 px-4 text-white">Games Together</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.from(matchAnalysis.teammateStats.get(player.discord_username).entries()) as [string, any][])
                    .filter(([, stats]) => stats.matches_together >= 3)
                    .sort(([,a], [,b]) => {
                      const aWinRate = a.matches_together > 0 ? a.wins_together / a.matches_together : 0;
                      const bWinRate = b.matches_together > 0 ? b.wins_together / b.matches_together : 0;
                      return bWinRate - aWinRate;
                    })
                    .slice(0, 10)
                    .map(([teammate, stats]) => {
                      const winRate = stats.matches_together > 0 ? ((stats.wins_together / stats.matches_together) * 100).toFixed(1) : '0.0';
                      const losses = stats.matches_together - stats.wins_together;
                      return (
                        <tr key={teammate} className="border-b border-white/10">
                          <td className="py-2 px-4 text-amber-300">{teammate}</td>
                          <td className="py-2 px-4 text-white">{stats.wins_together}-{losses}</td>
                          <td className="py-2 px-4 text-white">{winRate}%</td>
                          <td className="py-2 px-4 text-white">{stats.matches_together}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Match History */}
        {matchAnalysis && matchAnalysis.playerMatchHistory && matchAnalysis.playerMatchHistory.has(player.discord_username) && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Match History (Last 10)</h3>
            <div className="space-y-3">
              {matchAnalysis.playerMatchHistory.get(player.discord_username)
                .slice(-10)
                .reverse()
                .map((match: { matchId: any; result: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; teamName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; opponentTeamName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; date: string | number | Date; teammates: any[]; opponents: any[]; }, index: any) => (
                  <div key={`${match.matchId}-${index}`} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          match.result === 'WIN' ? 'bg-green-500 text-white' : 
                          match.result === 'LOSS' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {match.result}
                        </span>
                        <span className="text-white font-semibold">{match.teamName} vs {match.opponentTeamName}</span>
                      </div>
                      <span className="text-amber-200 text-sm">
                        {match.date ? new Date(match.date).toLocaleDateString() : 'Unknown date'}
                      </span>
                    </div>
                    <div className="text-sm text-amber-300">
                      <div>Teammates: {match.teammates && match.teammates.length > 0 ? match.teammates.join(', ') : 'None'}</div>
                      <div>Opponents: {match.opponents && match.opponents.length > 0 ? match.opponents.join(', ') : 'None'}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPlayerTable = (data: any[], columns: any[], title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              {columns.map((col: { key: React.Key | null | undefined; label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                <th key={col.key} className="text-left py-3 px-4 text-white font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((player: { [x: string]: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; discord_username: React.Key | null | undefined; display_name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: any) => (
              <tr key={player.discord_username} className="border-b border-white/10 hover:bg-white/5">
                {columns.map((col: { key: React.Key | null | undefined; render: (arg0: any, arg1: any) => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                  <td key={col.key} className="py-3 px-4 text-white">
                    {col.key === 'display_name' ? (
                      <button
                        onClick={() => handlePlayerClick(player as PlayerStats)}
                        className="text-amber-300 hover:text-amber-100 font-semibold underline cursor-pointer"
                      >
                        {player.display_name}
                      </button>
                    ) : col.render ? col.render(player, index) : (typeof col.key === 'string' ? player[col.key] : '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTabContent = () => {
    const data = filteredPlayers;

    // Show player detail if selected
    if (activeTab === 'player-detail' && selectedPlayer) {
      return renderPlayerDetail(selectedPlayer);
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div>
            {renderSearchResults()}
            {renderOverview()}
          </div>
        );

      case 'rankings':
        const algorithmOptions = [
          { value: 'comprehensive', label: 'Comprehensive (Win Rate + Activity + Form + Streaks)', description: 'Balanced algorithm considering all factors' },
          { value: 'simple_winrate', label: 'Simple Win Rate', description: 'Pure win percentage only' },
          { value: 'bayesian', label: 'Bayesian Average', description: 'Accounts for sample size uncertainty' },
          { value: 'elo_style', label: 'ELO-Style Rating', description: 'Chess-style rating system' },
          { value: 'points_based', label: 'Points System', description: 'Points for wins, activity, and streaks' },
          { value: 'balanced', label: 'Balanced Score', description: 'Equal weight to win rate, activity, and streaks' }
        ];

        const currentScoreKey = `${rankingAlgorithm}_score`;
        
        return (
          <div className="space-y-6">
            {/* Algorithm Selection */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Ranking Algorithm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {algorithmOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setRankingAlgorithm(option.value)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      rankingAlgorithm === option.value
                        ? 'bg-amber-500 text-white'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold text-sm">{option.label}</div>
                    <div className="text-xs opacity-80 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
              
              {/* Algorithm Details */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-amber-200">
                  <strong>Current Algorithm:</strong> {algorithmOptions.find(opt => opt.value === rankingAlgorithm)?.label}
                </div>
                <div className="text-xs text-amber-300 mt-2">
                  {rankingAlgorithm === 'comprehensive' && 'Factors: Win Rate (weighted by match volume) + Recent Form (last 5 games) + Current Streak + Activity Bonus'}
                  {rankingAlgorithm === 'simple_winrate' && 'Pure win percentage - no other factors considered'}
                  {rankingAlgorithm === 'bayesian' && 'Uses Bayesian averaging to account for sample size - players with fewer games are adjusted toward the global average'}
                  {rankingAlgorithm === 'elo_style' && 'Chess-style rating starting at 1000, adjusted based on wins/losses with diminishing K-factor'}
                  {rankingAlgorithm === 'points_based' && '3 points per win + activity bonuses (5-10 pts) + streak bonuses (10-20 pts)'}
                  {rankingAlgorithm === 'balanced' && 'Equal weight (33.3% each) to: Win Rate + Activity Level + Longest Streak'}
                </div>
              </div>
            </div>

            {/* Rankings Table */}
            {renderPlayerTable(data, [
              { key: 'rank', label: 'Rank', render: (_: any, index: number) => getRankIcon(index + 1) },
              { key: 'display_name', label: 'Player' },
              { key: currentScoreKey, label: 'Score', render: (player: { [x: string]: any; }) => player[currentScoreKey] || 0 },
              { key: 'win_rate', label: 'Win Rate', render: (player: { win_rate: any; }) => `${player.win_rate}%` },
              { key: 'total_matches', label: 'Matches' },
              { key: 'recent_form', label: 'Recent Form', render: (player: { recent_form: any; }) => formatRecentForm(player.recent_form) }
            ], `Overall Rankings (${algorithmOptions.find(opt => opt.value === rankingAlgorithm)?.label})`)}
          </div>
        );

      case 'active':
        const byActivity = [...data].sort((a, b) => b.total_matches - a.total_matches);
        return renderPlayerTable(byActivity, [
          { key: 'rank', label: 'Rank', render: (_: any, index: number) => `#${index + 1}` },
          { key: 'display_name', label: 'Player' },
          { key: 'total_matches', label: 'Total Matches' },
          { key: 'wins', label: 'Wins' },
          { key: 'losses', label: 'Losses' },
          { key: 'win_rate', label: 'Win Rate', render: (player: { win_rate: any; }) => `${player.win_rate}%` }
        ], 'Most Active Players');

      case 'winrate':
        const byWinRate = [...data].filter(p => p.total_matches >= 10).sort((a, b) => b.win_rate - a.win_rate);
        return renderPlayerTable(byWinRate, [
          { key: 'rank', label: 'Rank', render: (_: any, index: number) => `#${index + 1}` },
          { key: 'display_name', label: 'Player' },
          { key: 'win_rate', label: 'Win Rate', render: (player: { win_rate: any; }) => `${player.win_rate}%` },
          { key: 'total_matches', label: 'Matches' },
          { key: 'wins', label: 'Wins' },
          { key: 'losses', label: 'Losses' }
        ], 'Best Win Rates (10+ matches)');

      case 'streaks':
        const byStreaks = [...data].sort((a, b) => (b.longest_win_streak || 0) - (a.longest_win_streak || 0));
        return renderPlayerTable(byStreaks, [
          { key: 'rank', label: 'Rank', render: (_: any, index: number) => `#${index + 1}` },
          { key: 'display_name', label: 'Player' },
          { key: 'longest_win_streak', label: 'Longest Streak' },
          { key: 'current_streak', label: 'Current Streak' },
          { key: 'streak_type', label: 'Streak Type', render: (player: { streak_type: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              player.streak_type === 'WIN' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {player.streak_type}
            </span>
          )},
          { key: 'win_rate', label: 'Win Rate', render: (player: { win_rate: any; }) => `${player.win_rate}%` }
        ], 'Win Streaks');

      case 'form':
        const byForm = [...data].filter(p => p.recent_form).sort((a, b) => {
          const getRecentWinRate = (form: string | any[]) => {
            if (!form) return 0;
            const recent = form.slice(-5);
            return (typeof recent === 'string' ? (recent.match(/W/g) || []).length / recent.length : 0);
          };
          return getRecentWinRate(b.recent_form) - getRecentWinRate(a.recent_form);
        });
        return renderPlayerTable(byForm, [
          { key: 'rank', label: 'Rank', render: (_: any, index: number) => `#${index + 1}` },
          { key: 'display_name', label: 'Player' },
          { key: 'recent_form', label: 'Recent Form (Last 5)', render: (player: { recent_form: string; }) => formatRecentForm(typeof player.recent_form === 'string' ? player.recent_form.slice(-5) : '') },
          { key: 'win_rate', label: 'Overall WR', render: (player: { win_rate: any; }) => `${player.win_rate}%` },
          { key: 'total_matches', label: 'Matches' }
        ], 'Recent Form (Last 5 Games)');

      case 'headtohead':
        if (!matchAnalysis || !matchAnalysis.headToHeadStats || matchAnalysis.headToHeadStats.size === 0) {
          return (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-center text-amber-200 py-8">
                {!matchAnalysis ? "Processing match data..." : "No head-to-head data available"}
              </div>
            </div>
          );
        }
        
        // Find the most competitive rivalries
        const rivalries = [];
        try {
          for (const [player, opponents] of matchAnalysis.headToHeadStats) {
            for (const [opponent, stats] of opponents) {
              const total = stats.wins + stats.losses + stats.draws;
              if (total >= 3) {
                rivalries.push({
                  player1: player,
                  player2: opponent,
                  p1_wins: stats.wins,
                  p1_losses: stats.losses,
                  p1_draws: stats.draws,
                  total_games: total,
                  p1_winrate: ((stats.wins / total) * 100).toFixed(1)
                });
              }
            }
          }
          
          rivalries.sort((a, b) => b.total_games - a.total_games);
        } catch (error) {
          console.error("Error processing rivalries:", error);
        }
        
        return (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-6">Biggest Rivalries (3+ games)</h3>
            {rivalries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white font-semibold">Player 1</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">vs</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Player 2</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Record</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">P1 Win Rate</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Total Games</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rivalries.slice(0, 20).map((rivalry, index) => (
                      <tr key={`${rivalry.player1}-${rivalry.player2}-${index}`} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4 text-amber-300">{rivalry.player1}</td>
                        <td className="py-3 px-4 text-white">vs</td>
                        <td className="py-3 px-4 text-amber-300">{rivalry.player2}</td>
                        <td className="py-3 px-4 text-white">{rivalry.p1_wins}-{rivalry.p1_losses}-{rivalry.p1_draws}</td>
                        <td className="py-3 px-4 text-white">{rivalry.p1_winrate}%</td>
                        <td className="py-3 px-4 text-white">{rivalry.total_games}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-amber-200 py-8">No rivalries found with 3+ games</div>
            )}
          </div>
        );

      case 'teammates':
        if (!matchAnalysis || !matchAnalysis.teammateStats || matchAnalysis.teammateStats.size === 0) {
          return (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-center text-amber-200 py-8">
                {!matchAnalysis ? "Processing teammate data..." : "No teammate data available"}
              </div>
            </div>
          );
        }
        
        const teammatePairs = [];
        try {
          for (const [player, teammates] of matchAnalysis.teammateStats) {
            for (const [teammate, stats] of teammates) {
              if (stats.matches_together >= 3) {
                const winRate = (stats.wins_together / stats.matches_together) * 100;
                teammatePairs.push({
                  player1: player,
                  player2: teammate,
                  wins: stats.wins_together,
                  total: stats.matches_together,
                  losses: stats.matches_together - stats.wins_together,
                  win_rate: winRate.toFixed(1)
                });
              }
            }
          }
          
          teammatePairs.sort((a, b) => parseFloat(b.win_rate) - parseFloat(a.win_rate));
        } catch (error) {
          console.error("Error processing teammates:", error);
        }
        
        return (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-6">Best Teammate Combinations (3+ games)</h3>
            {teammatePairs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white font-semibold">Player 1</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">+</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Player 2</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">W-L</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Win Rate</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Games Together</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teammatePairs.slice(0, 20).map((pair, index) => (
                      <tr key={`${pair.player1}-${pair.player2}-${index}`} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4 text-amber-300">{pair.player1}</td>
                        <td className="py-3 px-4 text-white">+</td>
                        <td className="py-3 px-4 text-amber-300">{pair.player2}</td>
                        <td className="py-3 px-4 text-white">{pair.wins}-{pair.losses}</td>
                        <td className="py-3 px-4 text-white">{pair.win_rate}%</td>
                        <td className="py-3 px-4 text-white">{pair.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-amber-200 py-8">No teammate combinations found with 3+ games</div>
            )}
          </div>
        );

      case 'matches':
        return (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-6">Recent Match History ({matchData.length} matches)</h3>
            {matchData.length > 0 ? (
              <div className="space-y-4">
                {matchData
                  .filter(m => m.created_at && m.match_id)
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 50)
                  .map(match => {
                    let team1Players, team2Players;
                    try {
                      team1Players = JSON.parse(match.team1_players || '[]');
                      team2Players = JSON.parse(match.team2_players || '[]');
                      
                      if (!Array.isArray(team1Players)) team1Players = [];
                      if (!Array.isArray(team2Players)) team2Players = [];
                    } catch (e) {
                      return null;
                    }
                    
                    const getWinnerInfo = () => {
                      if (match.winner === 'team1') return { winner: match.team1_name || 'Team 1', color: 'text-green-400' };
                      if (match.winner === 'team2') return { winner: match.team2_name || 'Team 2', color: 'text-green-400' };
                      return { winner: 'Draw/Unfinished', color: 'text-gray-400' };
                    };
                    
                    const winnerInfo = getWinnerInfo();
                    
                    return (
                      <div key={match.match_id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-amber-300 font-semibold">{match.team1_name || 'Team 1'}</span>
                            <span className="text-white">vs</span>
                            <span className="text-amber-300 font-semibold">{match.team2_name || 'Team 2'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`font-semibold ${winnerInfo.color}`}>
                              Winner: {winnerInfo.winner}
                            </span>
                            <span className="text-amber-200 text-sm">
                              {new Date(match.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-amber-200 font-semibold mb-1">Team 1: {match.team1_name || 'Team 1'}</div>
                            <div className="text-white">{team1Players.length > 0 ? team1Players.join(', ') : 'No players listed'}</div>
                          </div>
                          <div>
                            <div className="text-amber-200 font-semibold mb-1">Team 2: {match.team2_name || 'Team 2'}</div>
                            <div className="text-white">{team2Players.length > 0 ? team2Players.join(', ') : 'No players listed'}</div>
                          </div>
                        </div>
                      </div>
                    );
                  }).filter(Boolean)}
              </div>
            ) : (
              <div className="text-center text-amber-200 py-8">No matches found</div>
            )}
          </div>
        );

      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading League of Flex stats and match data...</div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 rounded-2xl">      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🏆 League of Flex Custom Stats
          </h1>
          <p className="text-xl text-amber-200">Season 1 Leaderboard & Analytics</p>
        </div>

        {/* Search Bar */}
        {activeTab !== 'player-detail' && (
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        {activeTab !== 'player-detail' && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {renderTabContent()}

        {/* Footer */}
        <div className="mt-12 text-center text-amber-200">
          <p>🎮 Thanks for an amazing Season 1! • Total matches: {matchData?.length || overviewStats.totalMatches} • Players: {overviewStats.totalPlayers}</p>
          {matchAnalysis && (
            <p className="text-sm mt-2">
              Match Analysis: {matchAnalysis.processedMatches || 0} processed, {matchAnalysis.totalPlayers || 0} players with data
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoLStatsDashboard;