'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFoundRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/')
    }, 3000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">You’ll be redirected to the homepage shortly...</p>
      <p className="text-sm text-gray-400">If not, <span className="underline cursor-pointer" onClick={() => router.replace('/')}>click here</span>.</p>
    </div>
  )
}