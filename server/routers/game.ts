// server/routers/game.ts
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const gameRouter = router({
  createGame: protectedProcedure
    .input(z.object({
      whiteId: z.string(),
      blackId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.game.create({
        data: {
          whiteId: input.whiteId,
          blackId: input.blackId,
          moves: '',
          result: '',
        },
      });
    }),
});
