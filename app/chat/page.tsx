'use client'
import { useState, useEffect } from 'react'
import { trpc } from '@/utils/trpc'
import socket from '@/utils/supabaseClient'

export default function Chat() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const { data: chatrooms } = trpc.chat.getUserChatrooms.useQuery()
  const { data: messages, refetch } = trpc.chat.getMessages.useQuery(
    { chatroomId: selectedRoom! },
    { enabled: !!selectedRoom }
  )

  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      setMessage('')
      refetch()
    },
  })

  useEffect(() => {
    socket.on('new-message', (msg) => {
      if (msg.chatroomId === selectedRoom) {
        refetch()
      }
    })
    return () => {
      socket.off('new-message')
    }
  }, [selectedRoom, refetch])

  const handleSend = () => {
    if (!message.trim() || !selectedRoom) return
    sendMessage.mutate({ text: message, chatroomId: selectedRoom })
    socket.emit('send-message', {
      chatroomId: selectedRoom,
      text: message,
    })
  }

  return (
    <div className="flex gap-4 p-4">
      <div className="w-64 border-r">
        <h2 className="text-lg font-bold mb-2">Chatrooms</h2>
        {chatrooms?.map(room => (
          <button key={room.id}className={`block w-full text-left px-2 py-1 ${selectedRoom === room.id ? 'bg-gray-200' : ''
            }`}onClick={() => setSelectedRoom(room.id)}>
              {room.name || 'Unnamed Room'}
          </button>
        ))}
      </div>
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto border p-2 rounded bg-white">
          {messages?.map(msg => (
            <div key={msg.id} className="mb-1">
              <div>{msg.sender.username}</div>: {msg.text}
            </div>
          ))}
        </div>

        <div className="flex mt-2">
          <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="border p-2 flex-1 rounded-l" placeholder="Type a message"/>
          <button onClick={handleSend} className="bg-blue-500 text-white px-4 rounded-r">Send</button>
        </div>
      </main>
    </div>
  )
}
