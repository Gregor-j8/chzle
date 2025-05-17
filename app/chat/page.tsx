"use client"
import { useEffect, useState } from "react"
import socket from "@/utils/socket"
import { trpc } from "@/utils/trpc"

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<string[]>([])
  const { data: initialMessages } = trpc.chat.getMessages.useQuery()

  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess: (msg) => {
      socket.emit("send-message", msg)
      setInput("")
    },
  })

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages.map((m) => m.text))
    }
  }, [initialMessages])

  useEffect(() => {
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg.text])
    });

    return () => {
      socket.off("receive-message")
    }
  }, [])

  useEffect(() => {
    fetch("/api/socket")
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-gray-100 p-2 rounded">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => sendMessage.mutate({ text: input })}
        >
          Send
        </button>
      </div>
    </div>
  );
}
