'use client'
import { useRouter } from 'next/navigation'
import { trpc } from '@/utils/trpc'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import {useState} from 'react'
import toast from 'react-hot-toast'

interface newpost {
  userid: string
  header: string
  description: string
  gameId?: string
}

export default function NewPost() {
  const { mutate } = trpc.userPostsRouter.CreatePosts.useMutation()
  const {user} = useUser()
  const [Post, setPost] = useState({title: '', description: '', game: ''})
  const router = useRouter()

  if (!user){
    return null
  }

  const createPost = () => {
      if (Post.description === '' || Post.title === '') {
      toast.error("You need to add a title and description", {
        position: "top-center",
        duration: 4000,
        style: {marginTop: "50px"}
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
      router.push('/')

  }

    return (
      <div className="overflow-hidden h-screen bg-gray-900 mt-3">
        <h1 className="text-center font-bold text-2xl mb-4 text-white">New Post</h1>
        <div className="editor mx-auto w-11/12 max-w-2xl flex flex-col text-white border border-gray-700 p-6 rounded-xl shadow-lg bg-gray-800">
          <input value={Post.title} placeholder="Title" onChange={(e) => setPost({ ...Post, title: e.target.value })}
          className=" bg-gray-700 border border-gray-600 p-3 mb-4 rounded-md outline-none placeholder-gray-400"
          />
          <textarea className="description bg-gray-700 p-3 h-48 border border-gray-600 rounded-md outline-none resize-none placeholder-gray-400 mb-4"
          placeholder="Describe your post here" value={Post.description} onChange={(e) => setPost({ ...Post, description: e.target.value })}
          />
          <div className="flex justify-end">
            <Link href="/" className="border border-gray-500 p-2 px-4 rounded-md font-semibold text-gray-300 hover:bg-gray-700">
              Cancel
            </Link>
            <button onClick={createPost} className="ml-2 bg-indigo-600 hover:bg-indigo-700 p-2 px-4 rounded-md font-semibold text-white">
              Post
            </button>
          </div>
        </div>
      </div>
      )
  }