"use client"
import { Chessboard } from "react-chessboard"
import usePuzzle from './UsePuzzle'
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Chess, Square } from "chess.js"
import { trpc } from "@/utils/trpc"
import { useUser } from "@clerk/nextjs"

export default function Page() {
  const user = useUser()
  const mutation = trpc.dailypuzzle.completedDailyPuzzles.useMutation()
  const { startingFen, history, solutionMoves, rating, puzzleId } = usePuzzle()
  const [game, setGame] = useState(new Chess())
  const [moves, setMoves] = useState<string[]>([])
  const [oldMoves, setOldMoves] = useState<string[]>([])
  const [gameStatus, setGameStatus] = useState("")
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w")

  const makeAIMove = useCallback((currentGame: Chess, solutionMoves: string[]) => {
    if (currentGame.isGameOver() || solutionMoves.length === 0) return null
    const moveStr = solutionMoves[0]
    const move = { from: moveStr.slice(0, 2), to: moveStr.slice(2, 4)}

    const gameCopy = new Chess(currentGame.fen())
    const result = gameCopy.move(move)

    if (result) {
      return {
        gameCopy,
        Moves: solutionMoves.slice(1),
        playedMove: moveStr
      }
    }
    return null
  }, [])

  useEffect(() => {
    if (!startingFen || !solutionMoves) return

    const newGame = new Chess(startingFen)
    const allMoves = solutionMoves.filter((m) => typeof m === "string")

    const userColor = newGame.turn()
    setPlayerColor(userColor)

    setGame(newGame)
    setMoves(allMoves)
    setOldMoves([])
  }, [makeAIMove, solutionMoves, startingFen])

  useEffect(() => {
    setGameStatus(game.turn() === "w" ? "White's turn" : "Black's turn")
  }, [game])

  const onDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      if (game.turn() !== playerColor) {
        toast.error("It is not your turn", { duration: 3000, position: "top-center" });
        return false;
      }

      const pieceObj = game.get(sourceSquare);
      if (!pieceObj || pieceObj.color !== playerColor) {
        toast.error("You can only move your pieces", { duration: 3000, position: "top-center" });
        return false;
      }

      const attemptedMove = sourceSquare + targetSquare;
      const expectedMove = moves[0];

      if (attemptedMove !== expectedMove) {
        toast.error("That's not the correct move for this puzzle", { duration: 3000, position: "top-center" });
        return false;
      }

      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({ from: sourceSquare, to: targetSquare });

      if (!move) {
        toast.error("Illegal move", { duration: 3000, position: "top-center" });
        return false;
      }

      const updatedMoves = moves.slice(1);
      setOldMoves((prevOldMoves) => [...prevOldMoves, attemptedMove]);
      setMoves(updatedMoves);
      setGame(gameCopy);

      if (updatedMoves.length === 0) {
        if (!user.user) return false;
        mutation.mutate({
          userId: user.user.id,
          puzzleId: puzzleId,
          rating: rating,
          completedDate: new Date().toISOString().slice(0, 10),
        });
        toast.success("Puzzle completed!", { duration: 3000, position: "top-center" });
        return true;
      }

      setTimeout(() => {
        const nextAiMove = makeAIMove(gameCopy, updatedMoves);
        if (nextAiMove) {
          setGame(nextAiMove.gameCopy);
          setMoves(nextAiMove.Moves);
          setOldMoves((prev) => [...prev, nextAiMove.playedMove]);
        }
      }, 500);
      return true;
    },
    [game, moves, playerColor, makeAIMove, mutation, puzzleId, rating, user.user]
  );
  

  if (!startingFen || !history) {
    return <div className="text-red-600">Failed to load puzzle.</div>
  }

  return (
<div className="flex flex-col items-center justify-center pb-10 px-4 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
  <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
    ♟️ Chess Daily Puzzles
  </h1>

  <h2
    className={`text-sm sm:text-base font-semibold mb-4 px-3 py-1 rounded-full ${
      gameStatus === 'Correct!' ? 'bg-green-600 text-white' : gameStatus === 'Incorrect' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-200'
    }`}>{gameStatus}</h2>

  <div className="shadow-xl rounded-2xl overflow-hidden border border-slate-700">
    <Chessboard arePremovesAllowed={true} position={game.fen()} onPieceDrop={onDrop} boardWidth={Math.min(637, typeof window !== "undefined" ? window.innerWidth - 40 : 637)}/>
  </div>

  <div className="mt-6 w-full max-w-xl px-4">
    <h3 className="text-lg font-semibold mb-1">Your Moves:</h3>
    <p className="font-mono text-sm text-slate-300 break-words">
      {oldMoves.length > 0 ? oldMoves.join(", ") : "No moves yet."}
    </p>
  </div>
</div>
  )
}