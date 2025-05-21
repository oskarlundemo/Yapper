-- DropForeignKey
ALTER TABLE "GroupMembers" DROP CONSTRAINT "GroupMembers_group_id_fkey";

-- DropForeignKey
ALTER TABLE "GroupMessages" DROP CONSTRAINT "GroupMessages_group_id_fkey";

-- AddForeignKey
ALTER TABLE "GroupMessages" ADD CONSTRAINT "GroupMessages_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "GroupChats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "GroupChats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
