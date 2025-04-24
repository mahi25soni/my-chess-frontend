"use client";
import GameHistory from "@/components/GameHistory";
import GameOptions from "@/components/GameOptions";
import PlayerStats from "@/components/PlayerStats";
import PaddingWrapper from "@/components/wrappers/PaddingWrapper";
import ProtectedPage from "@/components/wrappers/ProjectedPageWrapper";
import { useEffect, useState } from "react";
import apiClient from "@/lib/axios.config";
import { useAuth } from "@/context/AuthContext";

export const dynamic = "force-dynamic";

type GameItem = {
  id: string;
  playerOneId: string;
  playerTwoId: string;
  gametypeId: string;
  winnerId: string;
  playerOneColor: string;
  playerTwoColor: string;
  colorWon: string;
  fen: string;
  pgn: string;
  gameHistory: string[];
  matchCompleted: boolean;
  startedAt: string;
  finishedAt: string;
  totalTime: string | null;
  createdAt: string;
  updatedAt: string;
  playerOne: {
    id: string;
    name: string;
  };
  playerTwo: {
    id: string;
    name: string;
  };
  gametype: {
    id: string;
    name: string;
  };
  winner: {
    id: string;
    name: string;
  };
};

export default function HomePage() {
  // This would come from your actual data source
  const { user } = useAuth();

  const [playerBasicStats, setPlayerBasicStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
  });

  const [gamesData, setGamesData] = useState<GameItem[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await apiClient.post("/game/getGameByUser", {
        userId: user?.id,
      });

      if (data?.success) {
        setPlayerBasicStats(data?.data?.playerMetaData);
        setGamesData(data?.data?.games);
      }
    })();
  }, []);

  return (
    <ProtectedPage>
      <PaddingWrapper>
        <PlayerStats stats={playerBasicStats} />
        <GameOptions />
        <GameHistory games={gamesData} />
      </PaddingWrapper>
    </ProtectedPage>
  );
}
