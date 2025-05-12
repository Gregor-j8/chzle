'use client'
import React, { useEffect, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'

export default function ReplayModal({ puzzle }: any) {
  const [chess] = useState(new Chess())
  const [fen, setFen] = useState('')
  const [moves, setMoves] = useState<string[]>([])
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (puzzle?.fen && !puzzle.pgn) {
      setFen(puzzle.fen)
    } else {
        setFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    }
    if (puzzle?.moves) {
      setMoves(puzzle.moves.trim().split(' '))
    } else {
        setMoves(puzzle.pgn.trim().split(' '))
    }
  }, [puzzle, chess])

  const getFenAtStep = (index: number) => {
    const t = new Chess()
    t.load(puzzle?.moves ? puzzle.fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
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
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <Chessboard position={fen} boardWidth={400} />
      <div className="flex gap-4 items-center">
        <button onClick={handleBack} disabled={step === 0} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">◀</button>
        <span className="px-2 text-sm">{step + 1}/{moves.length + 1}</span>
        <button onClick={handleForward} disabled={step === moves.length}className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">▶</button>
      </div>
    </div>
  )
}
