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
    const result = gameCopy.move(moveData);

    if (!result) return null; // Invalid move, return early

    // **Check game-ending conditions AFTER updating the game**
    if (gameCopy.isCheckmate()) {
      console.log("Checkmate! Game over.");
      setTimeout(() => alert("Checkmate! Game over."), 100);
    } else if (gameCopy.isStalemate()) {
      console.log("Stalemate! Game is a draw.");
      setTimeout(() => alert("Stalemate! Game is a draw."), 100);
    } else if (gameCopy.isInsufficientMaterial()) {
      console.log("Draw by insufficient material.");
      setTimeout(() => alert("Draw by insufficient material."), 100);
    } else if (gameCopy.isThreefoldRepetition()) {
      setTimeout(() => alert("Draw by threefold repetition."), 100);
    } else if (gameCopy.isDraw()) {
      setTimeout(() => alert("Draw!"), 100);
    } else if (gameCopy.inCheck()) {
      console.log("Check! Defend your king.");
    }

    setGame(gameCopy); // Update state with the new game instance
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

    if (game.isCheckmate()) {
      alert("Checkmate! game over.");
    } else if (game.isStalemate()) {
      alert("Stalemate! game is a draw.");
    } else if (game.isInsufficientMaterial()) {
      alert("Draw by insufficient material.");
    } else if (game.isThreefoldRepetition()) {
      alert("Draw by threefold repetition.");
    } else if (game.isDrawByFiftyMoves()) {
      alert("Draw by 50-move rule.");
    } else if (game.inCheck()) {
      console.log("Check! Defend your king.");
    }

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
