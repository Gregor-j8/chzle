import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const gameRouter = router({
  createGame: protectedProcedure
    .input(z.object({
      id: z.string(),
      whiteid: z.string(),
      blackid: z.string(),
      pgn: z.string(),
      result: z.string(),
      fen: z.string(),
      createdAt: z.date()
    }))
    .mutation(async ({ input, ctx }) => {
      console.log(input)
      const { id, whiteid, blackid, pgn, result,fen, createdAt } = input;
      const game = await ctx.prisma.game.create({
          data: { id, whiteid, blackid, pgn, result, fen, createdAt },
      })
      return game
    }),
});
