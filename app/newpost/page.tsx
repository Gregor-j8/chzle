'use client'
import { trpc } from '@/utils/trpc'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import {useState} from 'react'
import toast from 'react-hot-toast'

interface newpost {
  userid: string;
  header: string;
  description: string;
  gameId?: string;
}

export default function NewPost() {
  const { mutate } = trpc.userPostsRouter.CreatePosts.useMutation()
  const {user} = useUser()
  const [Post, setPost] = useState({title: '', description: ''})

  if (!user){
    return null
  }

  const createPost = () => {
        if (Post.description === '' || Post.title === '') {
      toast.error("You need to add a title and description", {
        position: "bottom-center",
        duration: 4000,
      })
      return 
    }
      const newpost: newpost = {
        userid: user.id,
        header: Post.title,
        description: Post.description,
        gameId: undefined
      }
      mutate(newpost)
  }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6 border border-slate-700">
            <h1 className="text-2xl font-semibold text-white text-center">Create a New Post</h1>
            <input type="text" placeholder="Title" value={Post.title} onChange={(e) => setPost({...Post, title: e.target.value})}
              className="w-full rounded-lg bg-gray-700 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500" />
            <textarea placeholder="Write your post" rows={6} value={Post.description} onChange={(e) => setPost({...Post, description: e.target.value})}
              className="w-full rounded-lg bg-gray-700 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"/>

            <select className="w-full rounded-lg bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
              defaultValue="Choose Game">
            </select>
            <div className="flex justify-between">
              <Link className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors" href={"/"}>Cancel</Link>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer" onClick={createPost}>Post</button>
            </div>
          </div>
        </div>
      )
  }