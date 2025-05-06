/*
  Warnings:

  - You are about to drop the column `blackId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `whiteId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `blackid` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whiteid` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropIndex
DROP INDEX "Post_userId_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "blackId",
DROP COLUMN "whiteId",
ADD COLUMN     "blackid" TEXT NOT NULL,
ADD COLUMN     "whiteid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "userId",
ADD COLUMN     "userid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "postId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
