"use client";
import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import Overlay from "./atoms/Overlay";
import io from "socket.io-client";
type Props = {};

const ChessBoard = (props: Props) => {
  const [socket, setSocket] = useState<any>(null);
  const [game, setGame] = useState(new Chess());

  const [highlightedSquares, setHighlightedSquares] = useState({});
  const [optionSquare, setOptionSquare] = useState({});
  const [currentSelectedPiece, setCurrentSelectedPiece] = useState(null);

  const [matchEnd, setMatchEnd] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const typeId = localStorage.getItem("typeId");

    const socket = io("http://localhost:9000", {
      query: {
        userId,
        typeId,
      },
    });
    setSocket(socket);

    socket.on("message", (data: any) => {
      console.log(data);
    });

    socket.on("move", (data: { from: string; to: string; promotion: string }) => {
      console.log(data);
      const { from, to, promotion } = data;
      const { newMove, gameCopy } = makeAMove({ from, to, promotion });
      handlingGameEndings(newMove?.color, gameCopy);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const matchRestart = () => {
    setGame(new Chess());
    setOptionSquare({});
    setCurrentSelectedPiece(null);
    setMatchEnd(false);
    setWinner(null);
  };

  const makeAMove = (moveData: { from: string; to: string; promotion: string }) => {
    console.log("Before move:", game.history());

    let newMove: any;
    setGame((prevGame) => {
      const newGame = new Chess();
      newGame.loadPgn(prevGame.pgn()); // Preserve history
      newMove = newGame.move(moveData); // Make the move

      if (!newMove) return prevGame; // If move is invalid, return the previous state

      console.log("After move:", newGame.history());

      return newGame; // Update the state with the new game instance
    });

    return { newMove, gameCopy: game };
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
      setWinner(color === "w" ? "White" : "Black");
      setMatchEnd(true);
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

      socket.emit("move", { from: currentSelectedPiece, to: square, promotion: "q" });
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
      {matchEnd && <MatchEndModal winner={winner} matchRestart={matchRestart} />}
    </div>
  );
};

const MatchEndModal = ({ winner, matchRestart }: { winner: string; matchRestart: () => void }) => {
  return (
    <Overlay onClose={matchRestart}>
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80 animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-gray-900">Game Over</h1>
        <p className="text-lg text-gray-600 mt-2">{winner} wins</p>

        <button
          className="mt-4 py-2 px-4 w-full text-white bg-blue-600 rounded-lg font-semibold text-lg 
               transition-all duration-200 hover:bg-blue-700 active:scale-95"
          onClick={matchRestart}
        >
          Play Again
        </button>
      </div>
    </Overlay>
  );
};

export default ChessBoard;
