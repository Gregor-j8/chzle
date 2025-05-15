import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { clerkClient } from '@clerk/nextjs/server'

export const ProfileRouter = router({
getUserProfileByUsername: publicProcedure
  .input(z.object({ username: z.string() }))
  .query(async ({ ctx, input }) => {
    const clerk = await clerkClient()
    const users = await clerk.users.getUserList({
      username: [input.username],
    })
    const user = users.data[0]
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    const userdata = await ctx.prisma.user.findFirst({
      where: { clerk_id: user.id },
    })

    return {
      id: user.id,
      username: user.username,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      rating: userdata?.rating,
    };
  }),

getUserPuzzles: protectedProcedure
  .input(z.object({
    userId: z.string(),
    skip: z.number().optional(),
    take: z.number().optional(),
  }))
  .query(async ({ ctx, input }) => {
    return ctx.prisma.userPuzzle.findMany({
      where: { userId: input.userId },
      orderBy: { completedDate: 'desc' },
      skip: input.skip ?? 0,
      take: input.take ?? 3,
      include: {
        puzzle: true
      }
    })
  }),

getUserGames: publicProcedure
  .input(z.object({
  userId: z.string(),
  skip: z.number().optional(),
  take: z.number().optional(),
}))
.query(({ ctx, input }) => {
  return ctx.prisma.game.findMany({
    where: {
      OR: [
        { blackid: input.userId },
        { whiteid: input.userId }
      ]
    },
    orderBy: { createdAt: 'desc' },
    skip: input.skip ?? 0,
    take: input.take ?? 3,
  })
}),

getUserPosts: publicProcedure
  .input(z.object({
  userId: z.string(),
  skip: z.number().optional(),
  take: z.number().optional(),
}))
.query(({ ctx, input }) => {
  return ctx.prisma.post.findMany({
    where: { userid: input.userId },
    orderBy: { createdat: 'desc' },
    skip: input.skip ?? 0,
    take: input.take ?? 3,
  })
})
})
