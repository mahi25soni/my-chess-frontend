"use client";
import React, { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
type Props = {};

const ChessBoard = (props: Props) => {
  const [game, setGame] = useState(new Chess());
  const [highlightedSquares, setHighlightedSquares] = useState({});
  const [optionSquare, setOptionSquare] = useState({});
  const [currentSelectedPiece, setCurrentSelectedPiece] = useState(null);

  const makeAMove = (moveData: { from: string; to: string; promotion: string }) => {
    const gameCopy = new Chess(game.fen()); // Create a new instance with the current game state
    console.log("The game copy is ", gameCopy);
    const result = gameCopy.move(moveData);

    if (result) {
      setGame(gameCopy); // Update state with the new game instance
    }

    return result;
  };

  const handleOnPieceDrop = (from: string, to: string, piece: string) => {
    const isAlloweSquare = Object.keys(optionSquare).includes(to);
    if (!isAlloweSquare) {
      return false;
    }
    let move = makeAMove({
      from,
      to,
      promotion: "q",
    });

    console.log("The move is ", move);
    if (move === null) {
      return false;
    } else {
      setOptionSquare({});
      setCurrentSelectedPiece(null);
      return true;
    }
  };

  const handleOnPieceClick = (piece: any, square: any) => {
    const allMoves = game.moves({ square, verbose: true });
    console.log("The moves are ", allMoves);

    const newSquares = {};
    allMoves.map((move) => {
      newSquares[move.to] = {
        background: move.captured
          ? "rgba(255, 0, 0, 0.4)" // Capturing move (Red Highlight)
          : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)", // Normal move
        borderRadius: move.captured ? "0" : "50%", // Capturing move (Circle Highlight)
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };

    console.log("The new squares are ", newSquares);

    setCurrentSelectedPiece(square);
    setOptionSquare(newSquares);
  };

  const handleSquareClick = (square: any) => {
    const isAlloweSquare = Object.keys(optionSquare).includes(square);
    if (isAlloweSquare) {
      makeAMove({
        from: currentSelectedPiece,
        to: square,
        promotion: "q",
      });
      setOptionSquare({});
      setCurrentSelectedPiece(null);
      return true;
    }
    return false;
  };

  const handleOnPieceDragBegin = (piece: any, sourceSquare: any) => {
    const allMoves = game.moves({ square: sourceSquare, verbose: true });
    console.log("The moves are ", allMoves);

    const newSquares = {};
    allMoves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(sourceSquare).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[sourceSquare] = {
      background: "rgba(255, 255, 0, 0.4)",
    };

    setCurrentSelectedPiece(sourceSquare);
    setOptionSquare(newSquares);
  };
  return (
    <div>
      <Chessboard
        position={game.fen()}
        onPieceDragBegin={handleOnPieceDragBegin}
        onPieceDrop={handleOnPieceDrop}
        onPieceClick={handleOnPieceClick}
        // customSquareStyles={highlightedSquares}
        customSquareStyles={optionSquare}
        onSquareClick={handleSquareClick}
      />
    </div>
  );
};

export default ChessBoard;
