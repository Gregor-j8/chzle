import { z } from "zod"
import { parse } from "@mliebelt/pgn-parser"
import { router, publicProcedure } from "../trpc"
import { Redis } from '@upstash/redis'

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
      const url = `https://api.chess.com/pub/player/${username.trim()}/games/${year}/${month.toString().padStart(2, "0")}/pgn`

      const response = await fetch(url)

      const pgnText = await response.text()
      const games = parse(pgnText, { startRule: "games" })

      const gamesArray = Array.isArray(games) ? games : []
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