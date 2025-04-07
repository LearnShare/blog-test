/*
  Warnings:

  - You are about to drop the column `images` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Post` table. All the data in the column will be lost.
  - Added the required column `status` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "images",
DROP COLUMN "published",
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "ticket" INTEGER;

-- DropEnum
DROP TYPE "TargetType";

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "ref" TEXT,
    "from" INTEGER,
    "to" INTEGER,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "ctime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utime" TIMESTAMP(3),

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);
