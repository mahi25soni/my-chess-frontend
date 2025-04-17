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
  const [player, setPlayer] = useState<Record<string, string>>({
    id: null,
    color: null,
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

    socket.on("quit-event", (data: any) => {
      setMatchStart(false);
      setPlayer({
        id: null,
        color: null,
      });
      setTheGameHistory([]);
      router.push("/");
      alert("Opponent left the game");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome to show the confirmation dialog
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
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
          <div className="grid grid-cols-12 px-20">
            {player && (
              <>
                <div className="col-span-8">
                  <ChessBoard
                    playerColor={player?.color}
                    socket={socket}
                    setTheGameHistory={setTheGameHistory}
                  />
                </div>
                <div className="col-span-4">
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
