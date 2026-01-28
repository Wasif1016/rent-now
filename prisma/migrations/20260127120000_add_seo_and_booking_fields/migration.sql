-- Add new booking fields for route-based & city-based bookings and advance payments
ALTER TABLE "Booking"
ADD COLUMN "pickupCityId" TEXT,
ADD COLUMN "dropoffCityId" TEXT,
ADD COLUMN "routeId" TEXT,
ADD COLUMN "startDateTime" TIMESTAMP(3),
ADD COLUMN "endDateTime" TIMESTAMP(3),
ADD COLUMN "advanceAmount" INTEGER;

-- Add foreign keys for new booking relationships
ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_pickupCityId_fkey" FOREIGN KEY ("pickupCityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_dropoffCityId_fkey" FOREIGN KEY ("dropoffCityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create FAQ & SEO template tables
CREATE TABLE "FaqGroup" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FaqGroup_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Faq" (
  "id" TEXT NOT NULL,
  "faqGroupId" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "sortOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SeoDimension" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "basePattern" TEXT NOT NULL,
  "defaultH1Template" TEXT NOT NULL,
  "defaultTitleTemplate" TEXT NOT NULL,
  "defaultMetaDescriptionTemplate" TEXT NOT NULL,
  "faqGroupId" TEXT,
  "isIndexableByDefault" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SeoDimension_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SeoCityOverride" (
  "id" TEXT NOT NULL,
  "cityId" TEXT NOT NULL,
  "seoDimensionId" TEXT NOT NULL,
  "h1Template" TEXT,
  "titleTemplate" TEXT,
  "metaDescriptionTemplate" TEXT,
  "isIndexable" BOOLEAN,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SeoCityOverride_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "Faq_faqGroupId_idx" ON "Faq"("faqGroupId");

CREATE UNIQUE INDEX "SeoDimension_slug_type_key" ON "SeoDimension"("slug", "type");
CREATE INDEX "SeoDimension_type_idx" ON "SeoDimension"("type");

CREATE UNIQUE INDEX "SeoCityOverride_cityId_seoDimensionId_key" ON "SeoCityOverride"("cityId", "seoDimensionId");
CREATE INDEX "SeoCityOverride_cityId_idx" ON "SeoCityOverride"("cityId");
CREATE INDEX "SeoCityOverride_seoDimensionId_idx" ON "SeoCityOverride"("seoDimensionId");

-- Foreign keys
ALTER TABLE "Faq"
ADD CONSTRAINT "Faq_faqGroupId_fkey" FOREIGN KEY ("faqGroupId") REFERENCES "FaqGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SeoDimension"
ADD CONSTRAINT "SeoDimension_faqGroupId_fkey" FOREIGN KEY ("faqGroupId") REFERENCES "FaqGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SeoCityOverride"
ADD CONSTRAINT "SeoCityOverride_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SeoCityOverride"
ADD CONSTRAINT "SeoCityOverride_seoDimensionId_fkey" FOREIGN KEY ("seoDimensionId") REFERENCES "SeoDimension"("id") ON DELETE CASCADE ON UPDATE CASCADE;


