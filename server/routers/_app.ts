import { router } from "../trpc";
import { gameRouter } from "./game";
import { ProfileRouter } from "./profile";
import { puzzleRouter } from "./puzzle";
import { dailypuzzleRouter } from "./dailyPuzzle";
import { userPosts } from "./userPosts";

export const appRouter = router({
  game: gameRouter,
  profile: ProfileRouter,
  puzzle: puzzleRouter,
  dailypuzzle: dailypuzzleRouter,
  userPostsRouter: userPosts
});

export type AppRouter = typeof appRouter;
