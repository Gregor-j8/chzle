"use client";
import { Chessboard } from "react-chessboard";
import { useState,  } from "react";
import { Chess } from "chess.js";
import { Game } from "js-chess-engine";

function GamePage() {
  const [game, setGame] = useState(() => new Chess());
  const [isThinking, setIsThinking] = useState(false);
  const [gameStatus, setGameStatus] = useState("Your turn (White)");

  const makeAIMove = (currentGame) => {
    if (currentGame.isGameOver() || isThinking) return;

    setIsThinking(true);
    setGameStatus("Computer is thinking...");

    setTimeout(() => {
      try {
        const engineGame = new Game(currentGame.fen());
        
        const aiMove = engineGame.aiMove(2);
        
        const from = Object.keys(aiMove)[0].toLowerCase();
        const to = aiMove[Object.keys(aiMove)[0]].toLowerCase();
        
        const gameCopy = new Chess(currentGame.fen());
        gameCopy.move({
          from: from,
          to: to,
          promotion: "q" 
        });
        
        setGame(gameCopy);
        updateGameStatus(gameCopy);
      } catch (error) {
        console.error("Error making AI move:", error);
        setGameStatus("Error making AI move. Try again.");
      }
      
      setIsThinking(false);
    }, 500);
  };

  const updateGameStatus = (currentGame) => {
    if (currentGame.isCheckmate()) {
      setGameStatus(`Checkmate! ${currentGame.turn() === 'w' ? 'Black' : 'White'} wins!`);
    } else if (currentGame.isDraw()) {
      setGameStatus("Game Over - Draw!");
    } else if (currentGame.isCheck()) {
      setGameStatus(`Check! ${currentGame.turn() === 'w' ? 'White' : 'Black'} to move.`);
    } else {
      setGameStatus(currentGame.turn() === 'w' ? 'Your turn (White)' : 'Computer\'s turn (Black)');
    }
  };

  const onDrop = (source: string, target: string) => {
    const gameCopy = new Chess(game.fen()); 
    const move = gameCopy.move({ from: source, to: target, promotion: "q" });

    if (move) {
      setGame(gameCopy);
      updateGameStatus(gameCopy);
      
      if (!gameCopy.isGameOver()) {
        setTimeout(() => makeAIMove(gameCopy), 300);
      }
      return true;
    }

    return false;
  };

  const resetGame = () => {
    setGame(new Chess());
    setGameStatus("Your turn (White)");
  };

  const undoMoves = () => {
    const gameCopy = new Chess(game.fen());
    if (gameCopy.history().length >= 2) {
      gameCopy.undo();
      gameCopy.undo(); 
      setGame(gameCopy);
      updateGameStatus(gameCopy);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-8 bg-slate-100 overscroll-none">
      <h1 className="text-xl font-bold mb-2">Chess Game vs Computer</h1>
      <div className="mb-2 text-lg">{gameStatus}</div>
      
      <div className="shadow-lg rounded-md overflow-hidden">
        <Chessboard  arePremovesAllowed={true} 
           position={game.fen()} 
          onPieceDrop={onDrop}
          boardWidth={650}
        />
      </div> 
      <div className="mt-4 flex gap-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={resetGame}>New Game
        </button>
        <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 rounded cursor-pointer" onClick={undoMoves}
          disabled={game.history().length < 2}>Undo Move
        </button>
      </div>
    </div>
  );
}

export default GamePage;