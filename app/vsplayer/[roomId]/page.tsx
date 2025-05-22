import { v4 as uuidv4 } from 'uuid'
import ChessGame from './chessBoard'

export default function Home() {
  const roomId = uuidv4()
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[500px] h-[500px]">
        <ChessGame roomId={roomId} />
      </div>
    </div>
  )
}