import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws'

const prisma = new PrismaClient()

export const createContext = async (opts: CreateWSSContextFnOptions) => {
  const token = opts.info.connectionParams?.token as string | undefined

  return {
    prisma,
    isWs: true,
    auth: await auth(),
    token,
  }
}
