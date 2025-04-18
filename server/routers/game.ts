// server/routers/game.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const gameRouter = router({
  createGame: publicProcedure
    .input(z.object({
      whiteId: z.string(),
      blackId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const resolvedCtx = await ctx;
      return await resolvedCtx.prisma.game.create({
        data: {
          whiteId: input.whiteId,
          blackId: input.blackId,
          moves: '',
          result: '',
        },
      });
    }),
});
