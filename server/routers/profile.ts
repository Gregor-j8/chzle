import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { clerkClient,  } from '@clerk/nextjs/server'

export const ProfileRouter = router({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      console.log('Username input:', input.username);
      const users = await clerkClient.users.getUserList({
        username: [input.username],
      })
      console.log("📦 Users returned by Clerk:", users);
            const user = users[0];

      if (!users) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      return {
        id: users.id,
        username: users.username,
        email: users.emailAddresses[0]?.emailAddress,
        firstName: users.firstName,
        lastName: users.lastName,
        imageUrl: users.imageUrl,
      }
    }),
})
