/*
  Warnings:

  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_userId_fkey";

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage" TEXT;

-- DropTable
DROP TABLE "Media";
