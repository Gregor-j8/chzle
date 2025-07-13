import { auth } from "@clerk/nextjs/server";
import { router, protectedProcedure } from "../trpc";
import { z } from 'zod'
import { TRPCError } from "@trpc/server";
import { dailyPuzzleRateLimiter } from "@/utils/RateLimiter";

export const dailypuzzleRouter = router({
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
