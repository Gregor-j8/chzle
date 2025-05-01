/*
  Warnings:

  - Added the required column `completedDate` to the `DailyPuzzle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyPuzzle" ADD COLUMN     "completedDate" TIMESTAMP(3) NOT NULL;
