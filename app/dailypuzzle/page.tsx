"use client"
import { Chessboard } from "react-chessboard"
import usePuzzle from './UsePuzzle' // adjust path as needed
import { LoadingPage } from '../_components/loading'
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Chess, Square } from "chess.js"

export default function Page() {
  const { startingFen, history, solutionMoves, loading } = usePuzzle()
  const [game, setGame] = useState(new Chess())
  const [moves, setMoves] = useState<string[]>([])
  const [oldMoves, setOldMoves] = useState<string[]>([])
  const [gameStatus, setGameStatus] = useState("")
  const [playerColor, setPlayerColor] = useState<"w" | "b">("b")

  const makeAIMove = useCallback((currentGame: Chess, solutionMoves: string[]) => {
    if (currentGame.isGameOver() || solutionMoves.length === 0) return null
    const moveStr = solutionMoves[0]
    console.log(moveStr)
    const move = { from: moveStr.slice(0, 2), to: moveStr.slice(2, 4) }

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

  // useEffect(() => {
  //   if (!startingFen || !solutionMoves) return
  
  //   const newGame = new Chess(startingFen)
  
  //   const allMoves = solutionMoves.map(m => typeof m === "string" ? m : m.from + m.to)
  
  //   const aiColor = newGame.turn()
  //   setPlayerColor(aiColor === "w" ? "b" : "w")
  
  //   const aiMoveResult = makeAIMove(newGame, allMoves)
  
  //   if (aiMoveResult) {
  //     setGame(aiMoveResult.gameCopy)
  //     setMoves(aiMoveResult.Moves)
  //     setOldMoves([aiMoveResult.playedMove])
  //   } else {
  //     setGame(newGame)
  //     setMoves(allMoves)
  //     setOldMoves([])
  //   }
  // }, [makeAIMove, solutionMoves, startingFen])
  

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

    const gameCopy = new Chess(game.fen())
    const move = gameCopy.move({ from: source, to: target })

    if (move) {
      const expectedMove = moves[0]
      const actualMove = move.from + move.to

      if (actualMove !== expectedMove) {
        toast.error("Wrong move, try again", { duration: 3000, position: "top-center" })
        return false
      }

      const updatedMoves = moves.slice(1)
      setOldMoves(prevOldMoves => [...prevOldMoves, actualMove])
      setMoves(updatedMoves)
      setGame(gameCopy)

      if (!gameCopy.isGameOver() && updatedMoves.length > 0) {
        setTimeout(() => {
          const nextAiMove = makeAIMove(gameCopy, updatedMoves)
          if (nextAiMove) {
            setGame(nextAiMove.gameCopy)
            setMoves(nextAiMove.Moves)
            setOldMoves(prev => [...prev, nextAiMove.playedMove])
          }
        }, 500)
      }
    }

    return move ?? undefined
  }, [game, moves, playerColor, makeAIMove])

  if (loading) {
    return <LoadingPage />
  }

  if (!startingFen || !history) {
    return <div className="text-red-600">Failed to load puzzle.</div>
  }
  console.log(game.fen())
  console.log(startingFen)
  console.log("solution", solutionMoves)

  return (
    <div className="flex flex-col justify-center items-center py-8 bg-slate-100">
      <h1 className="text-xl font-bold mb-2">Chess Daily Puzzles</h1>
      <h2 className="font-bold mb-2">{gameStatus}</h2>
      <div className="shadow-lg rounded-md overflow-hidden pt-5">
        <Chessboard
          arePremovesAllowed={true}
          position={startingFen}
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