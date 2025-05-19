'use client'
import { useState } from 'react'
import Link from 'next/link'
import { trpc } from '@/utils/trpc'

export default function PostSlideshow({ userId }: { userId: string }) {
  const [page, setPage] = useState(0)
  const take = 3
  const skip = page * take

  const { data: posts = [], isLoading } = trpc.profile.getUserPosts.useQuery({
    userId,
    skip,
    take,
  })
  const handleNext = () => {
    if (posts.length === take) setPage((prev) => prev + 1)
  }
  const handlePrev = () => {
    if (page > 0) setPage((prev) => prev - 1)
  }

  if (isLoading) {
    return <div className="w-full max-w-4xl mb-6 text-white text-center">Loading posts...</div>
  }

  if (posts.length === 0 && page === 0) {
    return (
      <div className="w-full max-w-4xl mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 text-center">Posts</h2>
        <h2 className="text-xl font-semibold text-white mb-4 text-center">You haven’t posted yet!</h2>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mb-6">
      <h2 className="text-xl font-semibold text-white mb-4 text-center">Posts</h2>
      <div className="relative bg-gray-800 rounded-lg p-4 shadow-lg">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl px-3 py-1 rounded-full ${
            page === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-700'
          }`}
        >
          ←
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center text-amber-50">
          {posts.map((p) => (
            <div key={p.id} className="cursor-pointer transition-transform hover:scale-105">
              <Link href={`/${p.id}`}>{p.header}</Link>
            </div>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={posts.length < take}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl px-3 py-1 rounded-full ${
            posts.length < take ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-700'
          }`}
        >
          →
        </button>
      </div>
    </div>
  )
}
