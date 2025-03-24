"use client";
import ChessBoard from "@/components/ChessBoard";
import GameInfo from "@/components/GameInfo";
import PaddingWrapper from "@/components/wrappers/PaddingWrapper";
import React, { useState } from "react";

type Props = {};

export default function page({}: Props) {
  const [player, setPlayer] = useState(null);
  return (
    <PaddingWrapper>
      <div className="flex flex-row justify-start gap-4">
        <button
          onClick={() => {
            localStorage.setItem("userId", "100");
            localStorage.setItem("typeId", "300");
            setPlayer("w");
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Set Player to White
        </button>
        <button
          onClick={() => {
            localStorage.setItem("userId", "200");
            localStorage.setItem("typeId", "300");
            setPlayer("b");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Set Player to Black
        </button>
      </div>
      <div className="grid grid-cols-10 gap-2 h-screen">
        {player && (
          <>
            <div className="col-span-6 border">
              <ChessBoard player={player} />
            </div>
            <div className="col-span-4 border">
              <GameInfo />
            </div>
          </>
        )}
      </div>
    </PaddingWrapper>
  );
}
