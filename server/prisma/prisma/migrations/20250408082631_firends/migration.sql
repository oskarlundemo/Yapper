-- CreateTable
CREATE TABLE "Friends" (
    "user_id" INTEGER NOT NULL,
    "friend_id" INTEGER NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("user_id","friend_id")
);

-- CreateTable
CREATE TABLE "PendingFriendRequests" (
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,

    CONSTRAINT "PendingFriendRequests_pkey" PRIMARY KEY ("sender_id","receiver_id")
);

-- CreateTable
CREATE TABLE "GroupChats" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "name" TEXT,

    CONSTRAINT "GroupChats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMembers" (
    "group_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,

    CONSTRAINT "GroupMembers_pkey" PRIMARY KEY ("group_id","member_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friends_friend_id_user_id_key" ON "Friends"("friend_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PendingFriendRequests_sender_id_receiver_id_key" ON "PendingFriendRequests"("sender_id", "receiver_id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMembers_member_id_group_id_key" ON "GroupMembers"("member_id", "group_id");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingFriendRequests" ADD CONSTRAINT "PendingFriendRequests_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingFriendRequests" ADD CONSTRAINT "PendingFriendRequests_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChats" ADD CONSTRAINT "GroupChats_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "GroupChats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
