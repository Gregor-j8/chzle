import { auth } from "@clerk/nextjs/server";
import { router, protectedProcedure } from "../trpc";
import { z } from 'zod'
import { TRPCError } from "@trpc/server"
import { dailyPuzzleRateLimiter, getDailyPuzzleRateLimiter } from "@/utils/RateLimiter"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export const dailypuzzleRouter = router({
 getDailyPuzzles: protectedProcedure.query(async () => {
   const { userId } = await auth()

  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not authenticated",
    })
  }

  const { success } = await getDailyPuzzleRateLimiter.limit(userId);

  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate limit exceeded. Please wait before getting the daily puzzle.",
    })
  }

  const cacheKey = "dailyPuzzle"
  const cached = await redis.get(cacheKey)

  if (cached) {
    return cached
  }

  const res = await fetch("https://lichess.org/api/puzzle/daily")
  if (!res.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch daily puzzle from Lichess",
    })
  }

  const data = await res.json()

  await redis.set(cacheKey, data, { ex: 86400 })

  return data
  }),
 completedDailyPuzzles: protectedProcedure.input(
    z.object({
      puzzleId: z.string(),
      rating: z.number(),
      completedDate: z.string()
    })).mutation(async ({ input, ctx }) => {

    const { userId } = await auth()

    if (!userId) {
      throw new Error("User not authenticated")
    }

    const { success } = await dailyPuzzleRateLimiter.limit(userId)

    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Please wait before creating another game.",
      })
    }
      const { puzzleId, rating, completedDate} = input
      const dailyPuzzle = await ctx.prisma.dailyPuzzle.create({
        data: {userId, puzzleId, rating, completedDate }
      })
      return dailyPuzzle
    })
});
