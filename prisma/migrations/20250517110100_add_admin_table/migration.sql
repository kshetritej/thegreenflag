/*
  Warnings:

  - You are about to drop the column `locationInfo` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `mainImage` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `acceptedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `termsAndConditionAccepted` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "locationInfo",
DROP COLUMN "mainImage";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "acceptedAt",
DROP COLUMN "termsAndConditionAccepted";

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);
