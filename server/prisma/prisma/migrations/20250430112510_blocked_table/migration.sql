-- AlterTable
ALTER TABLE "users" ADD COLUMN     "blocksBlocked" INTEGER,
ADD COLUMN     "blocksBlocker" INTEGER;

-- CreateTable
CREATE TABLE "Blocks" (
    "blocked" INTEGER NOT NULL,
    "blocker" INTEGER NOT NULL,
    "friends" BOOLEAN,

    CONSTRAINT "Blocks_pkey" PRIMARY KEY ("blocked","blocker")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_blocksBlocked_blocksBlocker_fkey" FOREIGN KEY ("blocksBlocked", "blocksBlocker") REFERENCES "Blocks"("blocked", "blocker") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocks" ADD CONSTRAINT "Blocks_blocked_fkey" FOREIGN KEY ("blocked") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocks" ADD CONSTRAINT "Blocks_blocker_fkey" FOREIGN KEY ("blocker") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
