import React, { useEffect, useState } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip,} from "recharts"
import { LoadingPage } from "../_components/loading"

export default function MoveDetailsModal({ onClose, MoveDetails}) {
  type ChartDataItem = { name: string; value: number; error?: boolean }
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [, setTotalGames] = useState(0)

  useEffect(() => {
    if ( MoveDetails && MoveDetails.white !== null && MoveDetails.draws !== null && MoveDetails.black !== null) {
      const total = MoveDetails.white + MoveDetails.draws + MoveDetails.black
      setTotalGames(total)

      if (total > 100) {
        setChartData([
          { name: "White Wins", value: (MoveDetails.white / total) * 100},
          { name: "Draws", value: (MoveDetails.draws / total) * 100},
          { name: "Black Wins", value: (MoveDetails.black / total) * 100},
        ])
      } else {
        setChartData([{ name: "Not enough data", value: 0, error: true }])
      }
    }
  }, [MoveDetails])

  if (!MoveDetails) return <LoadingPage/>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white"> Move: {MoveDetails.san}</h2>
        <div className="text-sm space-y-1 text-gray-700 dark:text-gray-200">
          <p>UCI: {MoveDetails.uci}</p>
          <p>Opening: {MoveDetails.opening?.name}</p>
          <p>Average Rating: {MoveDetails.averageRating}</p>
          <p>White Wins: {MoveDetails.white.toLocaleString()}</p>
          <p>Black Wins: {MoveDetails.black.toLocaleString()}</p>
          <p>Draws: {MoveDetails.draws.toLocaleString()}</p>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={80} />
              <Bar dataKey="value" fill="#38bdf8">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.error ? "#f87171" : "#38bdf8"}/>
                ))}
              </Bar>
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <button onClick={onClose} className="w-full py-2 bg-sky-500 text-white rounded hover:bg-sky-600">
          Close
        </button>
      </div>
    </div>
  )
}