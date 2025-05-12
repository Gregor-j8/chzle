/*
  Warnings:

  - Changed the type of `completedDate` on the `userPuzzle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "userPuzzle" DROP COLUMN "completedDate",
ADD COLUMN     "completedDate" TIMESTAMP(3) NOT NULL;
