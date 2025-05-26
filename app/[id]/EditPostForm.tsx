'use client'
import { useState } from "react"
import { trpc } from '@/utils/trpc'
import toast from "react-hot-toast"

interface EditPostFormProps {
  postId: string
  initialHeader: string
  initialDescription: string
  onSuccess: () => void
  onCancel: () => void
}

export default function EditPostForm({postId, initialHeader, initialDescription, onSuccess, onCancel}: EditPostFormProps) {
  const updatePost = trpc.userPostsRouter.UpdatePost.useMutation()
  const [header, setHeader] = useState(initialHeader)
  const [description, setDescription] = useState(initialDescription)

  const handleSubmit = () => {
    updatePost.mutate(
      {
        id: postId,
        header,
        description
      },
      {
        onSuccess: () => {
          toast.success("Post updated")
          onSuccess()
        },
        onError: () => {
          toast.error("Update failed")
        }
      }
    )
  }

  return (
<div className="w-full max-w-2xl mx-auto mt-10 px-6 py-8 rounded-2xl border border-slate-700 bg-gray-800 shadow-lg">
  <h2 className="text-2xl font-bold text-white mb-6 text-center">✏️ Edit Post</h2>
  <input type="text" value={header} onChange={(e) => setHeader(e.target.value)}  placeholder="Enter post title"
    className="w-full mb-5 px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"/>
<textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write your description..." className="w-full mb-6 px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition resize-none"/>

  <div className="flex justify-end gap-4">
    <button onClick={onCancel} className="px-5 py-2.5 rounded-lg bg-slate-600 hover:bg-slate-700 text-white transition shadow-sm">
      Cancel
    </button>
    <button onClick={handleSubmit} className="px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition shadow-md">
      Save
    </button>
  </div>
</div>
  )
}
