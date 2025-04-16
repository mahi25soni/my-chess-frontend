"use client";
import apiClient from "@/lib/axios.config";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type GameButtonProps = {
  label: string;
  onClick: () => void;
  primary?: boolean;
};

export function GameButton({ label, onClick, primary = false }: GameButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`button-hover py-3 px-4 border border-border-basic rounded-yes text-center w-full  ${
        primary ? "bg-blue text-white" : " text-off-white"
      }  hover:border-blue`}
    >
      {label}
    </button>
  );
}

export default function GameOptions() {
  // cm9i374u30000o8k7kgcaiprl

  const [gameTypes, setGameTypes] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await apiClient.get("/gametype/get");
      if (data?.success) {
        setGameTypes(data?.data);
      }
    })();
  }, []);

  const handleGameTypeClick = (gameTypeId: string) => {
    router.push(`/game?gameTypeId=${gameTypeId}`);
  };

  return (
    <div className="grid grid-cols-4 gap-4 mt-6">
      <GameButton
        label="Start New Game"
        onClick={() => {
          /* handle click */
          handleGameTypeClick("cm9i374u30000o8k7kgcaiprl");
        }}
        primary={true}
      />
      {gameTypes.map((gameType) => (
        <GameButton
          key={gameType.id}
          label={`Start ${gameType.name} Game`}
          onClick={() => {
            /* handle click */
            handleGameTypeClick(gameType.id);
          }}
          primary={true}
        />
      ))}
      <GameButton
        label="Play with AI"
        onClick={() => {
          /* handle click */
        }}
        primary={true}
      />
    </div>
  );
}
