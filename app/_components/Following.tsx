'use client'
import { useState } from "react"
import { trpc } from "@/utils/trpc"
import { LoadingPage } from "./loading"
import { useUser } from "@clerk/clerk-react"
import Link from "next/link"
import Image from "next/image"
import { X } from "lucide-react"
interface FollowerProps {
  userId: string
}

export default function Follower({ userId }: FollowerProps) {
const {user} = useUser()
  const { data, isLoading } = trpc.followRouter.getAllFollowing.useQuery(
    { followingId: userId },
    { enabled: !!userId }
  )

  const [modal, setModal] = useState(false)
  return (
   <div>
  <button onClick={() => setModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm sm:text-base">
    Following {!data ? 0 : data?.length}
  </button>

  {modal && (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto relative">
        <button onClick={() => setModal(false)}className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl">
          <X />
        </button>

        <div className="px-5 pt-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center sm:text-left">
            Following
          </h2>

          {isLoading ? (
            <LoadingPage />
          ) : (
            <div className="space-y-3">
              {data?.map(follower => (
                <div key={follower.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-100 transition">
                  <Image src={user?.imageUrl || "/default-profile.png"} alt={`${follower.follower.username}'s profile`}
                     width={40}height={40} className="w-10 h-10 rounded-full object-cover"/>
                  <Link href={`/profile/${follower.follower.username}`}className="text-sm font-medium text-gray-800 hover:underline">
                    {follower.follower.username}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )}
</div>

  )
}