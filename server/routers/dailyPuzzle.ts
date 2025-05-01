import { router, protectedProcedure } from "../trpc";
import { z } from 'zod'

export const dailypuzzleRouter = router({
 completedDailyPuzzles: protectedProcedure.input(
    z.object({
      userId: z.string(),
      puzzleId: z.string(),
      rating: z.number(),
      completedDate: z.string()
    })).mutation(async ({ input, ctx }) => {
      const { userId, puzzleId, rating, completedDate} = input
      const dailyPuzzle = await ctx.prisma.dailyPuzzle.create({
        data: {userId, puzzleId, rating, completedDate }
      })
      return dailyPuzzle
    })
});
