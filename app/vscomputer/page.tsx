"use client"
import { useEffect, useState, useCallback } from "react"
import { Chess, Move, Square } from "chess.js"
import { Chessboard } from "react-chessboard"
import { useUser } from "@clerk/nextjs"
import { toast } from "react-hot-toast"
import { trpc } from "@/utils/trpc"
import VsComputerModal from "../game/vscomputermodal"
import { createId } from '@paralleldrive/cuid2'

export default function GamePage() {
  const { user } = useUser()
  const createGame = trpc.game.createGame.useMutation()
  const getMove = trpc.game.getAiMove.useMutation()
  const [chess, setChess] = useState<Chess | null>(null)
  const [aiLevel, setAiLevel] = useState<number>(0)
  const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null)
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [result, setResult] = useState<string>("")
  const [status, setStatus] = useState<string>("Waiting...")
  const [, setIsAITurn] = useState<boolean>(false)
  const isPlayerTurn = chess && chess.turn() === playerColor

  const updateStatus = useCallback((game: Chess) => {
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

  const makeAIMove = useCallback(async (gameState: Chess) => {
    if (aiLevel === 0) return
    const fen = gameState.fen();
    console.log(fen)
    const { bestmove, ponder } = await getMove.mutateAsync({ fen, depth: aiLevel });
    if (!bestmove || bestmove.length < 4) throw new Error("Invalid move from Stockfish");
    const from = bestmove.slice(0, 2)
    const to = bestmove.slice(2, 4)
    const updatedGame = new Chess(fen)
    const madeMove = updatedGame.move({ from, to, promotion: "q" });

    if (madeMove) {
      setMoveHistory((prev) => [...prev, madeMove]);
      setChess(updatedGame);
      updateStatus(updatedGame);
    }
  }, [getMove, updateStatus]);

  useEffect(() => {
    if (aiLevel && playerColor && !chess) {
      const newGame = new Chess()
      setChess(newGame)
      if (playerColor === "b") {
        makeAIMove(newGame)
      }
    }
  }, [aiLevel, playerColor, chess, makeAIMove])

  const handleDrop = useCallback((source: Square, target: Square) => {
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
        if (!newGame.isGameOver()) setTimeout(() => makeAIMove(newGame), 300)
        return true
      }
      return false
    }, [chess, isPlayerTurn, makeAIMove, updateStatus])

  useEffect(() => {
    if (!user?.id || !chess || !result || moveHistory.length === 0) return
    const pgn = moveHistory.map(m => `${m.from}${m.to}`).join(' ')
    createGame.mutate({
      id: createId(), 
      whiteid: playerColor === "w" ? user.id : "computer",
      blackid: playerColor === "b" ? user.id : "computer",
      pgn,
      result,
      fen: chess.fen(),
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
    <div className="h-screen overflow-hidden bg-gray-900 mt-[-64]">
      <main className="flex flex-col items-center justify-center h-full mt-5 p-10 px-4">
        <h1 className="text-2xl font-bold text-white mb-5">Chess vs Computer</h1>
        <p className="text-lg text-gray-300 mb-4">{status}</p>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <Chessboard boardWidth={Math.min(637, typeof window !== "undefined" ? window.innerWidth - 40 : 637)} position={chess.fen()}
            onPieceDrop={handleDrop} arePremovesAllowed boardOrientation={playerColor === "w" ? "white" : "black"}/>
        </div>
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors" onClick={resetGame}> Start New Game</button>
      </main>
    </div>
  )
}