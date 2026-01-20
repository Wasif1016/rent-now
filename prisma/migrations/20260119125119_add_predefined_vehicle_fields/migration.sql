-- AlterTable
ALTER TABLE "VehicleModel" ADD COLUMN     "bodyType" TEXT,
ADD COLUMN     "defaultColor" TEXT,
ADD COLUMN     "defaultTransmission" "Transmission",
ADD COLUMN     "doors" INTEGER,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "isPredefined" BOOLEAN DEFAULT false,
ADD COLUMN     "largeBags" INTEGER;

-- CreateIndex
CREATE INDEX "VehicleModel_isPredefined_idx" ON "VehicleModel"("isPredefined");
