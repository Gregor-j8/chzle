'use client'
import { LoadingPage } from '@/app/_components/loading'
import ReplayModal from '@/app/_components/replayModal'
import { trpc } from '@/utils/trpc'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Chessboard } from 'react-chessboard'

export default function ProfilePage() {
  const [puzzle, setPuzzle] = useState(null)
  const [puzzleModal, setPuzzleModal] = useState(false)
    const { profile } = useParams() 
    const { data, isLoading } = trpc.profile.getUserByUsername.useQuery({username: profile?.toString() || ''})
if (!isLoading && !data) {
  return (<div><LoadingPage/></div>)
}
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">{data?.username}</h1>
      <p className="text-lg">Rating: {data?.rating}</p>
      <div className="flex flex-wrap gap-4">
  {data?.userPuzzles.map((p) => (
    <div
      key={p.id}
      onClick={() => {
        setPuzzle(p);
        setPuzzleModal(true);
      }}
      className="bg-white shadow-lg rounded-xl p-2 cursor-pointer transition-transform hover:scale-105"
    >
      <Chessboard position={p.fen} boardWidth={200} className="cursor-pointer" />
    </div>
  ))}
</div>
      <div>
        {data?.posts.map(post => {
          return (
            <Link href={`/${post.id}`} key={post.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
              {post.header}
            </Link>
          )})}
      </div>
      {puzzleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg">
            <ReplayModal puzzle={puzzle}/>
            <button onClick={() => setPuzzleModal(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
