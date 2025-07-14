import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv()

export const postRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  prefix: "ratelimit:postRateLimiter",
});
export const CommentRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "ratelimit:CommentRateLimiter",
});
export const LikeRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "ratelimit:LikeRateLimiter",
});
export const CreateGameVsPlayerRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  prefix: "ratelimit:createGameVsPlayer",
});
export const GetPuzzleRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "ratelimit:getPuzzleRateLimiter",
});
export const OpeningRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 m"),
  analytics: true,
  prefix: "ratelimit:OpeningRateLimiter",
});
export const usersGameRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "ratelimit:usersGameRateLimiter",
});
export const userPuzzleRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "ratelimit:userPuzzleRateLimiter",
});
export const userPostsRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "ratelimit:userPostRateLimiter",
});
export const gameReviewRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 m"),
  analytics: true,
  prefix: "ratelimit:gameReviewRateLimiter",
});
export const getDailyPuzzleRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
  prefix: "ratelimit:getDailyPuzzleRateLimiter",
});
export const dailyPuzzleRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "8 h"),
  analytics: true,
  prefix: "ratelimit:dailyPuzzleRateLimiter",
});
export const FollowingRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "ratelimit:FollowingRateLimiter",
});

export const ChessUsernameRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, '30 s'),
  analytics: true,
})