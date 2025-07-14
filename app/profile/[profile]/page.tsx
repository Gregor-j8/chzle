'use client'
import { trpc } from '@/utils/trpc'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { LoadingPage } from '@/app/_components/loading'
import PostSlideshow from './Posts'
import PuzzleSlideshow from './Puzzle'
import GameSlideshow from './Game'
import ReplayModal from '@/app/_components/replayModal'
import Link from 'next/link'
import FollowBtn from './FollowBtn'
import Follower from '@/app/_components/Followers'
import Following from '@/app/_components/Following'
import ChessAccount from './ChessAccount'
import ChessLoginPage from './ChessLogin'
import ChessAccountPage from './ChessAccount'

export default function ProfilePage() {
  const { profile } = useParams();
  const [Modal, setModal] = useState(false)
  const [modalId, setModalId] = useState({})
  const [ChessLogin, setChessLogin] = useState(false)
  const [ChessAccount, setChessAccount] = useState(false)

  const { data: user, isLoading } = trpc.profile.getUserProfileByUsername.useQuery({
    username: profile?.toString() || '',
  })

  if (isLoading) return <LoadingPage />
  if (!user) return <div>User not found</div>

  return (
    <div className="bg-gray-900 min-h-screen text-white overflow-y-auto">
  <main className="flex flex-col items-center py-2 px-4">
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md text-center mb-4">
      <h1 className="text-3xl font-bold">{user.username}</h1>
      <p className="text-lg text-gray-400">Rating: {user.rating}</p>
      {user.ChessUsername ? (
        <button onClick={() => {setChessAccount(true)}}>{user.ChessUsername}</button>
      ) : (
        <button onClick={() => {setChessLogin(true)}}>Connect To Chess.com</button>
      )}
      <div className='flex justify-around'>
        <Follower userId={user.id}/>
        <FollowBtn userId={user.id}/>
        <Following userId={user.id}/>
      </div> 
      <Link href="/" className="text-blue-400 hover:underline">Back to Home</Link>
    </div>
     
    <PostSlideshow userId={user.id} />
    <PuzzleSlideshow userId={user.id} onSelect={p => {
      setModalId(p)
      setModal(true)
    }} />
    <GameSlideshow userId={user.id} onSelect={g => {
      setModalId(g)
      setModal(true)
    }} />
     
    {Modal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
          <ReplayModal puzzle={modalId} />
          <button onClick={() => setModal(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Close</button>
        </div>
      </div>
    )}
  </main>
    {ChessLogin && (
      <ChessLoginPage onClose={() => setChessLogin(false)} user={user} />
    )}

  {ChessAccount && (
    <ChessAccountPage onClose={() => setChessAccount(false)} user={user} />
  )}
  </div>
  )
}
