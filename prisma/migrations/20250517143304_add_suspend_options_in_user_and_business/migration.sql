-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "suspended" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "suspended" BOOLEAN DEFAULT false;
