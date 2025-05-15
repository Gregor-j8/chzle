import EventEmitter, { on } from 'events'
import { tracked } from '@trpc/server'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
const ee = new EventEmitter()
export { ee }
export const subRouter = router({
  onPostAdd: publicProcedure
    .input(
      z
        .object({

          lastEventId: z.string().nullish(),
        })
        .optional(),
    )
    .subscription(async function* (opts) {
      if (opts?.input && opts.input.lastEventId) {
      }
      for await (const [data] of on(ee, 'add', {
        signal: opts.signal,
      })) {
        const post = data as Post
        yield tracked(post.id, post)
      }
    }),
})