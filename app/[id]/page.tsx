'use client'
import { HandThumbUpIcon, HandThumbUpIcon as HandThumbUpOutlineIcon } from '@heroicons/react/24/outline'
import { MessageCircle, Trash2, Pencil } from "lucide-react"
import { trpc } from '@/utils/trpc'
import { useParams, useRouter } from 'next/navigation'
import { LoadingSpinner } from '../_components/loading'
import { useState } from "react"
import { useUser } from "@clerk/clerk-react"
import toast from "react-hot-toast"
import Link from "next/link"

export default function PostPage() {
const utils = trpc.useUtils()
  const mutation = trpc.userPostsRouter.CreateComments.useMutation()
  const deleteMutation = trpc.userPostsRouter.deleteComment.useMutation()
  const updateMutation = trpc.userPostsRouter.UpdateComment.useMutation()
  const createLike = trpc.userPostsRouter.CreateLikes.useMutation()
  const DeleteLike = trpc.userPostsRouter.DeleteLike.useMutation()
  const DeletePost = trpc.userPostsRouter.deletePost.useMutation()
  const {user} = useUser()
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [showEditBox, setShowEditBox] = useState(false)
  const [editComment, setEditComment] = useState({description: '', id: ''})
  const [comment, setComment] = useState("")
  const { id } = useParams()
  const router = useRouter()

  if (id === undefined) return null
  const [data] = trpc.userPostsRouter.getPostDetails.useSuspenseQuery(id.toString())

  if (!data) {
    return <div><LoadingSpinner/></div>
  }

const handleCommentSubmit = () => {
  if (!user) return
  mutation.mutate(
    {
      userid: user.id,
      postId: data.id,
      createdAt: new Date(),
      description: comment,
    },
    {
      onSuccess: async() => {
        toast.success("Comment added!")
        setComment("")
        setShowCommentBox(false)
        await utils.userPostsRouter.getPostDetails.refetch(id.toString())
      }})}

  const handleDeleteComment = (commentId: string) => {
    deleteMutation.mutate(commentId,
      {onSuccess: async() => {
        await utils.userPostsRouter.getPostDetails.refetch(id.toString())
      }})}
  const handleUpdateComment = () => {
    updateMutation.mutate(
      {
        ...editComment,
        id: editComment.id,
        createdAt: new Date(),
        postId: data.id,
        userid: user?.id || "",
      },
      {onSuccess: async() => {
        await utils.userPostsRouter.getPostDetails.refetch(id.toString())
        setComment("")
        setShowEditBox(false)
      }})}

  const handleLike = (postId: string) => {
    if (!user) return
    const existingLike = data.likes.find(like => like.userid === user.id)
    if (existingLike) {
      DeleteLike.mutate(existingLike.id, {
        onSuccess: async () => {
          await utils.userPostsRouter.getPostDetails.refetch(postId)
        }})} else {
      createLike.mutate(
        {
          userid: user.id,
          postId: postId
        },
        {
          onSuccess: async () => {
            await utils.userPostsRouter.getPostDetails.refetch(postId)
        }})}}

        const handleDelete = (id: string) => {
          
          DeletePost.mutate({id}) 
            router.push("/")
          }

  return (
<div className="m-4 w-[60%] mx-auto flex flex-col  rounded-2xl border border-slate-700 bg-gray-800 p-6 shadow-md">
  <h1 className="text-2xl font-bold text-white">{data.header}</h1>
  <p className="mt-4 text-base text-slate-300">{data.description}</p>
  <div className="flex justify-between items-center mt-6 text-sm text-slate-500">
    <div className="flex items-center space-x-4">
      <button onClick={() => handleLike(data.id)} className="flex items-center space-x-1 hover:text-white transition">
        {data.likes.find(like => like.userid === user?.id)
        ? <HandThumbUpIcon className="h-5 w-5 text-blue-500" />
        : <HandThumbUpOutlineIcon className="h-5 w-5" />}
      <span>{data.likes.length}</span>
    </button>
      <button onClick={() => setShowCommentBox(prev => !prev)} className="flex items-center space-x-1 hover:text-white transition">
        <MessageCircle size={16}/>
      </button>
    </div>
    <span className="font-medium cursor-pointer"><Link href={`/profile/${data.user.username}`}>Posted by {data.user.username}</Link></span>
    <span className="font-medium">Posted on {new Date(data.createdat).toLocaleDateString()}</span>
        {data.userid == user?.id && (
          <div>
            <button className='text-red' onClick={() => {handleDelete(data.id)}}><Trash2 size={24} /></button>
            <button className='text-red'><Pencil size={24} /></button>            
          </div>
        )} 
  </div>
  <div className="mt-6 space-y-4">
    {data.comments.map(comment => (
      <div key={comment.id} className="rounded-lg bg-slate-700 p-4 text-slate-100 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
          <span className="font-semibold">{comment.user.username}</span>
          <span className="text-xs">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>        
        </div>
        <p className="text-slate-200 text-sm mb-2">{comment.description}</p>

        <div className="flex space-x-4 text-slate-400 text-sm">
          <button onClick={() => {setEditComment(comment); setShowEditBox(prev => !prev)}} className="flex items-center space-x-1 hover:text-white transition">
            <Pencil size={16} />
            <span>Edit</span>
          </button>
          <button onClick={() => handleDeleteComment(comment.id)} className="flex items-center space-x-1 hover:text-red-400 transition">
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    ))}
  </div>
          {showCommentBox && editComment && !showEditBox &&(
          <div className="mt-4">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3}
              className="w-full p-2 rounded bg-slate-700 text-white"
              placeholder="Write your comment..."/>
            <button onClick={handleCommentSubmit}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">Post Comment
            </button>
          </div>
        )}
          {showEditBox && editComment && !showCommentBox && (
          <div className="mt-4">
            <textarea value={editComment.description} onChange={(e) => setEditComment({ ...editComment, description: e.target.value })} rows={3}
              className="w-full p-2 rounded bg-slate-700 text-white"/>
            <button onClick={handleUpdateComment}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">Update Comment
            </button>
          </div>
        )}
      </div>
  )
}