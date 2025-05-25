import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const gameRouter = router({
  createGame: publicProcedure
    .input(z.object({ fen: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const game = await ctx.prisma.game.create({
        data: {
          fen: input.fen,
          whiteid: '',
          blackid: '', 
          pgn: '',   
          result: '',  
        },
      });
      return game
    }),
  getGame: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const game = await ctx.prisma.game.findUnique({
        where: { id: input.id },
      })
      return game
    }),


});
