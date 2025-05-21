-- CreateTable
CREATE TABLE "PrivateMessagesAttachment" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "uniqueFileName" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrivateMessagesAttachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrivateMessagesAttachment" ADD CONSTRAINT "PrivateMessagesAttachment_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
