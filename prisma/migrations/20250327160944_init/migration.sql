-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PROFILE_IMAGE', 'BUSINESS_IMAGE', 'REVIEW_IMAGE');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('RESTAURANT', 'PARK', 'CAFETERIA', 'SHOPPING', 'ATTRACTION', 'MUSEUM', 'THEATER', 'GYM', 'HOTEL', 'RETAIL', 'SERVICE', 'ENTERTAINMENT', 'HEALTH', 'BEAUTY', 'OTHERS', 'COFFEE_SHOP', 'BAR', 'LIBRARY', 'CLUB', 'ART_GALLERY', 'ZOO', 'SPA', 'HOSPITAL', 'EDUCATION', 'TRANSPORTATION', 'OFFICE', 'WORKSHOP', 'PET_FRIENDLY', 'BANK', 'SUPERMARKET', 'FITNESS', 'FARM', 'PHARMACY', 'ONLINE_STORE', 'RESORT', 'CASINO', 'NIGHTCLUB', 'SPORTS', 'LEISURE', 'EVENT_VENUE');

-- CreateEnum
CREATE TYPE "Amenity" AS ENUM ('WIFI', 'PARKING', 'AIR_CONDITIONING', 'FRONT_DESK_24_HOURS', 'PET_FRIENDLY', 'ELEVATOR', 'DISABLED_ACCESS', 'BACKYARD', 'SMOKING_AREA', 'LAUNDRY', 'ROOM_SERVICE', 'SAFE', 'SECURITY', 'ATM', 'GARDEN', 'LUGGAGE_STORAGE', 'VENDING_MACHINE', 'RESTROOMS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "languages" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "businessId" TEXT,
    "userId" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'OTHERS',
    "amenities" "Amenity"[],
    "establishedYear" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Media_userId_key" ON "Media"("userId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
