import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { CreateGameVsPlayerRateLimiter } from '@/utils/RateLimiter';
import { auth } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';


export const gameRouter = router({
  createGame: publicProcedure
    .input(z.object({ fen: z.string() }))
    .mutation(async ({ input, ctx }) => {
    const { userId } = await auth();

    if (!userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to create a game.',
      })
    }

    const { success } = await CreateGameVsPlayerRateLimiter.limit(userId)
    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Please wait before creating another game.",
      })
    }
    
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
