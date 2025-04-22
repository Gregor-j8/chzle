import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const gameRouter = router({
  createGame: protectedProcedure
    .input(z.object({
      whiteId: z.string(),
      blackId: z.string(),
      pgn: z.string(),
      result: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { whiteId, blackId, pgn, result } = input;
      const game = await ctx.prisma.game.create({
          data: { whiteId, blackId, pgn, result },
      });
      return game
    }),
});
