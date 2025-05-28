import { trpc } from "@/utils/trpc"
import { LoadingPage } from "./loading"
import { useEffect, useMemo, useState } from "react"
import debounce from "lodash.debounce"
import Link from "next/link"

export default function Posts({ searchText }: { searchText: string }) {
  const { data, isLoading } = trpc.userPostsRouter.GetAllPosts.useQuery()
  const { data: filteredData, isLoading: isFilteredLoading } = trpc.userPostsRouter.filterPosts.useQuery(searchText, {
    enabled: searchText.trim() !== "", 
  })
  const [queryText, setQueryText] = useState(searchText)

  const debouncedUpdate = useMemo(() => {
    return debounce((value: string) => {
      setQueryText(value)
    }, 800)
  }, [])

  useEffect(() => {
    debouncedUpdate(searchText)
    return () => {
      debouncedUpdate.cancel()
    };
  }, [searchText, debouncedUpdate])

  if (isLoading || isFilteredLoading) {
    return <div><LoadingPage /></div>
  }

  if (!data || (!filteredData && queryText.trim() !== '')) {
    return <div>No Posts Found</div>
  }

  const postsToDisplay = queryText.trim() !== '' ? filteredData : data
  if (!postsToDisplay) return <div>No Posts Found</div>

  return (
   <div className="h-full overflow-y-auto p-4 scrollbar-none">
  {postsToDisplay.map((post) => (
    <div key={post.id}
      className="mb-6 rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-md transition-all duration-300 hover:shadow-lg hover:border-slate-500">
      <Link href={`/${post.id}`} className="text-xl sm:text-2xl font-semibold text-white hover:underline">{post.header}</Link>
      <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">{post.description}</p>
      <div className="mt-4 flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-slate-400">
        <Link href={`/profile/${post.user.username}`} className="font-medium hover:text-white">Posted by {post.user.username}</Link>
        <span className="mt-1 sm:mt-0 font-medium">
          {new Date(post.createdat).toLocaleDateString()}
        </span>
      </div>
    </div>
  ))}
</div>
  )
}
