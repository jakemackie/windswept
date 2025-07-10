/*
  Warnings:

  - You are about to drop the column `userId` on the `Record` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Record_userId_key";

-- AlterTable
ALTER TABLE "Record" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT;
