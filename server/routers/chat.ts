import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const chatRouter = router({
  getMessages: protectedProcedure
    .input(z.object({ chatroomId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.message.findMany({
        where: { chatroomId: input.chatroomId },
        include: { sender: true },
        orderBy: { createdAt: 'asc' },
      })
    }),

  sendMessage: protectedProcedure
    .input(z.object({
      text: z.string(),
      chatroomId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.message.create({
        data: {
          text: input.text,
          chatroomId: input.chatroomId,
          senderId: ctx.auth.userId,
        },
        include: { sender: true },
      })
    }),

  getUserChatrooms: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.chatroom.findMany({
      where: {
        members: {
          some: { id: ctx.auth.userId },
        },
      },
      include: {
        members: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }),
});
