'use client'
import { supabase } from '@/utils/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'

export default function Lobby() {
  const {user} = useUser()
  const router = useRouter()
  const [roomIdInput, setRoomIdInput] = useState('')

  const handleCreate = async() => {
    if (!user) return router.push(`/`)
    const roomId = uuidv4()
    router.push(`/vsplayer/${roomId}`)
    const {} = await supabase
    .from('games')
    .insert({ id: roomId, white_player: user.id})
  }

  const handleJoin = async() => {
    if (!user) return router.push(`/`)
    if (roomIdInput.trim()) {
      router.push(`/vsplayer/${roomIdInput}`)
      const {} = await supabase
      .from('games')
    .update({ black_player: user.id})
    .eq('id', roomIdInput.trim())
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">
        🎲 Create Game
      </button>
      <input className="border px-2 py-1 rounded" placeholder="Enter Room ID" value={roomIdInput} onChange={(e) => setRoomIdInput(e.target.value)}/>
      <button onClick={handleJoin} className="bg-green-600 text-white px-4 py-2 rounded">
        🔗 Join Game
      </button>
    </div>
  )
}
