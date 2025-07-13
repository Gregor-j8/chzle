import { auth } from "@clerk/nextjs/server";
import { router, protectedProcedure } from "../trpc";
import { z } from 'zod'
import { GetPuzzleRateLimiter } from "@/utils/RateLimiter";
import { TRPCError } from "@trpc/server";

export const puzzleRouter = router({
  getPuzzles: protectedProcedure.input(z.object({}).optional()).query(async ({ ctx }) => {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { success } = await GetPuzzleRateLimiter.limit(userId);

    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Please wait before getting a new puzzle.",
      })
    }
    
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
