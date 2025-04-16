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

    socket.on("message", (data: any) => {
      console.log(data);
    });

    socket.on("gameStart", (data: any) => {
      console.log(data?.firstUser === user?.id);
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
        {matchStart ? <div>Loaded</div> : <div>Find for opponent...</div>}
        {/* <div className="grid grid-cols-10 gap-2 h-screen">
          {player && (
            <>
              <div className="col-span-6 border">
                <ChessBoard player={player} socket={socket}/>
              </div>
              <div className="col-span-4 border">
                <GameInfo />
              </div>
            </>
          )}
        </div> */}
      </PaddingWrapper>
    </ProtectedPage>
  );
}
