/*
  Warnings:

  - You are about to drop the column `version` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "version";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "salt" TEXT;
