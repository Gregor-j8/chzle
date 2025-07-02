"use client"
import { useState } from "react"
import Link from "next/link"

interface VsComputerModalProps {
  setAiLevel: (level: number) => void
  setPlayerColor: (color: "w" | "b") => void
}

export default function VsComputerModal({ setAiLevel, setPlayerColor }: VsComputerModalProps) {
  const [difficulty, setDifficulty] = useState<number>(0)
  const [color, setColor] = useState<"w" | "b" | "">("")

  const handleStart = () => {
    if (difficulty > 0 && color) {
      setAiLevel(difficulty)
      setPlayerColor(color)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90">
    <div className="bg-gray-800 text-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Play vs Computer</h2>
    <div className="w-full mb-6">
      <label htmlFor="difficulty-slider" className="block mb-2 text-white">
        Difficulty: <span className="font-bold text-blue-400">{difficulty}</span>
      </label>
      <input id="difficulty-slider" type="range" min={1} max={16} value={difficulty}
        onChange={(e) => setDifficulty(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"/>
    </div>
      <div className="mb-6">
        <label className="block mb-2 text-gray-300 font-medium">Choose Color</label>
        <div className="flex gap-4">
          <button className={`flex-1 p-3 rounded-lg border ${color === "w"? "bg-blue-600 border-blue-500 text-white"
            : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"}`}
            onClick={() => setColor("w")}>White</button>
          <button className={`flex-1 p-3 rounded-lg border ${color === "b"
            ? "bg-blue-600 border-blue-500 text-white" : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"}`}
            onClick={() => setColor("b")}>Black</button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Link href="/" className="text-gray-400 hover:underline text-sm">Cancel</Link>
        <button onClick={handleStart} disabled={!(difficulty > 0 && color)}
          className={`px-4 py-2 rounded-lg font-semibold ${difficulty > 0 && color ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}>
          Start Game
        </button>
      </div>
    </div>
  </div>
  )
}