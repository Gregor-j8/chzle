'use client'
import { useEffect, useState } from 'react'
import { Chess, Move } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

type ExplorerMove = {
  san: string
  uci: string
  white: number
  draws: number
  black: number
  games: number
}

export default function OpeningExplorer (){
  const [game, setGame] = useState(new Chess())
  const [moves, setMoves] = useState<ExplorerMove[]>([])
  const [history, setHistory] = useState<Move[]>([])
  const [openingInfo, setOpeningInfo] = useState<{ name?: string} | null>(null)
  const [dbSource, setDbSource] = useState<'lichess' | 'master'>('lichess')
  const [search, setSearch] = useState('')
  const fetchOpeningData =(fen: string) => {
  fetch(`https://explorer.lichess.ovh/${dbSource}?variant=standard&fen=${encodeURIComponent(fen)}`)
    .then(res => res.json())
    .then(data => {
      setMoves(data.moves || [])
      setOpeningInfo({ name: data.opening?.name })   
    })
  }
  useEffect(() => {
    fetchOpeningData(game.fen())
  }, [game.fen(), dbSource])
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
    newHistory.forEach((m) => newGame.move(m))
    setHistory(newHistory)
    setGame(newGame)
  }
  const chartData = openingInfo && [
    { name: 'White Wins', value: moves.reduce((sum, m) => sum + m.white, 0) },
    { name: 'Draws', value: moves.reduce((sum, m) => sum + m.draws, 0) },
    { name: 'Black Wins', value: moves.reduce((sum, m) => sum + m.black, 0) },
  ]
  const filteredMoves = moves.filter(m => m.san.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
        <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={Math.min(400)} boardOrientation="white"/>
        <div className="flex gap-2">
          <button onClick={handleUndo} className="px-4 py-2 bg-red-600 rounded">Undo</button>
          <button onClick={() => setDbSource(dbSource === 'lichess' ? 'master' : 'lichess')} className="px-4 py-2 bg-blue-600 rounded">
            DB: {dbSource}
          </button>
        </div>
      </div>
      <div className="w-full lg:max-w-md bg-gray-800 p-4 rounded-xl">
        <h2 className="text-xl font-bold mb-2">Opening Explorer</h2>
        <div className="mb-2">{openingInfo?.name && <p className="text-sm">{openingInfo.name}</p>}</div>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search SAN move" className="w-full p-2 rounded bg-gray-700 mb-4 text-sm"/>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-none">
            {filteredMoves.map(m => (
              <div key={m.uci} className="bg-gray-700 p-2 rounded hover:bg-gray-600 cursor-pointer" onClick={() => handleSuggestedMove(m.san)}>
                <div className="flex justify-between text-sm"><span>{m.san} {m.games}</span></div>
              </div>
            ))}
          </div>
        <h3 className="text-md mt-4 mb-2 font-semibold">Results Chart</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData || []} layout="vertical">
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={60} />
            <Bar dataKey="value" fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}