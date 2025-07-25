'use client'
import { useParams, useRouter } from 'next/navigation'
import { trpc } from '@/utils/trpc'
import { Chessboard } from 'react-chessboard'

export default function VsComputerPostGame() {
  const router = useRouter()
  const params = useParams()
  const {CGameId} = params
  const gameId = typeof CGameId === 'string' ? CGameId : ''
  if (!gameId) return null
  const { data: game, isLoading: gameLoading } = trpc.game.findGameDetails.useQuery({ id: gameId }, { enabled: !!gameId })
  if (!game && gameLoading) return <div className="text-white text-center mt-10">Loading game results...</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 space-y-8">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full space-y-4 text-center">
        <h2 className="text-xl font-bold">Game Over</h2>
        <p className="text-sm">
          {game?.whitePlayer.username} (White) vs {game?.blackPlayer.username} (Black)
        </p>
        <p className="text-lg font-semibold">{game?.result === 'tie' ? "It's a draw!" : `Winner: ${game?.result === '1-0' ? game?.whitePlayer.username : game?.blackPlayer.username}`}</p>
        <button onClick={() => router.push('/')} className="mt-2 text-sm text-gray-400 hover:text-white">Back to Lobby</button>
        <h3 className="text-lg font-semibold mb-2">Game Review</h3>
        <button className='inline-block p-2 rounded-lg border-transparent bg-gray-800 transform cursor-pointer hover:scale-105 hover:shadow-lg'
          onClick={() => router.push(`/gamereview/${gameId}`)}>
          <Chessboard
            position={game?.fen}
            boardWidth={320}
            arePiecesDraggable={false}
          />
        </button>
      </div>
    </div>
  )
}
