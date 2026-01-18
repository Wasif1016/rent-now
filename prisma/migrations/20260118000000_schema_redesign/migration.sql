-- Drop existing tables that will be recreated
DROP TABLE IF EXISTS "VehicleCity" CASCADE;
DROP TABLE IF EXISTS "VendorCity" CASCADE;
DROP TABLE IF EXISTS "Vehicle" CASCADE;
DROP TABLE IF EXISTS "VehicleModel" CASCADE;
DROP TABLE IF EXISTS "VehicleType" CASCADE;

-- Create Town table
CREATE TABLE "Town" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Town_pkey" PRIMARY KEY ("id")
);

-- Create VehicleModel table (without vehicleTypeId)
CREATE TABLE "VehicleModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "vehicleBrandId" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleModel_pkey" PRIMARY KEY ("id")
);

-- Create Vehicle table (with cityId and townId, without vehicleTypeId)
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

-- CreateIndex
CREATE UNIQUE INDEX "Town_slug_cityId_key" ON "Town"("slug", "cityId");
CREATE INDEX "Town_cityId_idx" ON "Town"("cityId");
CREATE INDEX "Town_slug_idx" ON "Town"("slug");
CREATE UNIQUE INDEX "VehicleModel_slug_vehicleBrandId_key" ON "VehicleModel"("slug", "vehicleBrandId");
CREATE INDEX "VehicleModel_vehicleBrandId_idx" ON "VehicleModel"("vehicleBrandId");
CREATE UNIQUE INDEX "Vehicle_slug_key" ON "Vehicle"("slug");
CREATE INDEX "Vehicle_cityId_idx" ON "Vehicle"("cityId");
CREATE INDEX "Vehicle_townId_idx" ON "Vehicle"("townId");
CREATE INDEX "Vehicle_cityId_townId_idx" ON "Vehicle"("cityId", "townId");
CREATE INDEX "Vehicle_isAvailable_idx" ON "Vehicle"("isAvailable");

-- AddForeignKey
ALTER TABLE "Town" ADD CONSTRAINT "Town_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VehicleModel" ADD CONSTRAINT "VehicleModel_vehicleBrandId_fkey" FOREIGN KEY ("vehicleBrandId") REFERENCES "VehicleBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vehicleModelId_fkey" FOREIGN KEY ("vehicleModelId") REFERENCES "VehicleModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_townId_fkey" FOREIGN KEY ("townId") REFERENCES "Town"("id") ON DELETE SET NULL ON UPDATE CASCADE;
