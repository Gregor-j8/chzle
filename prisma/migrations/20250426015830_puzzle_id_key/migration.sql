-- DropForeignKey
ALTER TABLE "userPuzzle" DROP CONSTRAINT "userPuzzle_userId_puzzleId_fkey";

-- AddForeignKey
ALTER TABLE "userPuzzle" ADD CONSTRAINT "userPuzzle_userId_puzzleId_fkey" FOREIGN KEY ("puzzleid") REFERENCES "Puzzle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
