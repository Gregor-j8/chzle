/*
  Warnings:

  - You are about to drop the column `userId` on the `Likes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `comments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[postId,userid]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userid` to the `Likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Likes" DROP COLUMN "userId",
ADD COLUMN     "userid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "userId",
ADD COLUMN     "userid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Likes_postId_userid_key" ON "Likes"("postId", "userid");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
