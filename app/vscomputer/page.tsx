"use client";
import { toast } from "react-hot-toast";
import { Chessboard } from "react-chessboard";
import { useState } from "react";
import { Chess } from "chess.js";
import { Game } from "js-chess-engine";
import { trpc } from "@/utils/trpc";
import { useUser } from "@clerk/nextjs";
import VsComputerModal from "../game/vscomputermodal";

interface AIMove {
  [key: string]: string;
}

function GamePage() {
  const user = useUser();
  console.log(user);
  const createGame = trpc.game.createGame.useMutation();
  const [game, setGame] = useState(() => new Chess());
  const [isThinking, setIsThinking] = useState(false);
  const [gameStatus, setGameStatus] = useState("Your turn (White)");
  const [result, setResult] = useState("");
  const [whiteGameHistory, setwhiteGameHistory] = useState<string[]>([]);
  const [blackGameHistory, setBlackGameHistory] = useState<string[]>([]);
  const [aiLevel, setAiLevel] = useState(0);

  const makeAIMove = (currentGame: Chess): void => {
    if (currentGame.isGameOver() || isThinking) return;

    setIsThinking(true);
    setGameStatus("Computer is thinking...");

    setTimeout(() => {
        const engineGame = new Game(currentGame.fen());
        
        const aiMove: AIMove = engineGame.aiMove(aiLevel);
        const from: string = Object.keys(aiMove)[0].toLowerCase();
        const to: string = aiMove[Object.keys(aiMove)[0]].toLowerCase();
        
        const gameCopy = new Chess(currentGame.fen());
        const game = gameCopy.move({from: from, to: to});
        if (gameCopy) {
        const newHistory = [...blackGameHistory, game.san];
        setBlackGameHistory(newHistory);
        setGame(gameCopy);
        updateGameStatus(gameCopy);
        setIsThinking(false);
    }}, 500);
  };

  const onDrop = (source: string, target: string) => {
    const gameCopy = new Chess(game.fen()); 
    const move = gameCopy.move({ from: source, to: target});

      if (move == null) {
        toast.error("Invalid move! Please try again.");
        return move;
      }

      const newHistory = [...whiteGameHistory, move.san];
      setwhiteGameHistory(newHistory);
      setGame(gameCopy);
      updateGameStatus(gameCopy);
        
      if (!gameCopy.isGameOver()) {
        setTimeout(() => makeAIMove(gameCopy), 300);
      }
      return move;
  };

  const updateGameStatus = (currentGame: Chess) => {
    if (currentGame.isCheckmate()) {
      setResult(currentGame.turn() === 'w' ? '0-1' : '1-0');
      setGameStatus(`Checkmate! ${currentGame.turn() === 'w' ? 'Black' : 'White'} wins!`);
    } else if (currentGame.isDraw()) {
      setGameStatus("Game Over - Draw!");
      setResult("1/2-1/2");
    } else if (currentGame.isCheck()) {
      setGameStatus(`Check! ${currentGame.turn() === 'w' ? 'White' : 'Black'} to move.`);
    } else {
      setGameStatus(currentGame.turn() === 'w' ? 'Your turn (White)' : 'Computer\'s turn (Black)');
    }
    if (!user.user) return;
    if (currentGame.isCheckmate() || currentGame.isDraw()) {
      // Save the final move to the database
      const gameMoves = whiteGameHistory.map((val, i) => `${i + 1}. ${val} ${blackGameHistory[i]},`).join(" ");
      const gamePng = gameMoves

      if (gamePng) {
        createGame.mutate({
          whiteId: user.user.id,
          blackId: "computer",
          pgn: gamePng,
          result: result,
        });
    };  
  };
}

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
    !aiLevel ? ( 
      <VsComputerModal
        setAiLevel={setAiLevel}
      />
    ) : (
      <div className="flex flex-col justify-center items-center py-8 bg-slate-100">
      <h1 className="text-xl font-bold mb-2">Chess Game vs Computer</h1>
      <div className="mb-2 text-lg">{gameStatus}</div>
      
      <div className="shadow-lg rounded-md overflow-hidden">
        <Chessboard arePremovesAllowed={true} 
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
          >Undo Move
        </button>
      </div>
    </div>
    ))};

export default GamePage;