'use client'
import { useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { trpc } from '@/utils/trpc'
import EvaluationBar from '../_components/ChessEvalBar'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

export default function GameReviewModal({ choosenMatch, onClose, setChoosenMatch }) {
  const match = choosenMatch?.tags?.Link?.match(/\d+/)
  const [chess, setChess] = useState(new Chess())
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [fen, setFen] = useState('')
  const { data: evaluation } = trpc.game.getEvaluation.useQuery( { fen, gameId: match?.[0] },{ enabled: !!fen && !!match[0] })
  const [width, setWidth] = useState(600)
  const [boardSide, setboardSide] = useState<'white' | 'black'>('white')

  useEffect(() => {
    const handleResize = () => setWidth(Math.min(637, window.innerWidth - 40))
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!choosenMatch?.moves) return
    const pgnMoves = choosenMatch.moves.map(move => move.notation?.notation || '').join(' ')
    const gameInstance = new Chess()
    const moves: string[] = []

    gameInstance.loadPgn(pgnMoves)
    gameInstance.history({ verbose: true }).forEach(m => moves.push(`${m?.from}${m?.to}`))

    setMoveHistory(moves)
    setChess(new Chess())
    setFen(new Chess().fen())
    setCurrentMoveIndex(0)
  }, [choosenMatch])

  const handleNext = () => {
    if (currentMoveIndex < moveHistory.length) {
      const nextGame = new Chess()
      for (let i = 0; i <= currentMoveIndex; i++) {
        const move = moveHistory[i]
        if (move) {
          nextGame.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: 'q' })
        }
      }
      setFen(nextGame.fen())
      setChess(nextGame)
      setCurrentMoveIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentMoveIndex > 0) {
      const prevGame = new Chess()
      for (let i = 0; i < currentMoveIndex - 1; i++) {
        const move = moveHistory[i]
        if (move) {
          prevGame.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: 'q' })
        }
      }
      setFen(prevGame.fen())
      setChess(prevGame)
      setCurrentMoveIndex(prev => prev - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg bg-gray-900 p-6 text-white">
        <button onClick={() => {onClose(); setChoosenMatch(false)}} className="absolute top-4 right-4 text-white hover:text-gray-400">
          <X size={24} />
        </button>

          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center lg:items-start">
            <div className="w-full lg:w-40 bg-gray-800 rounded-xl p-4 max-h-64 sm:max-h-30 lg:max-h-[520px] overflow-y-auto">
              <h1 className="font-bold mb-2">Game Moves</h1>
              <div className="flex lg:flex-col gap-1">
                {moveHistory?.map((move, i) => (
                  <div key={i} className={`text-sm ${i === currentMoveIndex - 1 ? 'text-blue-400' : ''}`}>
                    <button onClick={() => {}}>
                      {`${i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : ''} ${move}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex">
              <Chessboard
                position={chess.fen()}
                arePiecesDraggable={false}
                boardWidth={width}
                boardOrientation={boardSide}
              />
              <EvaluationBar evaluation={evaluation} />
            </div>
            <div className="flex lg:flex-col ml-3 bg-gray-800 p-4 rounded-md max-h-[520px] overflow-y-auto w-full lg:w-36">
              <h1 className="font-bold mb-2">Best moves</h1>
              {evaluation?.error ? (
                <div>{evaluation?.error}</div>
              ) : (
                evaluation?.continuationArr?.map((moves, i) => (
                  <p key={i} className="text-sm">{i}: {moves}</p>
                ))
              )}
            </div>
          </div>

        <div className="flex items-center gap-3 mt-4 justify-center">
          <button onClick={handlePrev} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">
            <ArrowLeft />
          </button>
          <span>{`Move ${currentMoveIndex} / ${moveHistory.length}`}</span>
          <button onClick={handleNext} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">
            <ArrowRight />
          </button>
          <button
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            onClick={() => setboardSide(boardSide === 'white' ? 'black' : 'white')}
          >
            Flip Board
          </button>
        </div>
      </div>
    </div>
  )
}
