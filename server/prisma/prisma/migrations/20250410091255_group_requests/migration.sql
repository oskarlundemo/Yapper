-- CreateTable
CREATE TABLE "PendingGroupRequest" (
    "group_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,

    CONSTRAINT "PendingGroupRequest_pkey" PRIMARY KEY ("group_id","receiver_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingGroupRequest_receiver_id_group_id_key" ON "PendingGroupRequest"("receiver_id", "group_id");

-- AddForeignKey
ALTER TABLE "PendingGroupRequest" ADD CONSTRAINT "PendingGroupRequest_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingGroupRequest" ADD CONSTRAINT "PendingGroupRequest_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "GroupChats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
