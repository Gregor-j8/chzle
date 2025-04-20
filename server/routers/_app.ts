import { router } from "../trpc";
import { gameRouter } from "./game";
import { ProfileRouter } from "./profile";

export const appRouter = router({
  game: gameRouter,
  profile: ProfileRouter,
});

export type AppRouter = typeof appRouter;
