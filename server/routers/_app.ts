import { router } from "../trpc";
import { gameRouter } from "./game";
import { ProfileRouter } from "./profile";
import { puzzleRouter } from "./puzzle";

export const appRouter = router({
  game: gameRouter,
  profile: ProfileRouter,
  puzzle: puzzleRouter
});

export type AppRouter = typeof appRouter;
