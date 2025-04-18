"use client";
import { Chessboard } from "react-chessboard";
import { useState } from "react";
import { Chess } from "chess.js";

// Set up Clerk authentication
function GamePage() {
  const [game, setGame] = useState(() => new Chess());

  const onDrop = (source: string, target: string) => {
    const gameCopy = new Chess(game.fen()); 
    const move = gameCopy.move({ from: source, to: target, promotion: "q" });

    if (move) {
      setGame(gameCopy);
      return true;
    }

    return false;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
    </div>
  );
}

export default GamePage;
