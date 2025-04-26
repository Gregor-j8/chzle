"use client";
import { trpc } from "@/utils/trpc";
import { usePuzzleGame } from "./PuzzleGame";
import { PuzzleBoard } from "./PuzzleBoard";
import { useState } from "react";
import { LoadingPage } from "../_components/loading";

export default function Puzzles() {
  const { data: puzzles, isLoading, refetch} = trpc.puzzle.getPuzzles.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  })
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const {game, gameStatus, onDrop, setGame, setOldMoves} = usePuzzleGame(puzzles, puzzleIndex)

  const nextPuzzle = async () => {
    const next = puzzleIndex + 1

    if (puzzles && next >= puzzles.length) {
      const { data: newPuzzles } = await refetch()
      if (newPuzzles?.length) {
        setPuzzleIndex(0)
      }
    } else {
      setPuzzleIndex(next)
    }
  }

  if (isLoading || !puzzles) return <div className="text-center py-8"><LoadingPage /></div>

  return (
    <PuzzleBoard
      game={game}
      gameStatus={gameStatus}
      onDrop={onDrop}
      onNextPuzzle={nextPuzzle}
    />
  );
}
