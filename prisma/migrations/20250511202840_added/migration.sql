/*
  Warnings:

  - The `postId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fen` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `completedDate` to the `userPuzzle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "fen" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "postId",
ADD COLUMN     "postId" TEXT[];

-- AlterTable
ALTER TABLE "userPuzzle" ADD COLUMN     "completedDate" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
