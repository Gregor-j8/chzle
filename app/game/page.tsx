import Link from 'next/link'

export default function NewGame() {
  return (
 <div className="overflow-hidden h-screen bg-gray-900 mt-20 lg:mt-10">
      <h1 className="text-center font-bold text-2xl mb-4 text-white">New Game</h1>

      <div className="editor mx-auto w-11/12 max-w-2xl flex flex-col text-white border border-gray-700 p-6 rounded-xl shadow-lg bg-gray-800">
        <p className="text-white mb-4 text-lg">Choose your opponent:</p>

        <div className="flex gap-4 justify-center mb-6">
          <Link href="/vscomputer" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md transition">
            Computer
          </Link>
          <Link href="/vsplayer" className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded-md transition">
            Player
          </Link>
        </div>

        <div className="flex justify-end">
          <Link href="/" className="border border-gray-500 p-2 px-4 rounded-md font-semibold text-gray-300 hover:bg-gray-700">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}