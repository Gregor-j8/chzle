import { PrismaClient } from "@prisma/client";
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient();

export const createContext = async() => {
  return {
    prisma,
    auth: await auth() 
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
