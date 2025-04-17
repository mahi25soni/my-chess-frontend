"use client";
import React from "react";

type Props = {};

const chessSquares = [];

export default function GameInfo({}: Props) {
  return (
    <div className="w-full h-[650px] border-border-basic border rounded-yes text-black p-4 flex flex-col justify-between ">
      <div className="flex flex-col h-[550px]">
        <button className="bg-blue text-black px-4 py-2 rounded-sm w-full flex justify-center items-center button-hover mb-6">
          Play New Game
        </button>
        <div className="flex-1 text-sm space-y-2 overflow-auto">
          {Array.from({ length: Math.ceil(chessSquares.length / 2) }).map((_, rowIndex) => {
            const first = chessSquares[rowIndex * 2];
            const second = chessSquares[rowIndex * 2 + 1];

            return (
              <div
                className={`flex justify-between w-full px-2 py-1 rounded-md ${
                  rowIndex % 2 === 0 ? "bg-white" : "bg-gray-100"
                }`}
                key={rowIndex}
              >
                <span>{rowIndex + 1}</span>
                <span className="w-1/2 text-center">{first}</span>
                <span className="w-1/2 text-center">{second}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 ">
        <button className="px-2 py-1 text-white bg-red-500  hover:bg-red-600 rounded-lg button-hover w-full">
          Quit
        </button>
        <button className="px-2 py-1 text-white bg-red-500  hover:bg-red-600 rounded-lg button-hover w-full">
          Resign
        </button>
      </div>
    </div>
  );
}
