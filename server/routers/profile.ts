import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { clerkClient } from '@clerk/nextjs/server'

export const ProfileRouter = router({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const clerk = await clerkClient();
      const users = await clerk.users.getUserList({
        username: [input.username],
      })

      const user = users.data[0];
        console.log("📦 User :", user);

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      return {
        id: user.id,
        username: user.username,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }
    }),
})
