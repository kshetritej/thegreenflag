/*
  Warnings:

  - Made the column `suspended` on table `Business` required. This step will fail if there are existing NULL values in that column.
  - Made the column `suspended` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "suspended" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "suspended" SET NOT NULL;
