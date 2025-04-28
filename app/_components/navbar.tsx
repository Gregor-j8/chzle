'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from "next/link"

export default function NavBar() {
    const router = useRouter()
    const [value, setValue] = useState('')

    const handleChange = (e) => {
        const selected = e.target.value;
        setValue(selected);
        if (selected) {
          router.push(selected);
        }
      };
    return (
        <nav className="w-full flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          </div>
          <Link href="/" className="text-lg font-semibold hover:text-blue-600">Home</Link>
        </div>
          <div className="flex items-center space-x-6">
          <Link href="/game" className="text-md font-medium hover:text-blue-600">New Game</Link>
          <select value={value} onChange={handleChange}
            className="border rounded-md px-3 py-2 text-sm bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="">Select a page</option>
            <option value="/puzzles">Puzzles</option>
            <option value="/dailypuzzle">Daily Puzzle</option>
          </select>
        </div>
      </nav>
    )
}