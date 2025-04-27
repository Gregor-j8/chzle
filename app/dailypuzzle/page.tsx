'use client'
import { Chessboard } from "react-chessboard";

interface props {
  startingFen: string
  history?: string[]
}

export default function Board({startingFen, }: props) {
     return (
        <div className="flex flex-col justify-center items-center py-8 bg-slate-100">
          <h1 className="text-xl font-bold mb-2">Chess Daily Puzzles</h1>
          <h2 className="mb-4">{}</h2>
          <div className="shadow-lg rounded-md overflow-hidden">
            <Chessboard
              arePremovesAllowed={true}
              position={startingFen}
              boardWidth={650}
            />
          </div>
          <div className="mt-4 flex gap-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Next Puzzle
            </button>
          </div>
        </div>
      );
}