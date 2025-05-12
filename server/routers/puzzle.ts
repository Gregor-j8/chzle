import { router, protectedProcedure } from "../trpc";
import { z } from 'zod'


export const puzzleRouter = router({
  getPuzzles: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.$queryRaw`
    SELECT * FROM "Puzzle"
    ORDER BY RANDOM()
    LIMIT 1;
  `
  }),

  completedPuzzles:  protectedProcedure.input(
    z.object({
      userId: z.string(),
      puzzleid: z.string(),
      issolved: z.boolean(),
      completedDate: z.date()
    })).mutation(async ({ input, ctx }) => {
      const { userId, puzzleid, issolved, completedDate} = input
      const puzzle = await ctx.prisma.userPuzzle.create({
        data: { userId, puzzleid, issolved, completedDate }
      })
      return puzzle
    })
});
