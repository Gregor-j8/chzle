"use client"
import { Chessboard } from "react-chessboard"
import usePuzzle from './UsePuzzle'
import { LoadingPage } from '../_components/loading'
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Chess, Square } from "chess.js"
import { trpc } from "@/utils/trpc"
import { useUser } from "@clerk/nextjs"

export default function Page() {
  const user = useUser()
  const mutation = trpc.dailypuzzle.completedDailyPuzzles.useMutation()
  const { startingFen, history, solutionMoves, loading, rating, puzzleId } = usePuzzle()
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
    const allMoves = solutionMoves.map(m => typeof m === "string" && m)

    const userColor = newGame.turn()
    setPlayerColor(userColor)

    setGame(newGame)
    setMoves(allMoves)
    setOldMoves([])
  }, [makeAIMove, solutionMoves, startingFen])

  useEffect(() => {
    setGameStatus(game.turn() === "w" ? "White's turn" : "Black's turn")
  }, [game])

  const onDrop = useCallback((source: string, target: string) => {
    if (game.turn() !== playerColor) {
      toast.error("It is not your turn", { duration: 3000, position: "top-center" })
      return false
    }
  
    const piece = game.get(source as Square)
    if (!piece || piece.color !== playerColor) {
      toast.error("You can only move your pieces", { duration: 3000, position: "top-center" })
      return false
    }
  
    const attemptedMove = source + target
    const expectedMove = moves[0]
  
    if (attemptedMove !== expectedMove) {
      toast.error("That's not the correct move for this puzzle", { duration: 3000, position: "top-center" })
      return false
    }
  
    const gameCopy = new Chess(game.fen())
    const move = gameCopy.move({ from: source, to: target })
  
    if (!move) {
      toast.error("Illegal move", { duration: 3000, position: "top-center" })
      return false
    }
  
    const updatedMoves = moves.slice(1)
    setOldMoves(prevOldMoves => [...prevOldMoves, attemptedMove])
    setMoves(updatedMoves)
    setGame(gameCopy)
  
    if (updatedMoves.length === 0) {
      if (!user.user) return     
            mutation.mutate({
                userId: user.user.id,
                puzzleId: puzzleId,
                rating: rating,
                completedDate: new Date().toISOString().slice(0, 10)
            });
      toast.success("Puzzle completed!", { duration: 3000, position: "top-center" })
      return true
    }
  
    setTimeout(() => {
      const nextAiMove = makeAIMove(gameCopy, updatedMoves)
      if (nextAiMove) {
        setGame(nextAiMove.gameCopy)
        setMoves(nextAiMove.Moves)
        setOldMoves(prev => [...prev, nextAiMove.playedMove])
      }
    }, 500)
    return true
  }, [game, moves, playerColor, makeAIMove])
  
  if (loading) {
    return <LoadingPage />
  }

  if (!startingFen || !history) {
    return <div className="text-red-600">Failed to load puzzle.</div>
  }

  return (
    <div className="flex flex-col justify-center items-center py-8 bg-slate-100">
      <h1 className="text-xl font-bold mb-2">Chess Daily Puzzles</h1>
      <h2 className="font-bold mb-2">{gameStatus}</h2>
      <div className="shadow-lg rounded-md overflow-hidden pt-5">
        <Chessboard
          arePremovesAllowed={true}
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={650}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Your Moves:</h3>
        <p className="font-mono">{oldMoves.join(", ")}</p>
      </div>
    </div>
  )
}