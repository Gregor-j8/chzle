import { trpc } from "@/utils/trpc"
import { LoadingPage } from "./loading"
import { useEffect, useMemo, useState } from "react"
import debounce from "lodash.debounce"

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
    <div className="h-full overflow-y-auto p-4 hide-scrollbar">
      {postsToDisplay.map(post => (
        <div key={post.id} 
            className="m-4 rounded-2xl border border-slate-700 bg-gray-800 p-4 shadow-md transition hover:shadow-lg">
            <h2 className="text-xl font-semibold text-white">{post.header}</h2>
            <p className="mt-2 text-sm text-slate-300">{post.description}</p>
            <div className="flex justify-between mt-4 text-xs text-slate-500">
                <span className="font-medium">Posted by {post?.user.username}</span>
                <span className="font-medium">Posted on {post.createdat.toLocaleDateString()}</span>
            </div>
        </div>
      ))}
    </div>
  )
}
