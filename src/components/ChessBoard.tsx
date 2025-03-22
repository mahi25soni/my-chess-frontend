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
    const newMove = gameCopy.move(moveData);

    if (!newMove) return null; // Invalid move, return early

    // **Check game-ending conditions AFTER updating the game**

    setGame(gameCopy); // Update state with the new game instance

    return { newMove, gameCopy };
  };

  const handleOnPieceDrop = (from: string, to: string, piece: string) => {
    const isAlloweSquare = Object.keys(optionSquare).includes(to);
    if (!isAlloweSquare) {
      return false;
    }
    const { newMove, gameCopy } = makeAMove({
      from,
      to,
      promotion: "q",
    });

    if (newMove === null) {
      return false;
    } else {
      setOptionSquare({});
      setCurrentSelectedPiece(null);
      return true;
    }
  };

  const handlingGameEndings = (color: any, gameCopy: any) => {
    if (gameCopy.isCheckmate()) {
      setTimeout(() => alert(`${color === "w" ? "White wins" : "Black wins"}`), 1500);
    } else if (gameCopy.isStalemate()) {
      setTimeout(() => alert(`${color === "w" ? "White wins" : "Black wins"}`), 1500);
    } else if (gameCopy.isInsufficientMaterial()) {
      setTimeout(() => alert("Draw by insufficient material."), 1500);
    } else if (gameCopy.isThreefoldRepetition()) {
      setTimeout(() => alert("Draw by threefold repetition."), 1500);
    } else if (gameCopy.isDraw()) {
      setTimeout(() => alert("Draw!"), 1500);
    } else if (gameCopy.inCheck()) {
      let kingSquare = null;

      // Loop through all squares to find the checked king
      for (let file of "abcdefgh") {
        for (let rank of "12345678") {
          const square: any = file + rank;
          const piece = gameCopy.get(square);

          if (piece && piece.type === "k" && piece.color === gameCopy.turn()) {
            kingSquare = square;
            break;
          }
        }
      }

      setOptionSquare({
        [kingSquare]: {
          background: "rgba(255, 0, 0, 0.3)",
        },
      });
    }
  };
  const handleOnPieceClick = (piece: any, square: any) => {
    const allMoves = game.moves({ square, verbose: true });
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

    setCurrentSelectedPiece(square);
    setOptionSquare(newSquares);
  };

  const handleSquareClick = (square: any) => {
    const isAlloweSquare = Object.keys(optionSquare).includes(square);
    if (isAlloweSquare) {
      const { newMove, gameCopy } = makeAMove({
        from: currentSelectedPiece,
        to: square,
        promotion: "q",
      });
      setOptionSquare({});
      setCurrentSelectedPiece(null);
      handlingGameEndings(newMove?.color, gameCopy);
      return true;
    }
    return false;
  };

  const handleOnPieceDragBegin = (piece: any, sourceSquare: any) => {
    const allMoves = game.moves({ square: sourceSquare, verbose: true });

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
