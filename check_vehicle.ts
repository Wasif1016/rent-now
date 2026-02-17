import { prisma } from "./src/lib/prisma";

async function main() {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const recentVendors = await prisma.vendor.findMany({
    where: { createdAt: { gte: oneDayAgo } },
    orderBy: { createdAt: "desc" },
    include: { vehicles: true },
  });

  console.log(
    `Found ${recentVendors.length} vendors created in the last 24 hours.`
  );
  if (recentVendors.length > 0) {
    console.log(
      "Most recent vendor:",
      JSON.stringify(recentVendors[0], null, 2)
    );
  }

  const recentVehicles = await prisma.vehicle.findMany({
    where: { createdAt: { gte: oneDayAgo } },
    orderBy: { createdAt: "desc" },
  });
  console.log(
    `Found ${recentVehicles.length} vehicles created in the last 24 hours.`
  );
  if (recentVehicles.length > 0) {
    console.log(
      "Most recent vehicle:",
      JSON.stringify(recentVehicles[0], null, 2)
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
