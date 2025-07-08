'use client'
import { useParams } from 'next/navigation'
import ChessGame from './chessBoard'

export default function Home() {
  const params = useParams()
  const roomId = params?.roomId

  if (!roomId) return <div>Invalid Room</div>
  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4 py-10">
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-4">
        <ChessGame roomId={roomId.toString()} />
      </div>
    </div>
  )
}