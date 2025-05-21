"use client"
import { trpc } from "@/utils/trpc"
import { usePuzzleGame } from "./PuzzleGame"
import { PuzzleBoard } from "./PuzzleBoard"
import { useState } from "react"
import type { Puzzle } from "@/types/global"

function PuzzlesContent() {
  const utils = trpc.useUtils()
  const { data } = trpc.puzzle.getPuzzles.useQuery({}, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    suspense: true,
    
  })

  const puzzles = (data ?? []) as Puzzle[]
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const { game, gameStatus, onDrop: originalOnDrop } = usePuzzleGame(puzzles, puzzleIndex)

  const onDrop = (source: string, target: string) => {
    const result = originalOnDrop(source, target)
    return result !== false
  }

  const nextPuzzle = async () => {
    const next = puzzleIndex + 1

    if (puzzles && next >= puzzles.length) {
      await utils.puzzle.getPuzzles.invalidate()
        setPuzzleIndex(0)
  }}

  if (!data) {
    return <div className="flex justify-center items-center h-screen text-white">Loading puzzles...</div>
  }

  return (
    <PuzzleBoard
      game={game}
      gameStatus={gameStatus}
      onDrop={onDrop}
      onNextPuzzle={nextPuzzle}
    />
  )
}

export default function Puzzles() {
  return <PuzzlesContent />
}