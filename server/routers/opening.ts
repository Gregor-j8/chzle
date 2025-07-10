import { router, protectedProcedure } from "../trpc";
import { z } from 'zod'

export const OpeningRouter = router({
  getOpenings: protectedProcedure
    .input(z.object({ fen: z.string()}))
    .query(async ({ input }) => {
      const { fen } = input
      const res = await fetch(`https://explorer.lichess.ovh/masters?fen=${encodeURIComponent(fen)}`)
      
      return await res.json()
    }),
})