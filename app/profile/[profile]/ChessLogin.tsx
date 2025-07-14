import { useEffect, useState } from 'react'
import { trpc } from '@/utils/trpc'

export default function ChessLoginModal({ user, onClose }) {
  const [chessUsername, setChessUsername] = useState('')
  const ctx = trpc.useContext()

  const mutation = trpc.profile.updateChessUsername.useMutation({onSuccess: () => {
        ctx.profile.getUserProfileByUsername.invalidate()
        onClose()
    }})

  useEffect(() => {
    if (user?.ChessUsername) {
      setChessUsername(user.ChessUsername)
    }
  }, [user?.chessUsername])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!chessUsername.trim()) return
    mutation.mutate({ ChessUsername: chessUsername.trim()})
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg w-11/12 max-w-md p-6 relative text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Link Chess.com Account</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input placeholder="Enter your Chess.com username" value={chessUsername} onChange={(e) => setChessUsername(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none"/>
            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="border border-gray-500 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-700">
                Cancel
              </button>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold">
                submit
              </button>
            </div>
          </form>
      </div>
    </div>
  )
}
