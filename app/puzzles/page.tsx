"use client"
import { Suspense } from 'react'
const dynamicSetting = 'force-dynamic'

export default function PuzzlesPage() {
  return (
    <div>
    <Suspense fallback={<div className="text-white">Loading puzzles...</div>}>
        <ClientPuzzles />
    </Suspense>
    </div>
  )
}

import dynamic from 'next/dynamic'

const ClientPuzzles = dynamic(
  () => import('@/app/puzzles/ClientPuzzles'),
  {
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-screen text-white">Loading puzzles...</div>
  }
)