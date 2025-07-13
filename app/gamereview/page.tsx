'use client'
import { useState } from "react"
import GameReviewModal from "./GameList"
import GameReview from "./GameReview"

export default function GameSearch() {
  const [userName, setUserName] = useState("")
  const [submittedName, setSubmittedName] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [choosenMatch, setChoosenMatch] = useState({})

  const handleSearch = () => {
    if (!userName) return
    setSubmittedName(userName)
    setShowModal(true)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Enter your chess.com username</h1>
      <input onChange={(e) => setUserName(e.target.value)} value={userName} placeholder="e.g. goo840"
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"/>
      <button onClick={handleSearch} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
        Search
      </button>
    {choosenMatch?.moves && !showModal && (
        <GameReview choosenMatch={choosenMatch}/>
    )}
      {showModal && (
        <GameReviewModal
          username={submittedName}
          onClose={() => setShowModal(false)}
          setChoosenMatch={setChoosenMatch}
        />
      )}
    </div>
  )
}