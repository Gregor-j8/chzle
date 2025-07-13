import { auth } from "@clerk/nextjs/server";
import { router, protectedProcedure } from "../trpc";
import { z } from 'zod'
import { OpeningRateLimiter } from "@/utils/RateLimiter";
import { TRPCError } from "@trpc/server";

export const OpeningRouter = router({
  getOpenings: protectedProcedure
    .input(z.object({ fen: z.string()}))
    .query(async ({ input }) => {
      const { fen } = input
      const { userId } = await auth()

    if (!userId) {
      throw new Error("User not authenticated")
    }

    const { success } = await OpeningRateLimiter.limit(userId)

    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Please wait before getting new opening.",
      })
    }
      const res = await fetch(`https://explorer.lichess.ovh/masters?fen=${encodeURIComponent(fen)}`)
      
      return await res.json()
    }),
})