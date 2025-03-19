import React from "react";

type GameButtonProps = {
  label: string;
  onClick: () => void;
  primary?: boolean;
};

export function GameButton({ label, onClick, primary = false }: GameButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`button-hover py-3 px-4 border border-border-basic rounded-yes text-center w-full  ${
        primary ? "bg-blue text-white" : " text-off-white"
      }  hover:border-blue`}
    >
      {label}
    </button>
  );
}

export default function GameOptions() {
  return (
    <div className="grid grid-cols-4 gap-4 mt-6">
      <GameButton
        label="Start New Game"
        onClick={() => {
          /* handle click */
        }}
        primary={true}
      />
      <GameButton
        label="Start 10-Minute Game"
        onClick={() => {
          /* handle click */
        }}
        primary={true}
      />
      <GameButton
        label="Start 5-Minute Game"
        onClick={() => {
          /* handle click */
        }}
        primary={true}
      />
      <GameButton
        label="Play with AI"
        onClick={() => {
          /* handle click */
        }}
        primary={true}
      />
    </div>
  );
}
