"use client";
import { useAuth } from "@/context/AuthContext";
import moment from "moment";
import React from "react";

type GameResult = "Win" | "Loss" | "Draw";

const something = {
  id: "cm9u7susj0001o8guauc79b3q",
  playerOneId: "cm8qrskf10000o8tixbcstc99",
  playerTwoId: "cm99f0w310000o8gh1n9gy7t1",
  gametypeId: "cm9i374u30000o8k7kgcaiprl",
  winnerId: "cm99f0w310000o8gh1n9gy7t1",
  playerOneColor: "white",
  playerTwoColor: "black",
  colorWon: "black",
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  pgn: "",
  gameHistory: [],
  matchCompleted: true,
  startedAt: "2025-04-23T17:35:39.930Z",
  finishedAt: "2025-04-23T17:35:44.395Z",
  totalTime: null,
  createdAt: "2025-04-23T17:35:40.003Z",
  updatedAt: "2025-04-23T17:35:44.405Z",
  playerOne: {
    id: "cm8qrskf10000o8tixbcstc99",
    name: "Harshaa",
  },
  playerTwo: {
    id: "cm99f0w310000o8gh1n9gy7t1",
    name: "Mahendra Soni",
  },
  gametype: {
    id: "cm9i374u30000o8k7kgcaiprl",
    name: "10-Minutes",
  },
};

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

export default function GameHistory({ games }: { games: GameItem[] }) {
  const { user } = useAuth();

  return (
    <div className="mt-8 border border-border-basic rounded-lg overflow-x-scroll">
      <table className="w-full">
        <thead>
          <tr className="bg-dark-white text-left">
            <th className="py-4 px-6">Opponent</th>
            <th className="py-4 px-6">Date & Time</th>
            <th className="py-4 px-6">Game Type</th>
            <th className="py-4 px-6">Result</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id} className="border-t border-border-basic">
              <td className="py-4 px-6">
                {user.id === game.playerOneId ? game.playerTwo.name : game.playerOne.name}
              </td>
              <td className="py-4 px-6">{moment(game.createdAt).format("DD MMMM YYYY, HH:mm")}</td>
              <td className="py-4 px-6">{game.gametype.name}</td>
              <td className="py-4 px-6">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    user.id === game.winnerId
                      ? "bg-light-green text-green"
                      : "bg-red-100 text-dark-red"
                  }`}
                >
                  {user.id === game.winnerId ? "Win" : "Loss"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
