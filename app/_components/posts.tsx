import { trpc } from "@/utils/trpc"
import { LoadingPage } from "./loading"
import { useEffect, useMemo, useRef, useState } from "react"
import debounce from "lodash.debounce"
import Link from "next/link"

export default function Posts({ searchText }: { searchText: string }) {
  const [, setQueryText] = useState(searchText)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, } = trpc.userPostsRouter.GetAllPosts.useInfiniteQuery(
    { limit: 20 },{getNextPageParam: lastPage => lastPage.nextCursor,})
  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = observerRef.current
    if (!el || !hasNextPage) return

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }},{ rootMargin: "200px",}
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const debouncedUpdate = useMemo(() => {
    return debounce((value: string) => {
      setQueryText(value)
    }, 800)
  }, [])

  useEffect(() => {
    debouncedUpdate(searchText)
    return () => debouncedUpdate.cancel()
  }, [searchText, debouncedUpdate])

  const posts = data?.pages.flatMap((page) => page.posts) ?? []

  if (isLoading) return <LoadingPage />
  if (posts.length === 0) return <div>No Posts Found</div>
  return (
    <div className="h-full overflow-y-auto p-4 scrollbar-none">
      {posts.map(post => (
        <div key={post.id}
          className="mb-6 rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-md transition-all duration-300 hover:shadow-lg hover:border-slate-500">
          <Link href={`/${post.id}`} className="text-xl sm:text-2xl font-semibold text-white hover:underline">
            {post.header}
          </Link>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">{post.description}</p>
          <div className="mt-4 flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-slate-400">
            <Link href={`/profile/${post.user.username}`} className="font-medium hover:text-white">
              Posted by {post.user.username}
            </Link>
            <span className="mt-1 sm:mt-0 font-medium">
              {new Date(post.createdat).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
      <div ref={observerRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="text-center text-sm text-slate-400 mt-4">Loading more...</div>
      )}
    </div>
  )
}
