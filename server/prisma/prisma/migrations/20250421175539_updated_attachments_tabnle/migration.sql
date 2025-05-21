-- DropForeignKey
ALTER TABLE "attached_files" DROP CONSTRAINT "attached_files_file_id_fkey";

-- DropForeignKey
ALTER TABLE "attached_files" DROP CONSTRAINT "attached_files_message_id_fkey";

-- AlterTable
ALTER TABLE "attached_files" ADD COLUMN     "group_message_id" INTEGER,
ADD COLUMN     "private_message_id" INTEGER,
ALTER COLUMN "message_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "attached_files" ADD CONSTRAINT "attached_files_private_message_id_fkey" FOREIGN KEY ("private_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attached_files" ADD CONSTRAINT "attached_files_group_message_id_fkey" FOREIGN KEY ("group_message_id") REFERENCES "GroupMessages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attached_files" ADD CONSTRAINT "attached_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
