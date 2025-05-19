'use client'
import { trpc } from "@/utils/trpc"
interface FollowBtnProps {
  userId: string
}

export default function FollowBtn({ userId }: FollowBtnProps) {
  const utils = trpc.useUtils()
  const createLike = trpc.followRouter.createLike.useMutation({
    onSuccess: () => {
      utils.followRouter.getFollowers.refetch({ followerId: userId })
    },
  })

  const deleteLike = trpc.followRouter.deleteLike.useMutation({
    onSuccess: () => {
      utils.followRouter.getFollowers.refetch({ followerId: userId })
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
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  )
}
