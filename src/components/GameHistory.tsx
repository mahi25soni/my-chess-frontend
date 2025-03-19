import React from "react";

type GameResult = "Win" | "Loss" | "Draw";

type GameHistoryItem = {
  id: string;
  opponent: string;
  datetime: string;
  gameType: string;
  result: GameResult;
  accuracy: number;
};

export default function GameHistory({ games }: { games: GameHistoryItem[] }) {
  return (
    <div className="mt-8 border border-border-basic rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-dark-white text-left">
            <th className="py-4 px-6">Opponent</th>
            <th className="py-4 px-6">Date & Time</th>
            <th className="py-4 px-6">Game Type</th>
            <th className="py-4 px-6">Result</th>
            <th className="py-4 px-6">Accuracy</th>
            <th className="py-4 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id} className="border-t border-border-basic">
              <td className="py-4 px-6">{game.opponent}</td>
              <td className="py-4 px-6">{game.datetime}</td>
              <td className="py-4 px-6">{game.gameType}</td>
              <td className="py-4 px-6">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    game.result === "Win"
                      ? "bg-light-green text-green"
                      : game.result === "Loss"
                        ? "bg-red-100 text-dark-red"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {game.result}
                </span>
              </td>
              <td className="py-4 px-6">{game.accuracy}%</td>
              <td className="py-4 px-6 flex gap-2">
                {/* Action buttons - replay, analysis, share */}
                <button className="p-1">↻</button>
                <button className="p-1">📈</button>
                <button className="p-1">↗</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
