import { router } from "../trpc"
import { gameRouter } from "./game"
import { ProfileRouter } from "./profile"
import { puzzleRouter } from "./puzzle"
import { dailypuzzleRouter } from "./dailyPuzzle"
import { userPosts } from "./userPosts"
import { chatRouter } from "./chat"
import { followRouter } from "./follow"
import { OpeningRouter } from "./opening"

export const appRouter = router({
  game: gameRouter,
  profile: ProfileRouter,
  puzzle: puzzleRouter,
  dailypuzzle: dailypuzzleRouter,
  userPostsRouter: userPosts,
  chat: chatRouter,
  followRouter: followRouter, 
  OpeningRouter: OpeningRouter
});

export type AppRouter = typeof appRouter;
