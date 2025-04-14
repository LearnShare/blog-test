/*
  Warnings:

  - You are about to drop the column `time` on the `Bookmark` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Code` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Bookmark" DROP COLUMN "time",
ADD COLUMN     "ctime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Code" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "etime" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "CodeType";
