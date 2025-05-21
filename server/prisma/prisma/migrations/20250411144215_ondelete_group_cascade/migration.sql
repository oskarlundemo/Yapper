-- DropForeignKey
ALTER TABLE "PendingGroupRequest" DROP CONSTRAINT "PendingGroupRequest_group_id_fkey";

-- AddForeignKey
ALTER TABLE "PendingGroupRequest" ADD CONSTRAINT "PendingGroupRequest_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "GroupChats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
