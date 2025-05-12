'use client'
import { LoadingPage } from '@/app/_components/loading'
import ReplayModal from '@/app/_components/replayModal'
import { trpc } from '@/utils/trpc'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import PuzzleSlideshow from './Puzzle'
import GameSlideshow from './Game'
import PostSlideshow from './Posts'

export default function ProfilePage() {
  const [puzzle, setPuzzle] = useState<any[]>([])
  const [game, setGame] = useState<any[]>([])
  const [Modal, setModal] = useState(false)
  const [modalId, setModalId] = useState({})
  const { profile } = useParams();
  const { data, isLoading } = trpc.profile.getUserByUsername.useQuery({
    username: profile?.toString() || '',
  })
  useEffect(() => {
    if (data) {
      setPuzzle(data.userPuzzles)
      setGame(data.games)
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <LoadingPage />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">User not found</p>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-900">
      <main className="flex flex-col items-center justify-center h-full py-10 px-4">
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{data.username}</h1>
          <p className="text-lg text-gray-400 mb-4">Rating: {data.rating}</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Back to Home</Link>
        </div>
        <PostSlideshow posts={data.posts}/>
        <PuzzleSlideshow puzzles={puzzle} 
         onSelect={(p) => {
          setModalId(p)
          setModal(true)
        }} />
        <GameSlideshow games={game}
            onSelect={(p) => {
            setModalId(p)
            setModal(true)
        }}/>
        {Modal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <ReplayModal puzzle={modalId} />
              <button onClick={() => setModal(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}