-- CreateTable
CREATE TABLE "_GroupMessageAttachments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GroupMessageAttachments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GroupMessageAttachments_B_index" ON "_GroupMessageAttachments"("B");

-- AddForeignKey
ALTER TABLE "_GroupMessageAttachments" ADD CONSTRAINT "_GroupMessageAttachments_A_fkey" FOREIGN KEY ("A") REFERENCES "attached_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupMessageAttachments" ADD CONSTRAINT "_GroupMessageAttachments_B_fkey" FOREIGN KEY ("B") REFERENCES "GroupMessages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
