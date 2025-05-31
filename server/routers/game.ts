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
      const { id, whiteid, blackid, pgn, result,fen, createdAt } = input;
      const game = await ctx.prisma.game.create({
          data: { id, whiteid, blackid, pgn, result, fen, createdAt },
      })
      return game
    }),

  findGameDetails: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const game = await ctx.prisma.game.findUnique({
          where: { id: id },
          include: { whitePlayer: true, blackPlayer: true }
      })
      return game
    }),    
});
