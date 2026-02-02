-- Idempotent migration: safe to re-run after partial failure

-- 1. Rename existing Route (vendor offer) to VendorRouteOffer only if old Route exists (has vehicleId)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables t
    JOIN information_schema.columns c ON c.table_name = t.table_name AND c.table_schema = t.table_schema
    WHERE t.table_schema = 'public' AND t.table_name = 'Route' AND c.column_name = 'vehicleId'
  ) THEN
    ALTER TABLE "Route" RENAME TO "VendorRouteOffer";
    ALTER TABLE "VendorRouteOffer" RENAME CONSTRAINT "Route_pkey" TO "VendorRouteOffer_pkey";
  END IF;
END $$;

-- Ensure VendorRouteOffer has its own PK name (in case rename already ran earlier)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid JOIN pg_namespace n ON t.relnamespace = n.oid WHERE n.nspname = 'public' AND t.relname = 'VendorRouteOffer' AND c.conname = 'Route_pkey') THEN
    ALTER TABLE "VendorRouteOffer" RENAME CONSTRAINT "Route_pkey" TO "VendorRouteOffer_pkey";
  END IF;
END $$;

-- 2. Update Booking: drop old FK, rename column if exists, ensure new FK
ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS "Booking_routeId_fkey";
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Booking' AND column_name = 'routeId') THEN
    ALTER TABLE "Booking" RENAME COLUMN "routeId" TO "vendorRouteOfferId";
  END IF;
END $$;
ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS "Booking_vendorRouteOfferId_fkey";
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Booking' AND column_name = 'vendorRouteOfferId') THEN
    ALTER TABLE "Booking" ADD CONSTRAINT "Booking_vendorRouteOfferId_fkey" FOREIGN KEY ("vendorRouteOfferId") REFERENCES "VendorRouteOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- 3. Create RouteType (if not exists)
CREATE TABLE IF NOT EXISTS "RouteType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RouteType_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "RouteType_slug_key" ON "RouteType"("slug");

-- 4. Create RouteCategory (if not exists)
CREATE TABLE IF NOT EXISTS "RouteCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RouteCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "RouteCategory_slug_key" ON "RouteCategory"("slug");

-- 5. Create Route (SEO entity) only if table named Route does not exist in public
-- (Route_pkey may exist on VendorRouteOffer after rename, so check table name)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'Route' AND c.relkind = 'r') THEN
    CREATE TABLE "Route" (
        "id" SERIAL NOT NULL,
        "slug" TEXT NOT NULL,
        "originCityId" TEXT NOT NULL,
        "destinationCityId" TEXT NOT NULL,
        "routeTypeId" INTEGER NOT NULL,
        "routeCategoryId" INTEGER NOT NULL,
        "distanceKm" INTEGER,
        "estimatedTime" TEXT,
        "oneWay" BOOLEAN NOT NULL DEFAULT true,
        "roundTrip" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
    );
    CREATE UNIQUE INDEX "Route_slug_key" ON "Route"("slug");
    CREATE INDEX "Route_originCityId_destinationCityId_idx" ON "Route"("originCityId", "destinationCityId");
    ALTER TABLE "Route" ADD CONSTRAINT "Route_originCityId_fkey" FOREIGN KEY ("originCityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    ALTER TABLE "Route" ADD CONSTRAINT "Route_destinationCityId_fkey" FOREIGN KEY ("destinationCityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    ALTER TABLE "Route" ADD CONSTRAINT "Route_routeTypeId_fkey" FOREIGN KEY ("routeTypeId") REFERENCES "RouteType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    ALTER TABLE "Route" ADD CONSTRAINT "Route_routeCategoryId_fkey" FOREIGN KEY ("routeCategoryId") REFERENCES "RouteCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  ELSE
    -- Table exists: ensure indexes and FKs exist
    CREATE UNIQUE INDEX IF NOT EXISTS "Route_slug_key" ON "Route"("slug");
    CREATE INDEX IF NOT EXISTS "Route_originCityId_destinationCityId_idx" ON "Route"("originCityId", "destinationCityId");
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Route_originCityId_fkey') THEN
      ALTER TABLE "Route" ADD CONSTRAINT "Route_originCityId_fkey" FOREIGN KEY ("originCityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Route_destinationCityId_fkey') THEN
      ALTER TABLE "Route" ADD CONSTRAINT "Route_destinationCityId_fkey" FOREIGN KEY ("destinationCityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Route_routeTypeId_fkey') THEN
      ALTER TABLE "Route" ADD CONSTRAINT "Route_routeTypeId_fkey" FOREIGN KEY ("routeTypeId") REFERENCES "RouteType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Route_routeCategoryId_fkey') THEN
      ALTER TABLE "Route" ADD CONSTRAINT "Route_routeCategoryId_fkey" FOREIGN KEY ("routeCategoryId") REFERENCES "RouteCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
  END IF;
END $$;

-- 6. Create VehicleRoute (if not exists)
CREATE TABLE IF NOT EXISTS "VehicleRoute" (
    "id" SERIAL NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "routeId" INTEGER NOT NULL,
    CONSTRAINT "VehicleRoute_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "VehicleRoute_vehicleId_routeId_key" ON "VehicleRoute"("vehicleId", "routeId");
CREATE INDEX IF NOT EXISTS "VehicleRoute_vehicleId_idx" ON "VehicleRoute"("vehicleId");
CREATE INDEX IF NOT EXISTS "VehicleRoute_routeId_idx" ON "VehicleRoute"("routeId");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'VehicleRoute_vehicleId_fkey') THEN
    ALTER TABLE "VehicleRoute" ADD CONSTRAINT "VehicleRoute_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF; END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'VehicleRoute_routeId_fkey') THEN
    ALTER TABLE "VehicleRoute" ADD CONSTRAINT "VehicleRoute_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF; END $$;
