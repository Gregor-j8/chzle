import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const chatRouter = router({
  getMessages: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.message.findMany({
      orderBy: { createdAt: 'asc' },
    })
  }),

  sendMessage: publicProcedure
    .input(z.object({ text: z.string()}))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.message.create({
        data: {
          senderId: ctx.auth.userId,
          text: input.text,
        },
      })
    }),
})