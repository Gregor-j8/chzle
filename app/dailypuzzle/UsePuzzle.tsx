"use client"
import { Chess, Move } from 'chess.js'
import { useEffect, useState } from 'react'
import { trpc } from '@/utils/trpc'

type PuzzleData = {
  startingFen: string
  history: Move[]
  solutionMoves: Move[] 
  loading: boolean
  puzzleId: string
  rating: number
}

export default function UsePuzzle(): PuzzleData {
  const [startingFen, setStartingFen] = useState<string>('')
  const [history, setHistory] = useState<Move[]>([])
  const [solutionMoves, setSolutionMoves] = useState<Move[]>([])
  const [loading, ] = useState(true)
  const [puzzleId, setPuzzleId] = useState<string>('')
  const [rating, setRating] = useState<number>(0)
  const {data} = trpc.dailypuzzle.getDailyPuzzles.useQuery()

  useEffect(() => {
    const fetchPuzzle = async () => {
      console.log(data)
      if (!data && !data?.alreadyCompleted) return
        const pgn = data?.game.pgn
        setPuzzleId(data?.puzzle.id)
        setRating(data?.puzzle.rating)
        setSolutionMoves(data?.puzzle.solution)
        const initialPly = data?.puzzle.initialPly
        console.log("pgn", pgn)
        console.log("initialPly", initialPly)
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
    }
    fetchPuzzle()
  }, [data])

  return { startingFen, history, solutionMoves, loading, rating, puzzleId }
}

