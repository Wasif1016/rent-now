/*
  Warnings:

  - You are about to drop the `SeoContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SeoContent" DROP CONSTRAINT "SeoContent_cityId_fkey";

-- DropForeignKey
ALTER TABLE "SeoContent" DROP CONSTRAINT "SeoContent_vehicleTypeId_fkey";

-- DropForeignKey
ALTER TABLE "SeoContent" DROP CONSTRAINT "SeoContent_vendorId_fkey";

-- DropTable
DROP TABLE "SeoContent";

-- DropEnum
DROP TYPE "PageType";
