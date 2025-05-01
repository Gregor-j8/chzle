import { router } from "../trpc";
import { gameRouter } from "./game";
import { ProfileRouter } from "./profile";
import { puzzleRouter } from "./puzzle";
import { dailypuzzleRouter } from "./dailyPuzzle";

export const appRouter = router({
  game: gameRouter,
  profile: ProfileRouter,
  puzzle: puzzleRouter,
  dailypuzzle: dailypuzzleRouter
});

export type AppRouter = typeof appRouter;
