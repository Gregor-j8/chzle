"use client";
import { Chessboard } from "react-chessboard";
import { useState } from "react";
import { Chess } from "chess.js";

function GamePage() {
  const [game, setGame] = useState(() => new Chess());

  const onDrop = (source: string, target: string) => {
    const gameCopy = new Chess(game.fen()); // 🧠 clone current state
    const move = gameCopy.move({ from: source, to: target, promotion: "q" });

    if (move) {
      setGame(gameCopy); // ✅ new instance, triggers re-render
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
