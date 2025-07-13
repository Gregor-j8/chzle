import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc"
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export const gameRouter = router({
  createGame: protectedProcedure
    .input(z.object({
      id: z.string(),
      whiteid: z.string(),
      blackid: z.string(),
      pgn: z.string(),
      result: z.string(),
      fen: z.string(),
      createdAt: z.date()
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, whiteid, blackid, pgn, result,fen, createdAt } = input;
      const game = await ctx.prisma.game.create({
          data: { id, whiteid, blackid, pgn, result, fen, createdAt },
      })
      return game
    }),
  findGameDetails: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const game = await ctx.prisma.game.findUnique({
          where: { id: id },
          include: { whitePlayer: true, blackPlayer: true }
      })
      return game
    }),
  getAiMove: publicProcedure
      .input(z.object({  fen: z.string(), depth: z.number().min(1).max(15).default(10) }))
      .mutation(async ({ input }) => {
        const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(input.fen)}&depth=${input.depth}`;
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch from Stockfish API")
        const text = await res.text()
        const bestmoveMatch = text.match(/bestmove\s([a-h][1-8][a-h][1-8][qrbn]?)/)
        const ponderMatch = text.match(/ponder\s([a-h][1-8][a-h][1-8][qrbn]?)/)
        const bestmove = bestmoveMatch ? bestmoveMatch[1] : null
        const ponder = ponderMatch ? ponderMatch[1] : null
        if (!bestmove) throw new Error("Invalid move from Stockfish API")
        return {   
          bestmove: bestmove,
          ponder: ponder,
        }
      }),
getEvaluation: publicProcedure
  .input(z.object({ fen: z.string().optional(), gameId: z.string().optional() }))
  .query(async ({ input }) => {
    console.log("getEvaluation called", input)
    const { fen, gameId } = input
    const cacheKey = gameId ? `eval:${gameId}:${fen}` : `eval:${fen}`
    const cached = await redis.get(cacheKey)
    if (cached) {
      return cached
    }
      const response = await fetch("https://chess-api.com/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fen: fen,
        }),
      })
      console.log("Response status:", response.status)

      const evalData = await response.json()
      if (evalData.error) {
        return evalData
      } else {
        const ChessData = {
          winChance: evalData.winChance,
          san: evalData.san,
          eval: evalData.eval,
          centipawns: evalData.centipawns,
          continuation: evalData.continuation,
          continuationArr: evalData.continuationArr,
          text: evalData.text,
          move: evalData.move
        }
        await redis.set(cacheKey, JSON.stringify(ChessData), { ex: 3600 })
        return ChessData
      }
  })
})