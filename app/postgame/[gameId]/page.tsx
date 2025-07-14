'use client'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/clerk-react'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/utils/supabaseClient'
import toast from 'react-hot-toast'
import { trpc } from '@/utils/trpc'
import { Chessboard } from 'react-chessboard'

export default function PostGame() {
  const roomId = useParams()
  console.log(roomId)
  const router = useRouter()
  const { user } = useUser()
  const { data: game, isLoading: gameLoading } = trpc.game.findGameDetails.useQuery(
    { id: roomId.gameId?.toString() as string },
    { enabled: !!roomId })

  const handleRematch = async () => {
    if (!user || !game) return
    const newRoomId = uuidv4()
    const { error } = await supabase.from('games').insert({
      id: newRoomId,
      white_player: game.blackPlayer.id,
      black_player: game.whitePlayer.id,
    })
    if (error) {
      toast.error("Failed to create rematch.")
      return
    }
    router.push(`/vsplayer/${newRoomId}`)
  }

  if (gameLoading || !game) return <div className="text-white text-center mt-10">Loading game results...</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 space-y-8">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full space-y-4 text-center">
        <h2 className="text-xl font-bold">Game Over</h2>
        <p className="text-sm">
          {game.whitePlayer.username} (White) vs {game.blackPlayer.username} (Black)
        </p>
        <p className="text-lg font-semibold">{game.result === 'tie' ? "It's a draw!" : `Winner: ${game?.result === '1-0' ? game?.whitePlayer.username : game?.blackPlayer.username}`}</p>
        <button onClick={handleRematch} className="mt-4 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold">
          🔁 Rematch
        </button>
        <button onClick={() => router.push('/')} className="mt-2 text-sm text-gray-400 hover:text-white">🔙 Back to Lobby</button>
        <h3 className="text-lg font-semibold mb-2">Game Review</h3>
        <button className='inline-block p-2 rounded-lg border-transparent bg-gray-800 transform transition  
            cursor-pointer hover:scale-105 hover:shadow-lg'
            onClick={() => {router.push(`/gamereview/${game.id}`)}}>
            <Chessboard
            position={game.fen}
            boardWidth={320}
            customBoardStyle={{
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgb(0 0 0 / 0.5)',
            }}
            arePiecesDraggable={false}/>
        </button>
      </div>
    </div>
  )
}