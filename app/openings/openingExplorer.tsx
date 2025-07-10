'use client'
import { useEffect, useState } from 'react'
import { Chess, Move } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { trpc } from '@/utils/trpc'
import { MoreVertical } from 'lucide-react'
import MoveDetailsModal from './MoveDetailsModal'
import Fuse from 'fuse.js'

  interface MoveData {
    san: string
    uci: string
    [key: string]: string | number | boolean | undefined
  }

export default function OpeningExplorer () {
  const [game, setGame] = useState(new Chess())
  const [history, setHistory] = useState<Move[]>([])
  const [search, setSearch] = useState('')
  const [, setTotalGames] = useState(0)
  const [boardSide, setBoardSide] = useState<"white" | "black">('white')
  const [chartData, setChartData] = useState<{ name: string; value: number; error: boolean }[]>([])
  const [moveDetailsModal, setMoveDetailsModal] = useState(false)
  const [MoveDetails, SetMoveDetails] = useState({})
  const { data } = trpc.OpeningRouter.getOpenings.useQuery({ fen: game.fen() })
  const [filteredMoves, setFilteredMoves] = useState<MoveData[]>([])

  useEffect(() => {
    if(data) {
    if (data?.white !== null && data?.draws !== null && data?.black !== null) {
      const total = data.white + data.draws + data.black
      setTotalGames(total)

      if (total > 100) {
        setChartData([
          { name: 'White Wins', value: (data.white / total) * 100, error: false },
          { name: 'Draws', value: (data.draws / total) * 100, error: false },
          { name: 'Black Wins', value: (data.black / total) * 100, error: false },
        ])
      } else {
        setChartData([{ name: 'not enough data', value: 0, error: true }])
      }
    }}
  }, [data])

  useEffect(() => {
    if (data?.moves) {
      setFilteredMoves(data.moves)
    }
  }, [data])

  useEffect(() => {
    if (data?.moves) {
      if (search.trim() === '') {
        setFilteredMoves(data.moves)
      } else {
        const fuse = new Fuse<MoveData>(data.moves, {
          keys: ['san'],
          threshold: 0.3,
          ignoreLocation: true,
          minMatchCharLength: 1,
        })
        const results = fuse.search(search)
        setFilteredMoves(results.map(result => result.item))
      }
    }
  }, [search, data])


  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })
    if (move) {
      setHistory([...history, move])
      setGame(new Chess(game.fen()))
      return true
    }
    return false
  }

  const handleSuggestedMove = (san: string) => {
    const newGame = new Chess(game.fen())
    const legal = newGame.moves({ verbose: true })
    const target = legal.find(m => m.san === san)
    if (target) {
      newGame.move(target)
      setHistory([...history, target])
      setGame(newGame)
    }
  }

  const handleUndo = () => {
    const newGame = new Chess()
    const newHistory = history.slice(0, -1)
    newHistory.forEach(m => newGame.move(m))
    setHistory(newHistory)
    setGame(newGame)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
        <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={Math.min(600)} boardOrientation={boardSide} />
        <div className="flex gap-2">
          <button onClick={handleUndo} className="px-4 py-2 bg-red-600 rounded">Undo</button>
          <button onClick={() => setBoardSide(boardSide === 'white' ? 'black' : 'white')} className="px-4 py-2 bg-blue-600 rounded">
            Flip Board
          </button>
        </div>
      </div>
      <div className="w-full lg:max-w-md bg-gray-800 p-4 rounded-xl">
        <h2 className="text-xl font-bold mb-2">Opening Explorer</h2>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search SAN move" className="w-full p-2 rounded bg-gray-700 mb-4 text-sm"/>
        <h1>{data?.opening?.name == null ? 'This is not a stored opening' : data.opening.name}</h1>
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-none">
          {filteredMoves.map(m => (
            <div key={m.uci} className="flex justify-between text-sm px-2 bg-gray-700 p-2 rounded hover:bg-gray-600 cursor-pointer"
              onClick={() => handleSuggestedMove(m.san)}>
              <div className="w-[80%] flex items-center">{m.san}</div>
              <div className="w-[20%] flex justify-end">
                <button onClick={e => { e.stopPropagation(); setMoveDetailsModal(true); SetMoveDetails(m)}}><MoreVertical size={16} /></button>
              </div>
            </div>
          ))}
        </div>
        <h3 className="text-md mt-4 mb-2 font-semibold">Results Chart</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={60} />
            <Bar dataKey="value" fill="#38bdf8">
              {chartData.map(i => (
                <Cell key={`cell-${i}`} />
              ))}
            </Bar>
            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {moveDetailsModal && (
        <MoveDetailsModal onClose={() => setMoveDetailsModal(false)} MoveDetails={MoveDetails} />
      )}
    </div>
  )
}