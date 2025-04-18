"use client";
import ChessBoard from "@/components/ChessBoard";
import GameInfo from "@/components/GameInfo";
import PaddingWrapper from "@/components/wrappers/PaddingWrapper";
import ProtectedPage from "@/components/wrappers/ProjectedPageWrapper";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

type Props = {};

export default function Page({}: Props) {
  const [socket, setSocket] = useState<any>(null);
  const [player, setPlayer] = useState({
    id: null,
    color: null,
    name: null,
    email: null,
  });
  const [opponent, setOpponent] = useState({
    name: null,
    email: null,
  });
  const [matchStart, setMatchStart] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const searchParam = useSearchParams();
  const gameTypeId = searchParam.get("gameTypeId");
  const [theGameHistory, setTheGameHistory] = useState<string[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:9000", {
      query: {
        userId: user?.id,
        typeId: gameTypeId,
        name: user?.name,
        email: user?.email,
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
        name: user?.name,
        email: user?.email,
      });

      setOpponent({
        name: data?.opponentName,
        email: data?.opponentEmail,
      });

      console.log("Oponent for " + user?.email, data);
    });

    socket.on("quit-event", (data: any) => {
      setMatchStart(false);
      setPlayer({
        id: null,
        color: null,
        name: null,
        email: null,
      });
      setTheGameHistory([]);
      router.push("/");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleQuitGame = () => {
    socket.emit("quit-event");
    router.push("/");
  };
  return (
    <ProtectedPage>
      <PaddingWrapper>
        {matchStart && player?.color && player?.id ? (
          <div className="grid grid-cols-12 px-2  xl:px-20 lg:px-5 md:px-0 gap-4">
            {player && (
              <>
                <div className="md:col-span-8 col-span-12">
                  <ChessBoard
                    socket={socket}
                    setTheGameHistory={setTheGameHistory}
                    currentUser={player}
                    opponent={opponent}
                  />
                </div>
                <div className="md:col-span-4 col-span-12 ">
                  <GameInfo theGameHistory={theGameHistory} handleQuitGame={handleQuitGame} />
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
