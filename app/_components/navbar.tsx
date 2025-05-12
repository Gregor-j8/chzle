'use client'
import defaulticonimg from '@/public/defaulticonimg.jpg'
import { SignInButton, SignUpButton, SignedIn, SignedOut, SignOutButton  } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from "next/link"
import { useUser } from '@clerk/clerk-react'
import Image from 'next/image'

export default function NavBar() {
  const {user} = useUser()
    const router = useRouter()
    const [value, setValue] = useState('')

    const handleChange = (e) => {
        const selected = e.target.value;
        setValue(selected)
        if (selected) {
          router.push(selected)
        }
      }

    return (
      <nav className="w-full flex items-center justify-between p-4 bg-white shadow-sm border-b">
      <div className="flex items-center gap-6">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-white">
          ♟
        </div>
        <Link href="/" className="text-base font-semibold hover:text-blue-600 transition">Home</Link>
      </div>
      <div className="hidden md:flex items-center">
        <select value={value} onChange={handleChange}
          className="border rounded-md px-3 py-2 text-sm bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="">Select a page</option>
          <option value="/puzzles">Puzzles</option>
          <option value="/dailypuzzle">Daily Puzzle</option>
        </select>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/game" className="text-sm font-medium hover:text-blue-600 transition">New Game</Link>

        <SignedOut>
          <SignInButton>
            <button className="px-3 py-1 text-sm font-medium border border-blue-600 rounded hover:bg-blue-50 text-blue-600">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="px-3 py-1 text-sm font-medium border border-blue-600 rounded hover:bg-blue-50 text-blue-600">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

    <SignedIn>
      <Link href={`/profile/${user?.username}`}>
        <Image src={user?.imageUrl || defaulticonimg} alt="Profile" width={32} height={32}
        className="rounded-full border hover:ring-2 ring-blue-400 transition border-none"/>
      </Link>
    </SignedIn> 
    {user && (
        <SignOutButton>
            <button className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
        </SignOutButton>
    )}

      </div>
    </nav>
  )
}