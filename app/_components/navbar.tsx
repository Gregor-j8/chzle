'use client'
import defaulticonimg from '@/public/defaulticonimg.jpg'
import { SignInButton, SignUpButton, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from "next/link"
import { useUser } from '@clerk/clerk-react'
import Image from 'next/image'
import { trpc } from '@/utils/trpc'

export default function NavBar() {
  const { user } = useUser()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const utils = trpc.useUtils()
  const createUserMutation = trpc.profile.createUser.useMutation({
    onSuccess: () => {
      utils.profile.findUser.invalidate({ clerk_id: user?.id })
    }
  })

  const { data } = trpc.profile.findUser.useQuery(
    { clerk_id: user?.id ?? '' },
    { enabled: !!user?.id }
  )

  const navLinks = [
    { label: "Puzzles", path: "/puzzles" },
    { label: "Daily Puzzle", path: "/dailypuzzle" },
    { label: "Openings", path: "/openings" },
    { label: "New Game", path: "/game" },
    { label: "Profile", path: `/profile/${user?.username}` },
  ]

  useEffect(() => {
    if (user && data === undefined) return
    if (user && data === null && createUserMutation) {
      createUserMutation.mutate({
        clerkId: user.id,
        username: user.username ?? '',
        email: user.emailAddresses?.[0]?.emailAddress,
        FullName: user.fullName ?? '',
        imageUrl: user.imageUrl,
        rating: 1200
      })
    }
  }, [user, createUserMutation, data])

  const isActive = (path: string) => pathname === path

  return (
    <nav className="z-[10000] w-full fixed flex items-center justify-between p-2 bg-black text-white shadow-sm border-b border-gray-800">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-white">
            ♟
          </div>
          <div className='px-2 text-white text-lg font-semibold'>Chzle</div>
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.slice(0, 4).map(link => (
            <Link key={link.path} href={link.path} className={`text-sm font-medium transition ${
                isActive(link.path) ? "text-blue-500 font-semibold" : "text-gray-300 hover:text-blue-400"}`}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SignedOut>
          <div className="flex items-center gap-2">
            <SignInButton>
              <button className="px-3 py-1.5 text-sm font-medium border border-blue-500 rounded hover:bg-blue-500 text-blue-500 hover:text-white transition">Sign In</button>
            </SignInButton>
            <SignUpButton>
              <button className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition">Sign Up</button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
              <Image src={user?.imageUrl || defaulticonimg} alt="Profile" width={36} height={36}
                className="rounded-full border-2 hover:ring-2 ring-blue-400 transition"/>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                <Link
                  href={`/profile/${user?.username}`}
                  className="block px-4 py-2 text-sm text-gray-800 hover:text-blue-600 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}>
                  My Profile
                </Link>
                <SignOutButton>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-gray-100">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
        </SignedIn>
        <button className="lg:hidden flex items-center p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 md:hidden bg-white shadow-md z-50 border-b">
          <div className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} onClick={() => setIsMenuOpen(false)}
              className={`text-sm font-medium px-3 py-2 rounded transition ${ isActive(link.path) ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-800 hover:text-blue-500 hover:bg-gray-50"}`}>
                {link.label}
              </Link>
            ))}

            <SignedIn>
              <SignOutButton>
                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}>
                  Sign Out
                </button>
              </SignOutButton>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  )
}
