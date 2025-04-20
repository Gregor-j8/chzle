"use client";
import { Chessboard } from "react-chessboard";
import { useState } from "react";
import { Chess } from "chess.js";

function GamePage() {
  const [game, setGame] = useState(() => new Chess());

  const onDrop = (source: string, target: string) => {
    const gameCopy = new Chess(game.fen()); 
    const move = gameCopy.move({ from: source, to: target, promotion: "q" });
    console.log(gameCopy.history())

    if (move) {
      setGame(gameCopy);
      return true;
    }

    return false;
  };

  return (
    <div className="flex justify-center items-center h-screen">

        {/* <div 
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          width: "fit-content",
        }}> */}
            <Chessboard arePremovesAllowed={true} position={game.fen()} onPieceDrop={onDrop} />
        {/* </div> */}
    </div>
  );
}

export default GamePage;
