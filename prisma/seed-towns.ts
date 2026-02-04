import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import path from "path";

// Load env vars if not loaded
if (!process.env.DATABASE_URL) {
  require("dotenv").config();
}

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL is required");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting town seeding...");
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

  console.log(`Found ${cities.length} cities in CSV.`);

  // Get existing cities from DB
  const dbCities = await prisma.city.findMany({
    select: { id: true, name: true, slug: true },
  });

  const cityMap = new Map<string, string>();
  for (const c of dbCities) {
    cityMap.set(c.name.toLowerCase(), c.id);
  }

  let townsCreated = 0;
  for (let i = 1; i < lines.length; i++) {
    const townsInRow = lines[i].split(",");

    for (let j = 0; j < townsInRow.length; j++) {
      const townName = townsInRow[j]?.trim();
      const cityName = cities[j]?.trim();

      if (!townName || !cityName || townName === "") continue;

      const cityId = cityMap.get(cityName.toLowerCase());
      if (!cityId) continue;

      const slug = townName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      if (!slug) continue;

      try {
        await prisma.town.upsert({
          where: {
            slug_cityId: {
              slug,
              cityId,
            },
          },
          update: {
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
        // console.error(`Failed: ${townName}`, error)
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
    await pool.end();
  });
