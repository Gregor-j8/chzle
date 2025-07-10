'use client'
import { useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { trpc } from '@/utils/trpc'
import { LoadingSpinner } from '../../_components/loading'
import EvaluationBar from '../../_components/ChessEvalBar'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function GameAnalysis() {
  const params = useParams()
  const { gameId } = params
  const id: string = typeof gameId === 'string' ? gameId : ''
  const [chess, setChess] = useState(new Chess())
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [fen, setFen] = useState("")
  const { data: game, isLoading } = trpc.game.findGameDetails.useQuery({ id }, { enabled: !!id })
  const { data: evaluation} = trpc.game.getEvaluation.useQuery({ fen, gameId: game?.id }, { enabled: !!fen })
  const [width, setWidth] = useState(600)
  const [boardSide, setboardSide] = useState<"white" | "black">("white")

  useEffect(() => {
    const handleResize = () => {setWidth(Math.min(637, window.innerWidth - 40))}
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  useEffect(() => {
  if (!game?.pgn) return

  const gameInstance = new Chess()
  const moves: string[] = []

  gameInstance.loadPgn(game.pgn)
  gameInstance.history({ verbose: true }).forEach(m => moves.push(`${m.from}${m.to}`))
  setMoveHistory(moves)
  setChess(new Chess())
  setFen(new Chess().fen())
  setCurrentMoveIndex(0)
  }, [game])

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
  
  if (isLoading || !game) {
    return <div className="text-white mt-10"><LoadingSpinner/></div>
  }
  return (
   <div className="w-full flex flex-col items-center px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl justify-center items-center lg:items-start">
        <div className="w-full lg:w-40 bg-gray-800 rounded-xl p-4 text-white max-h-64 sm:max-h-30 lg:max-h-[520px] overflow-y-auto">
          <div className="flex lg:flex-col">
            <h1>Game Moves</h1>
                {moveHistory?.map((move, i) => (
                  <div key={i} className={`py-0.5 ${i === currentMoveIndex - 1 ? 'text-blue-400' : ''}`}>
                    <button value={i} onClick={() => {}}>
                      {`${i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : ''} ${move}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex'>
              <div className=''>
                <Chessboard
                  position={chess.fen()}
                  arePiecesDraggable={false}
                  boardWidth={width}
                  boardOrientation={boardSide}
                  />
                </div>
                <div>
                  <EvaluationBar evaluation={evaluation} />
                </div>
            </div>
                {evaluation?.error ? (
                  <div>{evaluation?.error}</div>
                ) : (
                  <div className='flex lg:flex-col ml-3 bg-gray-800 p-4 rounded-md text-white max-h-[520px] overflow-y-auto w-full lg:w-32'>
                    <h1>Bestmoves</h1>
                    {evaluation?.continuationArr?.map((moves, i) => (
                      <div key={i} className='flex'>
                        <div className='flex lg:flex-col p-1'>
                          <p>{i}: {moves},</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={handlePrev} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <ArrowLeft/>
            </button>
            <span className="text-white">{`Move ${currentMoveIndex} / ${moveHistory.length}`}</span>
            <button onClick={handleNext} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <ArrowRight/>
            </button>
            <button className='px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600' 
            onClick={() => {setboardSide(boardSide === "white" ? 'black' : "white")}}>Flip Board</button>
          </div>
      </div>
  )
}