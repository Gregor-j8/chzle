import { createId } from '@paralleldrive/cuid2'
import { router, protectedProcedure } from "../trpc";
import { z } from 'zod'

export const followRouter = router({
    getFollowers: protectedProcedure
    .input(z.object({ followerId: z.string()}))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.follow.findMany({
        where: { 
          AND: [
            { followingId: ctx.auth.userId },
            { followerId: input.followerId }
          ]}
        })
    }),
    createLike: protectedProcedure
    .input(z.object({ followerId: z.string()}))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.follow.create({
        data: {
            id: createId(),
            followerId: input.followerId,
            followingId: ctx.auth.userId
        }
      })
    }),
    deleteLike: protectedProcedure
    .input(z.object({ followerId: z.string()}))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.follow.deleteMany({
        where: { 
          AND: [
            { followingId: ctx.auth.userId },
            { followerId: input.followerId }
          ]}
        })
    }),
    getAllFollowers: protectedProcedure
    .input(z.object({ followerId: z.string()}))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.follow.findMany({
        include: { follower: true, following: true },
        where: { followerId: input.followerId }
        })
    }),
    getAllFollowing: protectedProcedure
    .input(z.object({ followingId: z.string()}))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.follow.findMany({
        include: { follower: true, following: true },
        where: { followingId: input.followingId }
        })
    }),
})

