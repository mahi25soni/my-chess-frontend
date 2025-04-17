"use client";
import ChessBoard from "@/components/ChessBoard";
import GameInfo from "@/components/GameInfo";
import PaddingWrapper from "@/components/wrappers/PaddingWrapper";
import ProtectedPage from "@/components/wrappers/ProjectedPageWrapper";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

type Props = {};

export default function Page({}: Props) {
  const [socket, setSocket] = useState<any>(null);
  const [player, setPlayer] = useState<Record<string, string>>({
    id: null,
    color: null,
  });
  const [matchStart, setMatchStart] = useState(false);
  const { user } = useAuth();

  const searchParam = useSearchParams();
  const gameTypeId = searchParam.get("gameTypeId");

  useEffect(() => {
    const socket = io("http://localhost:9000", {
      query: {
        userId: user?.id,
        typeId: gameTypeId,
      },
    });
    setSocket(socket);

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("gameStart", (data: any) => {
      setMatchStart(data?.state);
      setPlayer({
        id: user?.id,
        color: data?.firstUser === user?.id ? "w" : "b",
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ProtectedPage>
      <PaddingWrapper>
        {matchStart && player?.color && player?.id ? (
          <div className="grid grid-cols-12 px-20">
            {player && (
              <>
                <div className="col-span-8">
                  <ChessBoard playerColor={player?.color} socket={socket} />
                </div>
                <div className="col-span-4">
                  <GameInfo />
                </div>
              </>
            )}
          </div>
        ) : (
          <div>Find for opponent...</div>
        )}
      </PaddingWrapper>
    </ProtectedPage>
  );
}
