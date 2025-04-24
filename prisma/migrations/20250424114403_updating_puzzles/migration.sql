/*
  Warnings:

  - You are about to drop the column `puzzle` on the `Puzzle` table. All the data in the column will be lost.
  - Added the required column `GameUrl` to the `Puzzle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Population` to the `Puzzle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fen` to the `Puzzle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberplayed` to the `Puzzle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingdeviation` to the `Puzzle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theme` to the `Puzzle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Puzzle" DROP COLUMN "puzzle",
ADD COLUMN     "GameUrl" TEXT NOT NULL,
ADD COLUMN     "Population" INTEGER NOT NULL,
ADD COLUMN     "fen" TEXT NOT NULL,
ADD COLUMN     "moves" TEXT[],
ADD COLUMN     "numberplayed" INTEGER NOT NULL,
ADD COLUMN     "openingTags" TEXT,
ADD COLUMN     "ratingdeviation" INTEGER NOT NULL,
ADD COLUMN     "theme" TEXT NOT NULL;
