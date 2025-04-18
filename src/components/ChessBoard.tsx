"use client";
import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import Overlay from "./atoms/Overlay";
import io, { Socket } from "socket.io-client";
import useSound from "use-sound";
import { useRouter } from "next/navigation";
type Props = {
  socket: Socket;
  setTheGameHistory: (history: string[]) => void;
  currentUser: {
    id: string;
    color: string;
    name: string;
    email: string;
  };
  opponent: {
    name: string;
    email: string;
  };
};

const ChessBoard = (props: Props) => {
  const [game, setGame] = useState(new Chess());
  const [MoveSelfPlaySound] = useSound("/sounds/move-self.mp3", { volume: 1 });
  const [CapturePlaySound] = useSound("/sounds/capture.mp3", { volume: 1 });
  const [MoveCheckSound] = useSound("/sounds/move-check.mp3", { volume: 1 });

  const [highlightedSquares, setHighlightedSquares] = useState({});
  const [optionSquare, setOptionSquare] = useState({});
  const [currentSelectedPiece, setCurrentSelectedPiece] = useState(null);

  const [matchEnd, setMatchEnd] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameHistory, setGameHistory] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    props.socket.on("move", (data: { from: string; to: string; promotion: string; game: any }) => {
      const { from, to, promotion, game: gameData } = data;
      const gameCopy = new Chess();
      gameCopy.load(gameData.fen);
      setGame(gameCopy);
      gameCopy.loadPgn(gameData.pgn);
      setGameHistory(gameCopy.history());
      const lastMoveColor = gameCopy.history().length % 2 === 0 ? "b" : "w";
      handlingGameEndings(lastMoveColor, gameCopy);
    });
  }, []);

  useEffect(() => {
    props.setTheGameHistory(game.history());
  }, [game]);

  const matchRestart = () => {
    setGame(new Chess());
    setOptionSquare({});
    setCurrentSelectedPiece(null);
    setMatchEnd(false);
    setWinner(null);
  };

  const makeAMove = (moveData: { from: string; to: string; promotion: string }) => {
    const gameCopy = new Chess();

    const pgn = game.pgn();
    const hasMoves = game.history().length > 0;

    if (hasMoves) {
      try {
        gameCopy.loadPgn(pgn); // Only load PGN if there are actual moves
      } catch (error) {
        console.error("Failed to load PGN:", pgn);
        return null;
      }
    }

    // console.log("The history before move is", gameCopy.history());

    const newMove = gameCopy.move(moveData);
    if (!newMove) {
      console.error("Invalid move!", moveData);
      return null;
    }

    setGame(gameCopy);

    // console.log("The history after move is", gameCopy.history());

    MoveSelfPlaySound();

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
      setWinner(color === "w" ? "White" : "Black");
      setMatchEnd(true);

      if (props.currentUser.color === color) {
        props.socket.emit("game-over", {
          game: {
            fen: gameCopy.fen(), // Current board state
            pgn: gameCopy.pgn(), // Updated move history
          },
          winner: props.currentUser,
        });
      }
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

      MoveCheckSound();
    }
  };
  const handleOnPieceClick = (piece: any, square: any) => {
    if (props.currentUser.color !== game.turn()) {
      alert("It's not your turn");
      return;
    }
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

      props.socket.emit("move", {
        from: currentSelectedPiece,
        to: square,
        promotion: "q",
        game: {
          fen: gameCopy.fen(), // Current board state
          pgn: gameCopy.pgn(), // Updated move history
        },
      });

      return true;
    }
    return false;
  };

  const handleOnPieceDragBegin = (piece: any, sourceSquare: any) => {
    if (props.currentUser.color !== game.turn()) {
      alert("It's not your turn");
      return;
    }
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

  const handleQuitGame = (message: string) => {
    props.socket.emit("quit-event", message);
    router.push("/");
  };

  const newMatchWithSameSocket = () => {
    props.socket.emit("new-match");
    matchRestart();
    setMatchEnd(false);
  };
  return (
    <div>
      <div>
        <p className="text-lg text-gray-600 flex items-center justify-start space-x-1">
          <span className="font-semibold">{props.opponent.name}</span>
          <span className="text-gray-400">|</span>
          <span>{props.opponent.email}</span>
        </p>
      </div>
      <Chessboard
        position={game.fen()}
        onPieceDragBegin={handleOnPieceDragBegin}
        onPieceDrop={handleOnPieceDrop}
        onPieceClick={handleOnPieceClick}
        // customSquareStyles={highlightedSquares}
        customSquareStyles={optionSquare}
        onSquareClick={handleSquareClick}
        boardWidth={600}
        boardOrientation={props.currentUser.color === "b" ? "black" : "white"}
        customBoardStyle={{
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      />

      <div>
        <p className="text-lg text-gray-600 flex items-center justify-start space-x-1">
          <span className="font-semibold">{props.currentUser.name}</span>
          <span className="text-gray-400">|</span>
          <span>{props.currentUser.email}</span>
        </p>
      </div>

      {matchEnd && (
        <MatchEndModal
          winner={winner}
          handleQuitGame={handleQuitGame}
          newMatchWithSameSocket={newMatchWithSameSocket}
        />
      )}
    </div>
  );
};

const MatchEndModal = ({
  winner,
  handleQuitGame,
  newMatchWithSameSocket,
}: {
  winner: string;
  handleQuitGame: (string) => void;
  newMatchWithSameSocket: () => void;
}) => {
  return (
    <Overlay onClose={newMatchWithSameSocket}>
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80 animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-gray-900">Game Over</h1>
        <p className="text-lg text-gray-600 mt-2">{winner} wins</p>

        <div className="flex justify-center items-center gap-4 ">
          <button
            className="mt-4 py-2 px-4 w-full text-white bg-blue-600 rounded-lg font-semibold text-lg 
               transition-all duration-200 hover:bg-blue-700 active:scale-95"
            onClick={() => handleQuitGame("Nothing")}
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

export default ChessBoard;
