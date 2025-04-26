/*
  Warnings:

  - Added the required column `issolved` to the `userPuzzle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userPuzzle" ADD COLUMN     "issolved" BOOLEAN NOT NULL;
