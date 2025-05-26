'use client'
import { supabase } from '@/utils/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

export default function Lobby() {
  const { user } = useUser()
  const router = useRouter()
  const [roomIdInput, setRoomIdInput] = useState('')

  const handleCreate = async () => {
    if (!user) return router.push('/')
    const roomId = uuidv4()
    await supabase
      .from('games')
      .insert({ id: roomId, white_player: user.id, black_player: null })
    router.push(`/vsplayer/${roomId}`)
  }

  const handleJoin = async () => {
    if (!user) return router.push('/')

    const roomId = roomIdInput.trim()
    if (!roomId) return

    const { data: game } = await supabase
      .from('games')
      .select('*')
      .eq('id', roomId)
      .single()
    
    if (game.white_player && game.black_player && user.id !== game.white_player && user.id !== game.black_player) {
      toast.error('Game is full.')
      return
    }

    if (!game.black_player && user.id !== game.white_player) {
      await supabase
        .from('games')
        .update({ black_player: user.id })
        .eq('id', roomId)
    }
    router.push(`/vsplayer/${roomId}`)
  }

  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
  <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-6">
    <button onClick={handleCreate}
      className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-semibold">
      🎲 Create Game
    </button>
    <input type="text"
      className="border border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter Room ID" value={roomIdInput} onChange={(e) => setRoomIdInput(e.target.value)}/>
    <button onClick={handleJoin} className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-lg font-semibold">
      🔗 Join Game
    </button>
  </div>
</div>
  )
}
