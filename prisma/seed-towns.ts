import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const csvPath = path.join(
    process.cwd(),
    "src/constants/Pakistan_Cities_Towns.csv"
  );
  const content = fs.readFileSync(csvPath, "utf8");
  const lines = content.split("\n").filter((line) => line.trim());

  if (lines.length < 2) {
    console.error("CSV is too short");
    return;
  }

  // Parse headers (Cities)
  const citiesRaw = lines[0].split(",");
  const cities = citiesRaw.map((c) => c.trim());

  console.log(`Found ${cities.length} cities in CSV: ${cities.join(", ")}`);

  // Get existing cities from DB to map names to IDs
  const dbCities = await prisma.city.findMany({
    select: { id: true, name: true, slug: true },
  });

  const cityMap = new Map<string, string>(); // Name -> ID
  for (const c of dbCities) {
    cityMap.set(c.name.toLowerCase(), c.id);
  }

  // Iterate through town rows
  let townsCreated = 0;
  for (let i = 1; i < lines.length; i++) {
    const townsInRow = lines[i].split(",");

    for (let j = 0; j < townsInRow.length; j++) {
      const townName = townsInRow[j]?.trim();
      const cityName = cities[j]?.trim();

      if (!townName || !cityName) continue;

      const cityId = cityMap.get(cityName.toLowerCase());
      if (!cityId) {
        // City from CSV not found in DB, skip for now or create if needed
        // Since we want strictness, we skip but log
        // console.warn(`City "${cityName}" not found in database. Skipping town "${townName}"`)
        continue;
      }

      const slug = townName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      try {
        await prisma.town.upsert({
          where: {
            slug_cityId: {
              slug,
              cityId,
            },
          },
          update: {
            name: townName,
            isActive: true,
          },
          create: {
            name: townName,
            slug,
            cityId,
            isActive: true,
          },
        });
        townsCreated++;
      } catch (error) {
        console.error(
          `Failed to upsert town "${townName}" for city "${cityName}":`,
          error
        );
      }
    }
  }

  console.log(`Successfully processed ${townsCreated} town records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
