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
<div className="m-4 w-[60%] mx-auto rounded-2xl border border-slate-700 bg-gray-800 p-6 shadow-md">
  <h2 className="text-xl font-bold text-white mb-4">Edit Post</h2>
  <input type="text" value={header} onChange={(e) => setHeader(e.target.value)} placeholder="Post title"
   className="w-full mb-4 p-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"/>
  <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Post description"
    className="w-full mb-4 p-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"/>
  <div className="flex justify-end space-x-3">
    <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition">Save</button>
    <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white transition"> Cancel</button>
  </div>
</div>
  )
}
