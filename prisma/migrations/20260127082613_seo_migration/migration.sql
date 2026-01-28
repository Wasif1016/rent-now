-- DropForeignKey
ALTER TABLE "Faq" DROP CONSTRAINT "Faq_faqGroupId_fkey";

-- DropForeignKey
ALTER TABLE "SeoCityOverride" DROP CONSTRAINT "SeoCityOverride_cityId_fkey";

-- DropForeignKey
ALTER TABLE "SeoCityOverride" DROP CONSTRAINT "SeoCityOverride_seoDimensionId_fkey";

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_faqGroupId_fkey" FOREIGN KEY ("faqGroupId") REFERENCES "FaqGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoCityOverride" ADD CONSTRAINT "SeoCityOverride_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoCityOverride" ADD CONSTRAINT "SeoCityOverride_seoDimensionId_fkey" FOREIGN KEY ("seoDimensionId") REFERENCES "SeoDimension"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
