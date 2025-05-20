"use client"
import { trpc } from "@/utils/trpc"
import { usePuzzleGame } from "./PuzzleGame"
import { PuzzleBoard } from "./PuzzleBoard"
import { useState } from "react"
import { LoadingPage } from "../_components/loading"
import type { Puzzle } from "@/types/global"

export default function Puzzles () {
  const { data, isLoading, refetch } = trpc.puzzle.getPuzzles.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    suspense: true
  })

  const puzzles = (data ?? []) as Puzzle[]
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const {game, gameStatus, onDrop: originalOnDrop} = usePuzzleGame(puzzles as Puzzle[] | undefined, puzzleIndex)
  const onDrop = (source: string, target: string) => {
    const result = originalOnDrop(source, target);
    return result !== false;
  }

  const nextPuzzle = async () => {
    const next = puzzleIndex + 1

    if (puzzles && next >= puzzles.length) {
      const { data: newPuzzles } = await refetch() as { data: Puzzle[] }
      if (newPuzzles?.length) {
        setPuzzleIndex(0)
      }
    } else {
      setPuzzleIndex(next)
    }
  }

  return (
    <PuzzleBoard
      game={game}
      gameStatus={gameStatus}
      onDrop={onDrop}
      onNextPuzzle={nextPuzzle}
    />
  );
}
