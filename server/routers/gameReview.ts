import { z } from "zod"
import { parse } from "@mliebelt/pgn-parser"
import { router, publicProcedure } from "../trpc"
import { Redis } from '@upstash/redis'
import { auth } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"
import { gameReviewRateLimiter } from "@/utils/RateLimiter"

const redis = Redis.fromEnv()

const pagelength = 50

export const gameReviewRouter = router({
  getGameReview: publicProcedure
    .input(z.object({
      username: z.string(),
      year: z.number(),
      month: z.number(),
      page: z.number().optional().default(1),
    }))
    .query(async ({ input }) => {
      const { username, year, month, page } = input;

          const { userId } = await auth()
      
          if (!userId) {
            throw new Error("User not authenticated")
          }
      
          const { success } = await gameReviewRateLimiter.limit(userId)
      
          if (!success) {
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message: "Rate limit exceeded. Please wait before more game reviews.",
            })
          }

       const cacheKey = `chess:games:${username}:${year}:${month}`
      const cachedGames = await redis.get(cacheKey)
      let gamesArray

      if (cachedGames) {
        gamesArray = cachedGames
      } else {
        const url = `https://api.chess.com/pub/player/${username.trim()}/games/${year}/${month.toString().padStart(2, "0")}/pgn`
        const response = await fetch(url)
        const pgnText = await response.text()
        const cleanPgn = pgnText.replace(/@/g, "")
        const games = parse(cleanPgn, { startRule: "games" })
        gamesArray = Array.isArray(games) ? games : []

        await redis.set(cacheKey, JSON.stringify(gamesArray), { ex: 60 * 60 })
      }

      const start = (page - 1) * pagelength
      const end = start + pagelength
      const paginatedGames = gamesArray.slice(start, end)

      return {
        games: paginatedGames,
        totalGames: gamesArray.length,
        totalPages: Math.ceil(gamesArray.length / pagelength),
        currentPage: page,
      }
    }),
})