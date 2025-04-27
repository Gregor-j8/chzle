"use client"
import { Chess } from 'chess.js';
import Board from './page';
import { useEffect, useState } from 'react';
import getPuzzles from './getpuzzle';

export default function Puzzles() {
  const [data, setData] = useState<t>({})
  console.log(data)
  useEffect(() => {
    const fetchPuzzle = async() => {
      const data = await getPuzzles()
      setData(data)
    }
    fetchPuzzle()
  }, [])
  const pgn = data?.game.pgn
  const initialPly = data.puzzle.initialPly

  const chess = new Chess()
  chess.loadPgn(pgn)
  
  let history = chess.history({ verbose: true })
  chess.reset();
  
  for (let i = 0; i < initialPly - 1; i++) {
    chess.move(history[i]);
  }
  
  const startingFen = chess.fen();
  console.log("Puzzle starts at FEN:", startingFen);
  return (
      <Board
        startingFen={startingFen}
      />
  )

};