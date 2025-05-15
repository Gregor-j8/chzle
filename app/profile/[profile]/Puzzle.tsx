'use client'
import { useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { trpc } from '@/utils/trpc'

export default function PuzzleSlideshow({
  userId,
  onSelect,
}: {
  userId: string
  onSelect: (puzzle: any) => void
}) {
  const [page, setPage] = useState(0)
  const take = 3
  const skip = page * take

  const { data: puzzles = [], isLoading } = trpc.profile.getUserPuzzles.useQuery({
    userId,
    skip,
    take,
  })

  const handleNext = () => {
    if (puzzles.length === take) setPage((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (page > 0) setPage((prev) => prev - 1)
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mb-6 text-white text-center">
        Loading puzzles...
      </div>
    )
  }

  if (puzzles.length === 0 && page === 0) {
    return (
      <div className="w-full max-w-4xl mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 text-center">Puzzles</h2>
        <h2 className="text-xl font-semibold text-white mb-4 text-center">You haven’t played yet!</h2>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mb-6">
      <h2 className="text-xl font-semibold text-white mb-4 text-center">Puzzles</h2>
      <div className="relative bg-gray-800 rounded-lg p-4 shadow-lg">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl px-3 py-1 rounded-full ${
            page === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-700'
          }`}
        >
          ←
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center">
          {puzzles.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelect(p.puzzle)}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <Chessboard position={p.puzzle.fen} boardWidth={150} />
            </div>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={puzzles.length < take}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl px-3 py-1 rounded-full ${
            puzzles.length < take ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-700'
          }`}
        >
          →
        </button>
      </div>
    </div>
  )
}
