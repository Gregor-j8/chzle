'use client'
import Posts from "./_components/posts"
import Link from "next/link"
import { useState } from "react"

function HomePage() {
  const [searchText, setSearchText] = useState('')

  return (
    <div className="h-screen overflow-hidden hide-scrollbar"> 
      <main className="overflow-none flex h-screen justify-center bg-gray-900">
        <div className="flex h-full w-full flex-col border-x border-slate-400 md:max-w-2xl mb-2">
        <div className="text-slate-500 flex items-center justify-center gap-2 p-4 border-b border-slate-700">
            <input placeholder="Search Chess Openings"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 rounded-lg bg-gray-800 text-white placeholder-slate-400 px-4 py-2  focus:ring-slate-500"/>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"><Link href="newpost">New Post</Link></button>
          </div>
            <Posts searchText={searchText}/>
        </div>
    </main>
    </div>
  );
}

export default HomePage
