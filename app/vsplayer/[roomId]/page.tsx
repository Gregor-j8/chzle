'use client'
import { useParams } from 'next/navigation'
import ChessGame from './chessBoard'

export default function Home() {
  const params = useParams()
  const roomId = params?.roomId

  if (!roomId) return <div>Invalid Room</div>
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[500px] h-[500px]">
        <ChessGame roomId={roomId.toString()} />
      </div>
    </div>
  )
}