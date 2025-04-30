"use client"
import { Chess, Move } from 'chess.js'
import { useEffect, useState } from 'react'
import getPuzzles from './getpuzzle'

type PuzzleData = {
  startingFen: string
  history: Move[]
  solutionMoves: Move[] 
  loading: boolean
  error: string | null
}

export default function UsePuzzle(): PuzzleData {
  const [startingFen, setStartingFen] = useState<string>('')
  const [history, setHistory] = useState<Move[]>([])
  const [solutionMoves, setSolutionMoves] = useState<Move[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const data = await getPuzzles()
        const pgn = data?.game.pgn
        setSolutionMoves(data?.puzzle.solution)
        const initialPly = data?.puzzle.initialPly

        if (!pgn || !initialPly) {
          throw new Error('Invalid puzzle data')
        }

        const chess = new Chess()
        chess.loadPgn(pgn)

        const fullHistory = chess.history({ verbose: true })
        chess.reset()

        for (let i = 0; i <= initialPly; i++) {
          chess.move(fullHistory[i])
        }

        setStartingFen(chess.fen())
        setHistory(fullHistory)

      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to fetch puzzle')
      } finally {
        setLoading(false)
      }
    }

    fetchPuzzle()
  }, [])

  return { startingFen, history, solutionMoves, loading, error }
}

