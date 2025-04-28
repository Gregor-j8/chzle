"use client"
import { Chess, Move } from 'chess.js'
import Board from './board'
import { useEffect, useState } from 'react'
import getPuzzles from './getpuzzle'
import { LoadingPage } from '../_components/loading'

export default function Puzzles() {
  const [startingFen, setStartingFen] = useState<string | null>(null)
  const [history, setHistory] = useState<Move[] | null>(null)

  useEffect(() => {
    const fetchPuzzle = async () => {
      const data = await getPuzzles()
      console.log("Fetched data:", data)

      const pgn = data?.game.pgn
      const initialPly = data?.puzzle.initialPly

      if (!pgn || !initialPly) {
        console.error('Invalid puzzle data')
        return
      }

      const chess = new Chess()
      chess.loadPgn(pgn)

      const fullHistory = chess.history({ verbose: true })
      chess.reset()

      for (let i = 0; i < initialPly - 1; i++) {
        chess.move(fullHistory[i])
      }

      setStartingFen(chess.fen())
      setHistory(fullHistory)
    }

    fetchPuzzle()
  }, [])

  if (!startingFen || !history) {
    return <div><LoadingPage /></div>
  }

  return (
    <Board
      startingFen={startingFen}
      history={history}
    />
  );
}
