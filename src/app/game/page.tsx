"use client";
import Overlay from "@/components/atoms/Overlay";
import ChessBoard from "@/components/ChessBoard";
import GameInfo from "@/components/GameInfo";
import PaddingWrapper from "@/components/wrappers/PaddingWrapper";
import ProtectedPage from "@/components/wrappers/ProjectedPageWrapper";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

type Props = {};

type MatchEndReason = "resigned" | "quit" | "back";

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
    id: null,
    color: null,
  });
  const [matchStart, setMatchStart] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const searchParam = useSearchParams();
  const gameTypeId = searchParam.get("gameTypeId");
  const [theGameHistory, setTheGameHistory] = useState<string[]>([]);
  const [matchEndMessage, setMatchEndMessage] = useState<string | null>(null);
  const [currentGame, setCurrentGame] = useState<any>(null);

  useEffect(() => {
    const socket = io(process.env.API_BASE_URL, {
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
        id: data?.opponentId,
        color: data?.firstUser === user?.id ? "w" : "b",
      });
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
      setMatchEndMessage(data?.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleQuitGame = (message: string, reason: MatchEndReason) => {
    socket.emit("quit-event", {
      message: message,
      reason: reason,
      game: {
        fen: currentGame.fen(),
        pgn: currentGame.pgn(),
        history: theGameHistory,
      },
    });
    router.push("/");
  };

  const newMatchWithSameSocket = () => {
    socket.emit("new-match");
    setMatchEndMessage(null);
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
                    setCurrentGame={setCurrentGame}
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
        {matchEndMessage && (
          <OpponentQuits
            handleQuitGame={handleQuitGame}
            newMatchWithSameSocket={newMatchWithSameSocket}
            message={matchEndMessage}
          />
        )}
      </PaddingWrapper>
    </ProtectedPage>
  );
}

const OpponentQuits = ({
  handleQuitGame,
  newMatchWithSameSocket,
  message,
}: {
  handleQuitGame: (string, MatchEndReason) => void;
  newMatchWithSameSocket: () => void;
  message: string;
}) => {
  return (
    <Overlay onClose={newMatchWithSameSocket}>
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80 animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-gray-900">Game Over</h1>
        <p className="text-lg text-gray-600 mt-2">{message}</p>

        <div className="flex justify-center items-center gap-4 ">
          <button
            className="mt-4 py-2 px-4 w-full text-white bg-blue-600 rounded-lg font-semibold text-lg 
               transition-all duration-200 hover:bg-blue-700 active:scale-95"
            onClick={() => handleQuitGame("Nothing", "back")}
          >
            Back to Home
          </button>

          <button
            className="mt-4 py-2 px-4 w-full text-white bg-blue-600 rounded-lg font-semibold text-lg 
               transition-all duration-200 hover:bg-blue-700 active:scale-95"
            onClick={newMatchWithSameSocket}
          >
            Play new match
          </button>
        </div>
      </div>
    </Overlay>
  );
};
