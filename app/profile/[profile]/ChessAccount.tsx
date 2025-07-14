'use client'
import { LoadingPage } from '@/app/_components/loading'
import { trpc } from '@/utils/trpc'

export default function ChessAccountPage({ onClose, user }) {
  const { data, isLoading } = trpc.profile.getUserFromChess.useQuery()

  const RatingSection = ({ title, stats }) => (
    <div className="bg-gray-700 p-4 rounded shadow">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p>Rating: {stats?.last?.rating ?? 'N/A'}</p>
      {stats?.record && (
        <p>
          W/L/D: {stats.record.win} / {stats.record.loss}{' '}
          {stats.record.draw !== undefined ? `/ ${stats.record.draw}` : ''}
        </p>
      )}
    </div>
  )

  if (isLoading) return <LoadingPage/>

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg w-11/12 max-w-md p-6 relative text-white space-y-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center">{user?.ChessUsername} Chess.com Stats</h2>
        {!isLoading && data && (
          <>
            <RatingSection title="Blitz" stats={data.chess_blitz} />
            <RatingSection title="Rapid" stats={data.chess_rapid} />
            <RatingSection title="Bullet" stats={data.chess_bullet} />
            <RatingSection title="Daily" stats={data.chess_daily} />
          </>
        )}

        <div className="flex justify-end pt-4">
          <button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
