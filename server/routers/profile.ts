import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { ChessUsernameRateLimiter, userPostsRateLimiter, userPuzzleRateLimiter, usersGameRateLimiter } from '@/utils/RateLimiter'

export const ProfileRouter = router({
  createUser: publicProcedure
  .input(z.object({
      clerkId: z.string(),
      username: z.string(),
      email: z.string(),
      FullName: z.string(),
      imageUrl: z.string(),
      rating: z.number(),
    }))
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.user.create({
      data: {
        id: input.clerkId,
        clerk_id: input.clerkId,
        username: input.username,
        email: input.email,
        fullName: input.FullName,
        rating: input.rating,
        createdAt: new Date()
      }
    })
  }),

    findUser: protectedProcedure
    .input(z.object({ clerk_id: z.string()}))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: { clerk_id: input.clerk_id }
      })
    }),

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
      ChessUsername: userdata?.ChessUsername,
    };
  }),

getUserPuzzles: protectedProcedure
  .input(z.object({
    userId: z.string(),
    skip: z.number().optional(),
    take: z.number().optional(),
  }))
  .query(async ({ ctx, input }) => {

      const { userId } = await auth()

    if (!userId) {
      throw new Error("User not authenticated")
    }

    const { success } = await userPuzzleRateLimiter.limit(userId)

    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Please wait before getting more puzzles.",
      })
    }

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
.query(async ({ ctx, input }) => {

    const { userId } = await auth()

    if (!userId) {
      throw new Error("User not authenticated")
    }

    const { success } = await usersGameRateLimiter.limit(userId)

    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Please wait before getting more games.",
      })
    }
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
.query(async ({ ctx, input }) => {

      const { userId } = await auth()

    if (!userId) {
      throw new Error("User not authenticated")
    }

    const { success } = await userPostsRateLimiter.limit(userId)

    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Please wait before getting more posts.",
      })
    }
    
  return ctx.prisma.post.findMany({
    where: { userid: input.userId },
    orderBy: { createdat: 'desc' },
    skip: input.skip ?? 0,
    take: input.take ?? 3,
  })
}),

getUserFromChess: protectedProcedure
  .query(async ({ ctx }) => {
    const { userId } = await auth()

    if (!userId) throw new Error("User not authenticated")

    const { success } = await ChessUsernameRateLimiter.limit(userId)
    if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' })

    const user = await ctx.prisma.user.findFirst({ where: { id: userId } })
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    const chessUser = await fetch(`https://api.chess.com/pub/player/${user.ChessUsername}/stats`)
    const chessData = await chessUser.json()

    if (!chessData) throw new TRPCError({ code: 'NOT_FOUND', message: 'Chess user not found' })

    return chessData
  }),

updateChessUsername: protectedProcedure
  .input(z.object({ ChessUsername: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { userId } = await auth()
    if (!userId) throw new Error("User not authenticated")

    const { success } = await ChessUsernameRateLimiter.limit(userId)
    if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' })

    const user = await ctx.prisma.user.findFirst({ where: { id: userId } })
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    return ctx.prisma.user.update({
      where: { id: user.id },
      data: { ChessUsername: input.ChessUsername },
    })
  })
})