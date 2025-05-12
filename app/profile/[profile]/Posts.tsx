'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function PostSlideshow({posts}) {
    if (posts.length === 0) {
    return <div className="w-full max-w-4xl mb-6">
      <h2 className="text-xl font-semibold text-white mb-4 text-center">Posts</h2>
      <h2 className="text-xl font-semibold text-white mb-4 text-center">You havent Posted yet!</h2>
      </div>
  }

  const [index, setIndex] = useState(0)
  const puzzlesToShow = posts.slice(index, index + 3)

  const handleNext = () => {
    if (index + 3 < posts.length) {
      setIndex(index + 3)
    }
  }

  const handlePrev = () => {
    if (index - 3 >= 0) {
      setIndex(index - 3)
    }
  }

  return (
    <div className="w-full max-w-4xl mb-6">
      <h2 className="text-xl font-semibold text-white mb-4 text-center">posts</h2>
      <div className="relative bg-gray-800 rounded-lg p-4 shadow-lg">
        <button onClick={handlePrev} disabled={index === 0} className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl px-3 py-1 rounded-full 
        ${index === 0? 'text-gray-600 cursor-not-allowed': 'text-white hover:bg-gray-700'}`}>←</button>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center">
          {puzzlesToShow.map((p) => (
            <div key={p.id} className="cursor-pointer transition-transform hover:scale-105 text-amber-50">
                 <Link href={`/${p.id}`}>{p.header}</Link>
            </div>
          ))}
        </div>
        <button onClick={handleNext} disabled={index + 3 >= posts.length} 
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl px-3 py-1 rounded-full ${
            index + 3 >= posts.length ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}>→</button>
      </div>
    </div>
  )
}
