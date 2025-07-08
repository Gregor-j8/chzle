import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";

interface Props {
  game: Chess
  gameStatus: string
  onDrop: (source: string, target: string) => boolean
  onNextPuzzle: () => void
}

export const PuzzleBoard = ({ game, gameStatus, onDrop, onNextPuzzle }: Props) => {
  const [width, setWidth] = useState(600)

  useEffect(() => {
  const handleResize = () => {setWidth(Math.min(637, window.innerWidth - 40))}
  handleResize()
  window.addEventListener("resize", handleResize)
  return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex flex-col justify-center items-center mt-18 lg:mt-1 bg-gray-800">
      <h1 className="text-xl font-bold mt-10 mb-2">Chess Puzzles</h1>
      <h2 className="mb-4">{gameStatus}</h2>
      <div className="shadow-lg rounded-md overflow-hidden sm:touch-manipulation">
        <Chessboard arePremovesAllowed={true} position={game.fen()} boardWidth={width} arePiecesDraggable={true} 
           onPieceDrop={(sourceSquare, targetSquare) => onDrop(sourceSquare, targetSquare)}/>
      </div>
      <div className="mt-4 flex gap-4 mb-5">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={onNextPuzzle}> Next Puzzle</button>
      </div>
    </div>
  )
}
