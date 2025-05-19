'use client'
import { useState } from "react"
import { trpc } from "@/utils/trpc"
import { LoadingPage } from "./loading"
import { useUser } from "@clerk/clerk-react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
interface FollowerProps {
  userId: string
}

export default function Follower({ userId }: FollowerProps) {
    const {user} = useUser()
const { data, isLoading } = trpc.followRouter.getAllFollowers.useQuery(
  { followerId: userId },
  {enabled: !!userId })
  const [modal, setModal] = useState(false)
  return (
    <div>
      <button onClick={() => setModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded">Follower {!data ? 0 : data?.length}</button>
        {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-h-[80vh] w-[90%] max-w-md overflow-y-auto shadow-lg relative">
            <button onClick={() => setModal(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg">
            </button>
            <div className="flex justify-between mb-4">
                <h2 className="text-black text-xl font-semibold">Followers</h2>
                <button className="text-black" onClick={() => setModal(false)}><X/></button>                
            </div>
            {isLoading ? (
              <LoadingPage />
            ) : (
              <div className="space-y-2">
                {data?.map((follower) => (
                    <div key={follower.id} className="flex pl-5 border rounded">
                        <Image src={user?.imageUrl} alt={`${follower.follower.username}'s profile`}
                        width={32} height={32} className="w-8 h-8 rounded-full object-cover"/>
                        <span className="text-black pl-4">
                            <Link href={`/profile/${follower.follower.username}`}>{follower.follower.username}</Link>
                        </span>
                    </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}