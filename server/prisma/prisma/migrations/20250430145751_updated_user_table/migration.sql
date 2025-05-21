/*
  Warnings:

  - You are about to drop the column `blocksBlocked` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `blocksBlocker` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "blocksBlocked",
DROP COLUMN "blocksBlocker";
