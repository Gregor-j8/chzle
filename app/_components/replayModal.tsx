'use client'
import React, { useEffect, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Puzzle {
  fen?: string
  pgn?: string
  moves?: string
  id?: string
}

export default function ReplayModal({ puzzle }: { puzzle: Puzzle }) {
  const [chess] = useState(new Chess())
  const [fen, setFen] = useState('')
  const [moves, setMoves] = useState<string[]>([])
  const [step, setStep] = useState(0)
  const [isGame, setIsGame] = useState(false)

  useEffect(() => {
    setIsGame(false)
    if (puzzle?.fen && !puzzle.pgn) {
      setFen(puzzle.fen)
    } else {
        setFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    }
    if (puzzle?.moves) {
      setMoves(puzzle.moves.trim().split(' '))
    } else if (puzzle?.pgn) {
      setMoves(puzzle.pgn.trim().split(' '))
      setIsGame(true)
    } else {
      setMoves([])
    }
  }, [puzzle, chess])

  const getFenAtStep = (index: number) => {
    const t = new Chess()
    t.load(puzzle?.moves ? (puzzle.fen ?? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    for (let i = 0; i < index; i++) {
      t.move({
        from: moves[i].slice(0, 2),
        to: moves[i].slice(2, 4),
        promotion: 'q',
      });
    }
    return t.fen()
  }

  const handleForward = () => {
    if (step < moves.length) {
      const newStep = step + 1
      setStep(newStep)
      setFen(getFenAtStep(newStep))
    }
  }

  const handleBack = () => {
    if (step >= 1) {
      const newStep = step - 1
      setStep(newStep)
      setFen(getFenAtStep(newStep))
    }
  }
return (
<div className="flex w-full flex-col items-center gap-6 p-4">
  <div className="rounded-lg border border-slate-700 shadow-lg">
    <Chessboard position={fen} boardWidth={350} />
  </div>
  <div className="flex flex-wrap items-center justify-center gap-4">
    <button
      onClick={handleBack}
      disabled={step === 0}
      className={`px-4 py-2 rounded-md text-white transition ${
        step === 0 ? 'bg-slate-600 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600'
      }`}><ArrowLeft/></button>
    <span className="text-sm font-medium text-slate-300">{step + 1} / {moves.length + 1}</span>
    <button onClick={handleForward} disabled={step === moves.length}
      className={`px-4 py-2 rounded-md text-white transition ${
        step === moves.length ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}><ArrowRight/>
    </button>
  </div>
    {isGame && <Link href={`/gamereview/${puzzle?.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"><button>Game Review</button></Link>}
</div>
  )
}
