/*
  Warnings:

  - The values [WIFI,PARKING,AIR_CONDITIONING,FRONT_DESK_24_HOURS,PET_FRIENDLY,ELEVATOR,DISABLED_ACCESS,BACKYARD,SMOKING_AREA,LAUNDRY,ROOM_SERVICE,SAFE,SECURITY,ATM,GARDEN,LUGGAGE_STORAGE,VENDING_MACHINE,RESTROOMS] on the enum `Amenity` will be removed. If these variants are still used in the database, this will fail.
  - The values [PET_FRIENDLY] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Amenity_new" AS ENUM ('wifi', 'parking', 'airConditioning', 'frontDesk24Hours', 'petFriendly', 'elevator', 'disabledAccess', 'backyard', 'smokingArea', 'laundry', 'roomService', 'safe', 'security', 'atm', 'garden', 'luggageStorage', 'vendingMachine', 'restrooms');
ALTER TABLE "Business" ALTER COLUMN "amenities" TYPE "Amenity_new"[] USING ("amenities"::text::"Amenity_new"[]);
ALTER TYPE "Amenity" RENAME TO "Amenity_old";
ALTER TYPE "Amenity_new" RENAME TO "Amenity";
DROP TYPE "Amenity_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('RESTAURANT', 'PARK', 'CAFETERIA', 'SHOPPING', 'ATTRACTION', 'MUSEUM', 'THEATER', 'GYM', 'HOTEL', 'RETAIL', 'SERVICE', 'ENTERTAINMENT', 'HEALTH', 'BEAUTY', 'OTHERS', 'COFFEE_SHOP', 'BAR', 'LIBRARY', 'CLUB', 'ART_GALLERY', 'ZOO', 'SPA', 'HOSPITAL', 'EDUCATION', 'TRANSPORTATION', 'OFFICE', 'WORKSHOP', 'BANK', 'SUPERMARKET', 'FITNESS', 'FARM', 'PHARMACY', 'ONLINE_STORE', 'RESORT', 'CASINO', 'NIGHTCLUB', 'SPORTS', 'LEISURE', 'EVENT_VENUE');
ALTER TABLE "Business" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Business" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
ALTER TABLE "Business" ALTER COLUMN "category" SET DEFAULT 'OTHERS';
COMMIT;
