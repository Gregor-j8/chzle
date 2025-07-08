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
    if (!roomId) return toast.error("invalid game code", {duration: 3000, position: "top-center", style: { marginTop: "50px" }})

    const { data: game } = await supabase
      .from('games')
      .select('*')
      .eq('id', roomId)
      .single()
    
    if (game.white_player && game.black_player
      && user.id !== game.white_player
      && user.id !== game.black_player) {
      toast.error('Game is full.', {duration: 3000, position: "top-center", style: { marginTop: "50px" }})
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
    <div className="overflow-hidden min-h-screen bg-gray-900 px-4 py-10">
      <h1 className="text-center text-2xl font-bold text-white mb-6">Multiplayer Game</h1>
      <div className="mx-auto w-11/12 lg:w-4/12 max-w-2xl flex flex-col text-white border border-gray-700 p-6 rounded-xl bg-gray-800 gap-6">
        <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-md font-semibold cursor-pointer">
          Create Game
        </button>
        <input type="text" placeholder="Enter Room ID" value={roomIdInput} onChange={(e) => setRoomIdInput(e.target.value)}
          className="border border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-md cursor-pointer focus:ring-blue-500"/>
        <button onClick={handleJoin} 
        className="border bg-gray-800 border-gray-500 p-2 px-4 rounded-md text-gray-300 hover:bg-gray-700-md font-semibold cursor-pointer">
          Join Game
        </button>
      </div>
    </div>
  )
}
