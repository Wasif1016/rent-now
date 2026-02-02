-- CreateEnum
CREATE TYPE "DriverOption" AS ENUM ('WITH_DRIVER', 'WITHOUT_DRIVER', 'BOTH');

-- CreateTable
CREATE TABLE "VehicleCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "VehicleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VehicleCategory_slug_key" ON "VehicleCategory"("slug");

-- AlterTable: VehicleType - add categoryId (nullable)
ALTER TABLE "VehicleType" ADD COLUMN "categoryId" TEXT;

-- CreateIndex for VehicleType.categoryId
CREATE INDEX "VehicleType_categoryId_idx" ON "VehicleType"("categoryId");

-- Drop existing unique on VehicleType.slug (was @unique) before adding composite
-- VehicleType currently has slug @unique, so unique constraint name is VehicleType_slug_key
ALTER TABLE "VehicleType" DROP CONSTRAINT IF EXISTS "VehicleType_slug_key";

-- Add unique on (slug, categoryId) - partial: only when categoryId is not null; for nullable we use unique (slug, categoryId) and PostgreSQL allows multiple NULLs in unique
CREATE UNIQUE INDEX "VehicleType_slug_categoryId_key" ON "VehicleType"("slug", "categoryId");

-- AlterTable: VehicleModel - add vehicleTypeId
ALTER TABLE "VehicleModel" ADD COLUMN "vehicleTypeId" TEXT;

-- Drop composite unique (slug, vehicleBrandId) and add unique on slug for VehicleModel
ALTER TABLE "VehicleModel" DROP CONSTRAINT IF EXISTS "VehicleModel_slug_vehicleBrandId_key";
CREATE UNIQUE INDEX "VehicleModel_slug_key" ON "VehicleModel"("slug");

CREATE INDEX "VehicleModel_vehicleTypeId_idx" ON "VehicleModel"("vehicleTypeId");

-- AddForeignKey VehicleModel.vehicleTypeId
ALTER TABLE "VehicleModel" ADD CONSTRAINT "VehicleModel_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "VehicleType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey VehicleType.categoryId
ALTER TABLE "VehicleType" ADD CONSTRAINT "VehicleType_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VehicleCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable: Vendor - add cityId
ALTER TABLE "Vendor" ADD COLUMN "cityId" TEXT;

-- AddForeignKey Vendor.cityId
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable: Vehicle - add categoryId, driverOption, seatingCapacity, priceDaily, priceHourly, priceMonthly
ALTER TABLE "Vehicle" ADD COLUMN "categoryId" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "driverOption" "DriverOption";
ALTER TABLE "Vehicle" ADD COLUMN "seatingCapacity" INTEGER;
ALTER TABLE "Vehicle" ADD COLUMN "priceDaily" INTEGER;
ALTER TABLE "Vehicle" ADD COLUMN "priceHourly" INTEGER;
ALTER TABLE "Vehicle" ADD COLUMN "priceMonthly" INTEGER;

CREATE INDEX "Vehicle_categoryId_idx" ON "Vehicle"("categoryId");
CREATE INDEX "Vehicle_driverOption_idx" ON "Vehicle"("driverOption");
CREATE INDEX "Vehicle_seatingCapacity_idx" ON "Vehicle"("seatingCapacity");

ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VehicleCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
