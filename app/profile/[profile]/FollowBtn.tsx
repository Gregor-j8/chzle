'use client'
import { UserPlus, UserCheck } from "lucide-react"
import { trpc } from "@/utils/trpc"
interface FollowBtnProps {
  userId: string
}

export default function FollowBtn({ userId }: FollowBtnProps) {
  const utils = trpc.useUtils()
  const createLike = trpc.followRouter.createLike.useMutation({
    onSuccess: () => {
        utils.followRouter.getFollowers.refetch({ followerId: userId })
        utils.followRouter.getAllFollowing.invalidate()     
        utils.followRouter.getAllFollowers.invalidate()
    },
  })

  const deleteLike = trpc.followRouter.deleteLike.useMutation({
    onSuccess: () => {
      utils.followRouter.getFollowers.refetch({ followerId: userId })
      utils.followRouter.getAllFollowing.invalidate()
      utils.followRouter.getAllFollowers.invalidate()
    },
  })

  const { data, isLoading } = trpc.followRouter.getFollowers.useQuery({ followerId: userId })
  const isFollowing = data && data.length !== 0
  const handleLike = () => {
    if (!isFollowing) {
      createLike.mutate({ followerId: userId })
    } else {
      deleteLike.mutate({ followerId: userId })
    }
  }
  return (
    <div>
      <button disabled={isLoading} onClick={handleLike}>
        {isFollowing ? <UserCheck className="w-7 h-7 text-green-600" /> : <UserPlus className="w-7 h-7 text-blue-600" />}
      </button>
    </div>
  )
}
