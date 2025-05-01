-- CreateTable
CREATE TABLE "DailyPuzzle" (
    "id" TEXT NOT NULL,
    "puzzleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "history" TEXT[],

    CONSTRAINT "DailyPuzzle_pkey" PRIMARY KEY ("id")
);
