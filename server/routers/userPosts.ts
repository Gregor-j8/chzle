import { CommentRateLimiter, LikeRateLimiter, postRateLimiter } from "@/utils/RateLimiter";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from 'zod'
import { TRPCError } from "@trpc/server"


export const userPosts = router({
 GetAllPosts: publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(20),
      cursor: z.string().nullish(), 
    })
  ).query(async ({ ctx, input }) => {
    const { limit, cursor } = input
    const posts = await ctx.prisma.post.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdat: "desc" },
      include: { user: true },
    })
    let nextCursor: typeof cursor | null = null
    if (posts.length > limit) {
      const nextItem = posts.pop()
      nextCursor = nextItem?.id ?? null
    }
    return {
      posts,
      nextCursor,
    }
  }),

 CreatePosts: protectedProcedure.input(
    z.object({
    userid: z.string(),
    header: z.string(),
    description: z.string(),
    gameId: z.string().optional()
    })).mutation(async ({ctx, input}) => {
        const { userid, header, description, gameId} = input

        const { success } = await postRateLimiter.limit(userid)
        if (!success) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "you are posting too frequently. Try again in a minute.",
          })
        }

      const post = await ctx.prisma.post.create({
        data: { userid, header, description, gameId }
      })
      return post
    }),
    deletePost: protectedProcedure.input(z.object({ id: z.string() })) 
    .mutation(async ({ ctx, input }) => {
    await ctx.prisma.post.delete({
    where: { id: input.id }})
    return { success: true }
    }),

    UpdatePost: protectedProcedure.input(
    z.object({
    id: z.string(),
    header: z.string(),
    description: z.string(),
    })).mutation(async ({ctx, input}) => {
    const { header, description, } = input
    const post = await ctx.prisma.post.update({
    where: { id: input.id },
    data: { userid: ctx.auth.userId, header, description, createdat: new Date() }
    })
      return post
    }),

    filterPosts: publicProcedure.input(z.string().cuid())
    .query(async ({ctx, input}) => {
        if (!input.trim()) return;
        return ctx.prisma.post.findMany({
            include:{
                user: true,
            },
            where: {
                header: {
                    contains: input, 
                    mode: "insensitive"
                }
            },
            take: 20
        })
    }),

    getPostDetails: protectedProcedure.input(z.string().min(1))
    .query(async ({ctx, input}) => {
        if (!input.trim()) return 
        return ctx.prisma.post.findUnique({
            include:{
                user: true,
                likes: {
                    include: {
                        user: true
                    }
                },
                comments: {
                    include: {
                        user: true
                    }
                }
            },
            where: {
                id: input
            }
        })
    }),
    CreateComments: protectedProcedure.input(
    z.object({
    userid: z.string(),
    postId: z.string(),
    description: z.string(),
    createdAt: z.date()
    })).mutation(async ({ctx, input}) => {
        const { userid, postId, description, createdAt} = input

      const { success } = await CommentRateLimiter.limit(userid);
        if (!success) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "you are commenting too frequently. Try again in a minute.",
          })
        }

      const comments = await ctx.prisma.comments.create({
        data: { userid, postId, description, createdAt }
      })
      return comments
    }),

    deleteComment: protectedProcedure.input(z.string()) 
    .mutation(async ({ ctx, input }) => {
    const commentId = input
    await ctx.prisma.comments.delete({
    where: { id: commentId }})
    return { success: true }
    }),

    UpdateComment: protectedProcedure.input(
    z.object({
    id: z.string(),
    userid: z.string(),
    postId: z.string(),
    description: z.string(),
    createdAt: z.date()
    })).mutation(async ({ctx, input}) => {
    const { userid, postId, description, createdAt} = input
    const comments = await ctx.prisma.comments.update({
    where: { id: input.id },
    data: { userid, postId, description, createdAt }
    })
      return comments
    }),
    
    CreateLikes: protectedProcedure.input(
    z.object({
    userid: z.string(),
    postId: z.string(),
    })).mutation(async ({ctx, input}) => {
        const { userid, postId} = input

        const { success } = await LikeRateLimiter.limit(userid)
        if (!success) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "you are commenting too frequently. Try again in a minute.",
          })
        }
  
      const likes = await ctx.prisma.likes.create({
        data: { userid, postId }
      })
      return likes
    }),
    DeleteLike: protectedProcedure.input(z.string()) 
    .mutation(async ({ ctx, input }) => {
    const likeId = input
    await ctx.prisma.likes.delete({
    where: { id: likeId }})
    return { success: true }
    }),
})