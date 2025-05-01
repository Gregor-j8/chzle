/*
  Warnings:

  - The `history` column on the `DailyPuzzle` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DailyPuzzle" DROP COLUMN "history",
ADD COLUMN     "history" JSONB[],
ALTER COLUMN "completedDate" SET DATA TYPE TEXT;
