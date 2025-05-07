'use client'

import { trpc } from '@/utils/trpc'
import { useParams } from 'next/navigation'
import { LoadingSpinner } from '../_components/loading'

export default function PostPage() {
  const { id } = useParams()
  const [data] = trpc.userPostsRouter.getPostDetails.useSuspenseQuery(id.toString())
    
    if (!data) {
        return <div><LoadingSpinner/></div>
    }
  return (
    <div className="m-4 rounded-2xl border border-slate-700 bg-gray-800 p-6 shadow-md transition hover:shadow-lg">
        <h1 className="text-2xl font-bold text-white">{data.header}</h1>
        <p className="mt-4 text-base text-slate-300">{data.description}</p>
        <div className="flex justify-between mt-6 text-sm text-slate-500">
            <span className="font-medium">Posted by {data.user.username}</span>
            <span className="font-medium">Posted on {new Date(data.createdat).toLocaleDateString()}</span>
        </div>
    </div>  
)
}
