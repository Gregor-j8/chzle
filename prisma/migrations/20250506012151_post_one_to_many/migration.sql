-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_gameId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "gameId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
