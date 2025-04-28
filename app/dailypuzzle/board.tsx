'use client'
import { Move } from "chess.js";
import { Chessboard } from "react-chessboard";

interface BoardProps  {
  startingFen: string
  history?: Move[]
}

export default function Board({startingFen, history }: BoardProps ) {
  console.log("history", history)
  console.log("fen", startingFen)
     return (
        <div className="flex flex-col justify-center items-center py-8 bg-slate-100">
          <h1 className="text-xl font-bold mb-2">Chess Daily Puzzles</h1>
          <h2 className="mb-4">title</h2>
          <div className="shadow-lg rounded-md overflow-hidden">
            <Chessboard
              arePremovesAllowed={true}
              position={startingFen}
              boardWidth={650}
            />
          </div>
          <div className="mt-4 flex gap-4">
          </div>
        </div>
      )
}