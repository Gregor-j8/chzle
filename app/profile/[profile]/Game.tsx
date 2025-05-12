'use client'
import { useState } from 'react'
import { Chessboard } from 'react-chessboard'

export default function GameSlideshow({games, onSelect}) {

  if (games.length === 0) {
    return <div className="w-full max-w-4xl mb-6">
      <h2 className="text-xl font-semibold text-white mb-4 text-center">Games</h2>
      <h2 className="text-xl font-semibold text-white mb-4 text-center">You havent played yet!</h2>
      </div>
  }

  const [index, setIndex] = useState(0)
  const gamesToShow = games.slice(index, index + 3)

  const handleNext = () => {
    if (index + 3 < games.length) {
      setIndex(index + 3)
    }
  }

  const handlePrev = () => {
    if (index - 3 >= 0) {
      setIndex(index - 3)
    }
  }
  return (
    <div className="w-full max-w-4xl mb-6">
      <h2 className="text-xl font-semibold text-white mb-4 text-center">Games</h2>
      <div className="relative bg-gray-800 rounded-lg p-4 shadow-lg">
        <button onClick={handlePrev} disabled={index === 0} className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl px-3 py-1 rounded-full 
        ${index === 0? 'text-gray-600 cursor-not-allowed': 'text-white hover:bg-gray-700'}`}>←</button>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center">
          {gamesToShow.map((p) => (
            <div key={p.id} onClick={() => onSelect(p)} className="cursor-pointer transition-transform hover:scale-105">
                 <Chessboard position={p.fen} boardWidth={150} />
            </div>
          ))}
        </div>
        <button onClick={handleNext} disabled={index + 3 >= games.length} 
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl px-3 py-1 rounded-full ${
            index + 3 >= games.length ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}>→</button>
      </div>
    </div>
  )
}
