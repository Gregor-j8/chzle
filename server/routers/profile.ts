import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { clerkClient } from '@clerk/nextjs/server'

export const ProfileRouter = router({
  getUserByUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const clerk = await clerkClient();
      const users = await clerk.users.getUserList({
        username: [input.username],
      }) 
      const user = users.data[0];
      const userdata = await ctx.prisma.user.findFirst({
        where: { clerk_id: user.id },
      })
     const userPuzzles = await ctx.prisma.userPuzzle.findMany({
      where: {userId: user.id}
     })
     const userGame = await ctx.prisma.game.findMany({
      where: {
        OR: [
          { whiteid: user.id },
          { blackid: user.id },
        ],
      }
     })
     const userPosts = await ctx.prisma.post.findMany({
      where: {userid: user.id}
     })
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      return {
        id: user.id,
        username: user.username,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        rating: userdata?.rating,
        posts: userPosts,
        userPuzzles: userPuzzles,
        games: userGame
      }
    }),
})
