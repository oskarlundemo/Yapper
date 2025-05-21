/*
  Warnings:

  - You are about to drop the `PendingGroupRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupMessageAttachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attached_files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PendingGroupRequest" DROP CONSTRAINT "PendingGroupRequest_group_id_fkey";

-- DropForeignKey
ALTER TABLE "PendingGroupRequest" DROP CONSTRAINT "PendingGroupRequest_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "_GroupMessageAttachments" DROP CONSTRAINT "_GroupMessageAttachments_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupMessageAttachments" DROP CONSTRAINT "_GroupMessageAttachments_B_fkey";

-- DropForeignKey
ALTER TABLE "attached_files" DROP CONSTRAINT "attached_files_file_id_fkey";

-- DropForeignKey
ALTER TABLE "attached_files" DROP CONSTRAINT "attached_files_group_message_id_fkey";

-- DropForeignKey
ALTER TABLE "attached_files" DROP CONSTRAINT "attached_files_private_message_id_fkey";

-- DropTable
DROP TABLE "PendingGroupRequest";

-- DropTable
DROP TABLE "_GroupMessageAttachments";

-- DropTable
DROP TABLE "attached_files";

-- DropTable
DROP TABLE "files";

-- CreateTable
CREATE TABLE "GroupMessagesAttachment" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "uniqueFileName" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMessagesAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GroupMessagesAttachment_message_id_idx" ON "GroupMessagesAttachment"("message_id");

-- CreateIndex
CREATE INDEX "PrivateMessagesAttachment_message_id_idx" ON "PrivateMessagesAttachment"("message_id");

-- AddForeignKey
ALTER TABLE "GroupMessagesAttachment" ADD CONSTRAINT "GroupMessagesAttachment_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "GroupMessages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
