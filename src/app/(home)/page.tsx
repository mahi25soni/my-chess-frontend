"use client";

import GameHistory from "@/components/GameHistory";
import GameOptions from "@/components/GameOptions";
import PlayerStats from "@/components/PlayerStats";
import PaddingWrapper from "@/components/wrappers/PaddingWrapper";

export function HomePage() {
  // This would come from your actual data source
  const playerStats = {
    wins: 247,
    rating: 1850,
    winRate: 64,
    accuracy: 86,
  };

  // Sample game history data
  const gameHistory = [
    {
      id: "1",
      opponent: "Magnus A.",
      datetime: "2024-01-20 15:30",
      gameType: "Blitz",
      result: "Win" as const,
      accuracy: 92,
    },
    {
      id: "2",
      opponent: "AI Level 8",
      datetime: "2024-01-20 14:15",
      gameType: "AI Game",
      result: "Loss" as const,
      accuracy: 88,
    },
    {
      id: "3",
      opponent: "Sarah K.",
      datetime: "2024-01-20 12:45",
      gameType: "Rapid",
      result: "Draw" as const,
      accuracy: 90,
    },
  ];

  return (
    <div>
      <PaddingWrapper>
        <PlayerStats stats={playerStats} />
        <GameOptions />
        <GameHistory games={gameHistory} />
      </PaddingWrapper>
    </div>
  );
}
