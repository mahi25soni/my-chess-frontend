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

  const pieceDrop = (from: string, to: string, piece: string) => {
    let move = makeAMove({
      from,
      to,
      promotion: "q",
    });

    console.log("The move is ", move);
    if (move === null) {
      console.log("return false");
      return false;
    } else {
      console.log("return true");
      return true;
    }
  };

  const pieceClick = (piece: any, square: any) => {
    const allMoves = game.moves({ square, verbose: true });
    console.log("The moves are ", allMoves);

    const newSquares = {};
    allMoves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };

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
    }
  };

  return (
    <div>
      <Chessboard
        position={game.fen()}
        onPieceDrop={pieceDrop}
        onPieceClick={pieceClick}
        // customSquareStyles={highlightedSquares}
        customSquareStyles={optionSquare}
        onSquareClick={handleSquareClick}
      />
    </div>
  );
};

export default ChessBoard;
