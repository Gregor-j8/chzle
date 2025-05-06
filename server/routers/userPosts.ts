import { router, publicProcedure } from "../trpc";
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
 })
});