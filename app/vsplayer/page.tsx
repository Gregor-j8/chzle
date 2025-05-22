'use client'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Lobby() {
  const router = useRouter();
  const [roomIdInput, setRoomIdInput] = useState('');

  const handleCreate = () => {
    const roomId = uuidv4()
    router.push(`/vsplayer/${roomId}`)
  };

  const handleJoin = () => {
    if (roomIdInput.trim()) {
      router.push(`/vsplayer/${roomIdInput}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">
        🎲 Create Game
      </button>
      <input
        className="border px-2 py-1 rounded"
        placeholder="Enter Room ID"
        value={roomIdInput}
        onChange={(e) => setRoomIdInput(e.target.value)}
      />
      <button onClick={handleJoin} className="bg-green-600 text-white px-4 py-2 rounded">
        🔗 Join Game
      </button>
    </div>
  );
}
