/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from "react"
import { trpc } from "@/utils/trpc"
import { ArrowLeft, ArrowRight, X } from "lucide-react"
import { LoadingPage } from "../_components/loading"
import { Chessboard } from "react-chessboard"

export default function GameReviewModal({ username, onClose, setChoosenMatch }) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)
  const [page, setPage] = useState(1)
  const [gameData, setGameData] = useState<any>(null)
  const [IsUpdating, setIsUpdating] = useState(false)

  const { data, isLoading, isFetching } = trpc.gameReviewRouter.getGameReview.useQuery({ username, year, month, page }, { enabled: !!username })
  useEffect(() => {
    if (data) {
      setGameData(data)
      setIsUpdating(false)
    }
  }, [data])

  const handleNext = () => {
    if (!data) return
    setIsUpdating(true)
    if (page < data.totalPages) {
      setPage(prev => prev + 1)
    } else {
      const newMonth = month === 1 ? 12 : month - 1
      const newYear = month === 1 ? year - 1 : year
      setMonth(newMonth)
      setYear(newYear)
      setPage(1)
    }
  }

  const handlePrev = () => {
    const future = (month === 12 && year + 1 > currentYear) || (month < 12 && year === currentYear && month + 1 > currentMonth)
    if (future) return
    setIsUpdating(true)
    if (page > 1) {
      setPage(prev => prev - 1)
    } else {
      const newMonth = month === 12 ? 1 : month + 1
      const newYear = month === 12 ? year + 1 : year
      if (newYear > currentYear || (newYear === currentYear && newMonth > currentMonth)) return
      setMonth(newMonth)
      setYear(newYear)
      setPage(1)
    }
  }
  if (isLoading && !gameData) return <LoadingPage />
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-900 text-white w-full max-w-2xl p-6 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Games for {month}/{year}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>

        {gameData && (
          <div>
            {gameData.games.length > 0 ? (
              <div>
                <p className="text-sm text-gray-400 mb-4">Page {page} of {gameData.totalPages}</p>
                <div className="max-h-96 overflow-auto text-sm border border-gray-700 bg-gray-800 rounded-md p-4 space-y-3">
                  {gameData.games.map((game, i) => (
                    <div key={i} className="p-2 bg-gray-700 rounded-md border border-gray-600 hover:bg-gray-600 transition flex flex-col gap-3" 
                    onClick={() => { setChoosenMatch(game); onClose()}}>
                      <div className="flex justify-between items-center gap-4 flex-wrap">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-6 text-gray-100">
                          <div className="space-y-1">
                            <p>White: {game?.tags.White}</p>
                            <p>Black: {game?.tags.Black}</p>
                          </div>
                          <p className="text-center text-gray-300 font-bold">
                            Result: {game?.tags.Result === "1-0" ? `${game?.tags.White} wins` : game?.tags.Result === "0-1" ? `${game?.tags.Black} wins` : "Draw"}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <Chessboard boardWidth={60} position={game?.tags.CurrentPosition} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : 'Not found please try a different month or different user'}

            <div className="flex justify-between items-center mt-4">
              <button onClick={handleNext} disabled={isFetching || IsUpdating} className="px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50">
                <ArrowLeft />
              </button>
              <button onClick={handlePrev} disabled={(month === currentMonth && year === currentYear && page === 1) || isFetching || IsUpdating}
                className="px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50">
                <ArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}