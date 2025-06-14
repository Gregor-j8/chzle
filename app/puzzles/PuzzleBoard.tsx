import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

interface Props {
  game: Chess
  gameStatus: string
  onDrop: (source: string, target: string) => boolean
  onNextPuzzle: () => void
}

export const PuzzleBoard = ({ game, gameStatus, onDrop, onNextPuzzle }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center py-8 bg-gray-800">
      <h1 className="text-xl font-bold mb-2">Chess Puzzles</h1>
      <h2 className="mb-4">{gameStatus}</h2>
      <div className="shadow-lg rounded-md overflow-hidden">
        <Chessboard arePremovesAllowed={true} position={game.fen()} boardWidth={Math.min(637, typeof window !== "undefined" ? window.innerWidth - 40 : 637)}
           onPieceDrop={(sourceSquare, targetSquare) => onDrop(sourceSquare, targetSquare)}/>
      </div>
      <div className="mt-4 flex gap-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={onNextPuzzle}> Next Puzzle</button>
      </div>
    </div>
  )
}
