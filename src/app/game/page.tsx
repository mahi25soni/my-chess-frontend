import ChessBoard from "@/components/ChessBoard";
import GameInfo from "@/components/GameInfo";
import PaddingWrapper from "@/components/wrappers/PaddingWrapper";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <PaddingWrapper>
      <div className="grid grid-cols-10 gap-2 h-screen">
        <div className="col-span-6 border">
          <ChessBoard />
        </div>
        <div className="col-span-4 border">
          <GameInfo />
        </div>
      </div>
    </PaddingWrapper>
  );
}
