"use client"
import { useEffect, useState, useCallback } from "react"
import { Chess, Move, Square } from "chess.js"
import { Game as EngineGame } from "js-chess-engine"
import { Chessboard } from "react-chessboard"
import { useUser } from "@clerk/nextjs"
import { toast } from "react-hot-toast"
import { trpc } from "@/utils/trpc"
import VsComputerModal from "../game/vscomputermodal"
import { createId } from '@paralleldrive/cuid2'

export default function GamePage() {
  const { user } = useUser()
  const createGame = trpc.game.createGame.useMutation()
  const [chess, setChess] = useState<Chess | null>(null)
  const [aiLevel, setAiLevel] = useState<number>(0)
  const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null)
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [result, setResult] = useState<string>("")
  const [status, setStatus] = useState<string>("Waiting...")
  const [isAITurn, setIsAITurn] = useState<boolean>(false)
  const isPlayerTurn = chess && chess.turn() === playerColor

  useEffect(() => {
    if (aiLevel && playerColor && !chess) {
      const newGame = new Chess()
      setChess(newGame)
      if (playerColor === "b") {
        handleAIMove(newGame)
      }}}, [aiLevel, playerColor])

  const handleAIMove = useCallback(
    (gameState: Chess) => {
      if (gameState.isGameOver()) return
      setIsAITurn(true)
      setStatus("Computer is thinking...")
      setTimeout(() => {
        const engine = new EngineGame(gameState.fen())
        const move = engine.aiMove(aiLevel)
        const from = Object.keys(move)[0].toLowerCase()
        const to = move[from.toUpperCase()].toLowerCase()
        const updatedGame = new Chess(gameState.fen())
        const madeMove = updatedGame.move({ from, to, promotion: "q" })
        if (madeMove) {
          setMoveHistory((prev) => [...prev, madeMove])
          setChess(updatedGame)
          updateStatus(updatedGame)
        }
        setIsAITurn(false)
      }, 500)
    }, [aiLevel])

  const updateStatus = useCallback(
    (game: Chess) => {
      if (game.isCheckmate()) {
        const winner = game.turn() === "w" ? "Black" : "White"
        const res = game.turn() === "w" ? "0-1" : "1-0"
        setResult(res)
        setStatus(`Checkmate — ${winner} wins!`)
      } else if (game.isDraw()) {
        setResult("1/2-1/2")
        setStatus("Draw!")
      } else if (game.isCheck()) {
        setStatus("Check!")
      } else {
        setStatus(game.turn() === playerColor ? "Your turn" : "Computer's turn")
      }
    }, [playerColor])

  const handleDrop = useCallback(
    (source: Square, target: Square) => {
      if (!chess || !isPlayerTurn) {
        toast.error("Not your turn!")
        return false
      }

      const legalMoves = chess.moves({ square: source, verbose: true })
      const valid = legalMoves.find((m) => m.to === target)
      if (!valid) {
        toast.error("Invalid move.")
        return false
      }
      const newGame = new Chess(chess.fen())
      const move = newGame.move({ from: source, to: target, promotion: "q" })
      if (move) {
        setMoveHistory((prev) => [...prev, move])
        setChess(newGame)
        updateStatus(newGame)
        if (!newGame.isGameOver()) setTimeout(() => handleAIMove(newGame), 300)
        return true
      }
      return false
    }, [chess, isPlayerTurn, handleAIMove, updateStatus])

  useEffect(() => {
    if (!user?.id || !chess || !result || moveHistory.length === 0) return

    const pgn = moveHistory.reduce((str, move, i) => {
        const prefix = i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : ""
        return str + prefix + move.san + " "
      }, "").trim()

    createGame.mutate({
      id: createId(), 
      whiteid: playerColor === "w" ? user.id : "computer",
      blackid: playerColor === "b" ? user.id : "computer",
      pgn,
      result,
      createdAt: new Date()
    })
  }, [result])

  const resetGame = () => {
    setChess(null)
    setMoveHistory([])
    setResult("")
    setStatus("Waiting...")
    setIsAITurn(false)
    setAiLevel(0)
    setPlayerColor(null)
  }

  if (!aiLevel || !playerColor || !chess) {
    return <VsComputerModal setAiLevel={setAiLevel} setPlayerColor={setPlayerColor} />
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-900">
      <main className="flex flex-col items-center justify-center h-full py-10 px-4">
        <h1 className="text-2xl font-bold text-white mb-4">Chess vs Computer</h1>
        <p className="text-lg text-gray-300 mb-4">{status}</p>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <Chessboard boardWidth={Math.min(600)} position={chess.fen()} onPieceDrop={handleDrop} arePremovesAllowed boardOrientation={playerColor === "w" ? "white" : "black"}/>
        </div>
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors" onClick={resetGame}> Start New Game</button>
      </main>
    </div>
  )
}