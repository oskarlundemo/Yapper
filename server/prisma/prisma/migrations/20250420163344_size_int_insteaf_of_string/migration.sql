/*
  Warnings:

  - The `size` column on the `files` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "size",
ADD COLUMN     "size" INTEGER;
