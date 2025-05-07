import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from 'zod'

export const userPosts = router({
 GetAllPosts: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
        include:{
            user: true
        },
        take: 20,
        orderBy:[{ createdat: "desc" }]
    })
    return posts
 }),
 CreatePosts: protectedProcedure.input(
    z.object({
    userid: z.string(),
    header: z.string(),
    description: z.string(),
    gameId: z.string().optional()
    })).mutation(async ({ctx, input}) => {
        const { userid, header, description, gameId} = input
      const post = await ctx.prisma.post.create({
        data: { userid, header, description, gameId }
      })
      return post
    }),
    filterPosts: publicProcedure.input(z.string())
    .query(async ({ctx, input}) => {
        if (!input.trim()) return;
        return ctx.prisma.post.findMany({
            include:{
                user: true
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
    getPostDetails: protectedProcedure.input(z.string())
    .query(async ({ctx, input}) => {
        if (!input.trim()) return 
        return ctx.prisma.post.findUnique({
            include:{
                user: true,
                // game: true
            },
            where: {
                id: input
            }
        })
    })
});