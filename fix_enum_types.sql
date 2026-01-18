-- Fix enum types in Vehicle table
-- Drop the Vehicle table and recreate it with correct enum types

DROP TABLE IF EXISTS "Vehicle" CASCADE;

-- Recreate Vehicle table with existing enum types
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "vehicleModelId" TEXT,
    "cityId" TEXT NOT NULL,
    "townId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "year" INTEGER,
    "mileage" INTEGER,
    "fuelType" "FuelType",
    "transmission" "Transmission",
    "features" JSONB,
    "color" TEXT,
    "seats" INTEGER,
    "images" JSONB,
    "views" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN DEFAULT true,
    "isVerified" BOOLEAN DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- Recreate indexes
CREATE UNIQUE INDEX "Vehicle_slug_key" ON "Vehicle"("slug");
CREATE INDEX "Vehicle_cityId_idx" ON "Vehicle"("cityId");
CREATE INDEX "Vehicle_townId_idx" ON "Vehicle"("townId");
CREATE INDEX "Vehicle_cityId_townId_idx" ON "Vehicle"("cityId", "townId");
CREATE INDEX "Vehicle_isAvailable_idx" ON "Vehicle"("isAvailable");

-- Recreate foreign keys
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vehicleModelId_fkey" FOREIGN KEY ("vehicleModelId") REFERENCES "VehicleModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_townId_fkey" FOREIGN KEY ("townId") REFERENCES "Town"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Drop unused enum types if they exist
DROP TYPE IF EXISTS "FuelType_new";
DROP TYPE IF EXISTS "Transmission_new";
DROP TYPE IF EXISTS "VendorVerificationStatus_new";
DROP TYPE IF EXISTS "InquiryStatus_new";

