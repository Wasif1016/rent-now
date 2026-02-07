import { prisma } from "@/lib/prisma";
import {
  FuelType,
  Transmission,
  DriverOption,
  VehicleStatus,
  Prisma,
} from "@prisma/client";
import { uploadImageFromUrl } from "./cloudinary.service";

interface CSVRow {
  title: string;
  description?: string;
  year?: string;
  mileage?: string;
  brand?: string;
  model?: string;
  type?: string;
  city: string;
  town?: string;
  seats: string;
  fuel?: string;
  transmission?: string;
  color?: string;
  features?: string;
  driver_option?: string;
  price_with_driver?: string;
  price_self_drive?: string;
  price_daily?: string;
  price_monthly?: string;
  price_within_city?: string;
  price_out_of_city?: string;
  image_urls?: string;
  plate_number?: string;
  business_location?: string;
}

interface ImportResult {
  success: number;
  errors: Array<{ row: number; error: string; data: CSVRow }>;
  total: number;
}

/**
 * Parse CSV text into rows
 * Simple CSV parser
 */
function parseCSV(csvText: string): string[][] {
  const lines: string[][] = [];
  const rows = csvText.split("\n").filter((line) => line.trim());

  for (const row of rows) {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      const nextChar = row[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    lines.push(values);
  }

  return lines;
}

/**
 * Validate and normalize CSV row
 */
function validateRow(
  row: string[],
  headers: string[],
  rowIndex: number
): { valid: boolean; data?: CSVRow; error?: string } {
  if (row.length !== headers.length) {
    // Provide a more forgiving check?
    // Sometimes CSVs have trailing empty columns.
    // unique headers count should match?
    // Let's stick to strict for now but maybe allow empty strings at end if needed.
    // Actually, if row length > headers, it might be extra commas. If < headers, missing data.
    if (row.length < headers.length) {
      return {
        valid: false,
        error: `Row ${rowIndex + 1}: Column count mismatch (expected ${
          headers.length
        }, got ${row.length})`,
      };
    }
  }

  const data: any = {};
  for (let i = 0; i < headers.length; i++) {
    data[headers[i]] = row[i]?.trim() || "";
  }

  // No rigid required fields check here to allow partial data
  // "title" and "city" are required by DB, but we'll handle missing values in processing or let Prisma throw.
  // Actually, to be user friendly, we might want to default "title" to something if missing.
  // "city" is hard to default. We'll attempt to process.

  return {
    valid: true,
    data: data as CSVRow,
  };
}

export async function importVehiclesFromCSV(
  csvText: string,
  vendorId: string
): Promise<ImportResult> {
  const result: ImportResult = {
    success: 0,
    errors: [],
    total: 0,
  };

  // 1. Parse CSV
  const rows = parseCSV(csvText);
  if (rows.length < 2) {
    return {
      ...result,
      errors: [
        {
          row: 0,
          error: "CSV must have at least a header row and one data row",
          data: {} as CSVRow,
        },
      ],
    };
  }

  // First row is headers
  // Normalize headers: lowercase, replace spaces with underscores
  const headers = rows[0].map((h) =>
    h.trim().toLowerCase().replace(/\s+/g, "_")
  );

  const expectedHeaders = [
    "title",
    "description",
    "year",
    "mileage",
    "brand",
    "model",
    "type",
    "city",
    "town",
    "seats",
    "fuel",
    "transmission",
    "color",
    "features",
    "driver_option",
    "price_with_driver",
    "price_self_drive",
    "price_daily",
    "price_monthly",
    "price_within_city",
    "price_out_of_city",
    "image_urls",
    "plate_number",
    "business_location",
  ];

  // Check required headers presence
  // We relax this to almost nothing, or just "city" since that's the only one we really fail on hard.
  // Actually, even for city, we fail on row level.
  // But if the header "city" itself is missing, none of the rows will have city data.
  const requiredHeaders = ["city"];
  const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

  if (missingHeaders.length > 0) {
    return {
      ...result,
      errors: [
        {
          row: 0,
          error: `Missing required headers: ${missingHeaders.join(", ")}`,
          data: {} as CSVRow,
        },
      ],
    };
  }

  const dataRows = rows.slice(1);
  result.total = dataRows.length;

  // 2. Fetch Lookups
  const [cities, towns, brands, models, types] = await Promise.all([
    prisma.city.findMany({ select: { id: true, name: true } }),
    prisma.town.findMany({ select: { id: true, name: true, cityId: true } }),
    prisma.vehicleBrand.findMany({ select: { id: true, name: true } }),
    prisma.vehicleModel.findMany({
      select: { id: true, name: true, vehicleBrandId: true },
    }),
    prisma.vehicleType.findMany({ select: { id: true, name: true } }),
  ]);

  // Check for business location update in the first row
  const firstRow = dataRows[0];
  if (firstRow && headers.includes("business_location")) {
    const locationIndex = headers.indexOf("business_location");
    const businessLocation = firstRow[locationIndex];

    if (businessLocation && businessLocation.trim()) {
      console.log(
        `Updating vendor ${vendorId} address to: ${businessLocation}`
      );
      await prisma.vendor.update({
        where: { id: vendorId },
        data: { address: businessLocation.trim() },
      });
    }
  }

  const cityMap = new Map(cities.map((c) => [c.name.toLowerCase(), c.id]));
  // Town map key: "townName|cityId" -> townId
  // Or just by name if unique, but town names recur. Better check by city context.

  const brandMap = new Map(brands.map((b) => [b.name.toLowerCase(), b.id]));
  const typeMap = new Map(types.map((t) => [t.name.toLowerCase(), t.id]));

  // Model map key: "modelName|brandId" -> modelId
  // Also simple "modelName" -> modelId if name is unique enough or we iterate to find match.

  // 3. Process Rows
  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    // Skip empty rows
    if (row.length === 0 || (row.length === 1 && row[0] === "")) continue;

    // Map array to object based on headers
    const rowObj: any = {};
    headers.forEach((h, index) => {
      rowObj[h] = row[index] || "";
    });

    const validation = validateRow(row, headers, i);

    if (!validation.valid || !validation.data) {
      result.errors.push({
        row: i + 2,
        error: validation.error || "Unknown validation error",
        data: rowObj,
      });
      continue;
    }

    const data = validation.data;

    try {
      // Resolve relations
      const cityId = data.city
        ? cityMap.get(data.city.toLowerCase())
        : undefined;
      if (!cityId) {
        // City is required by DB schema
        // If user didn't provide it, or it's invalid, we cannot create the vehicle.
        throw new Error(
          data.city ? `City not found: ${data.city}` : `City is required`
        );
      }

      let townId = null;
      if (data.town) {
        const town = towns.find(
          (t) =>
            t.name.toLowerCase() === data.town?.toLowerCase() &&
            t.cityId === cityId
        );
        if (town) townId = town.id;
      }

      let vehicleBrandId = null;
      if (data.brand) {
        vehicleBrandId = brandMap.get(data.brand.toLowerCase());
      }

      let vehicleModelId = null;
      if (data.model) {
        const modelCandidates = models.filter(
          (m) => m.name.toLowerCase() === data.model?.toLowerCase()
        );
        if (modelCandidates.length > 0) {
          if (vehicleBrandId) {
            const match = modelCandidates.find(
              (m) => m.vehicleBrandId === vehicleBrandId
            );
            if (match) vehicleModelId = match.id;
          } else {
            vehicleModelId = modelCandidates[0].id;
          }
        }
      }

      let vehicleTypeId = null;
      if (data.type) {
        vehicleTypeId = typeMap.get(data.type.toLowerCase());
      }

      // Validate Enums
      let fuelType: FuelType | null = null;
      if (data.fuel) {
        const ft = data.fuel.toUpperCase();
        if (Object.values(FuelType).includes(ft as FuelType)) {
          fuelType = ft as FuelType;
        }
      }

      let transmission: Transmission | null = null;
      if (data.transmission) {
        const tr = data.transmission.toUpperCase();
        if (Object.values(Transmission).includes(tr as Transmission)) {
          transmission = tr as Transmission;
        }
      }

      let driverOption: DriverOption | null = null;
      if (data.driver_option) {
        const dro = data.driver_option.toUpperCase().replace(/ /g, "_");
        if (Object.values(DriverOption).includes(dro as DriverOption)) {
          driverOption = dro as DriverOption;
        }
      }

      // Upload Images
      const uploadedImages: string[] = [];
      if (data.image_urls) {
        const urls = data.image_urls
          .split("|")
          .map((u) => u.trim())
          .filter((u) => u);
        for (const url of urls) {
          try {
            const secureUrl = await uploadImageFromUrl(
              url,
              `vendor-${vendorId}/imported-vehicles`
            );
            uploadedImages.push(secureUrl);
          } catch (e) {
            console.error(`Failed to upload image ${url} for row ${i + 2}`, e);
          }
        }
      }

      // Prepare Vehicle Data
      const seats = data.seats ? parseInt(data.seats) : null;
      const year = data.year ? parseInt(data.year) : null;
      const mileage = data.mileage ? parseInt(data.mileage) : null;

      const titleToUse =
        data.title && data.title.trim() ? data.title : "Untitled Vehicle";

      const timestamp = Date.now().toString(36);
      const slug = `${titleToUse.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${
        seats || "0"
      }-seater-${timestamp}-${Math.random().toString(36).substring(2, 5)}`;

      const metadata: Prisma.JsonObject = {};
      if (data.plate_number) {
        metadata["plateNumber"] = data.plate_number;
      }

      await prisma.vehicle.create({
        data: {
          vendorId: vendorId,
          cityId: cityId,
          townId: townId,

          title: titleToUse,
          slug: slug,
          description: data.description || null,

          year: year,
          mileage: mileage,

          vehicleModelId: vehicleModelId,
          vehicleTypeId: vehicleTypeId,

          seats: seats,
          fuelType: fuelType,
          transmission: transmission,
          color: data.color || null,
          driverOption: driverOption,

          features: data.features
            ? data.features.split(",").map((f) => f.trim())
            : undefined,

          priceWithDriver: data.price_with_driver
            ? parseInt(data.price_with_driver)
            : null,
          priceSelfDrive: data.price_self_drive
            ? parseInt(data.price_self_drive)
            : null,
          priceDaily: data.price_daily ? parseInt(data.price_daily) : null,
          priceMonthly: data.price_monthly
            ? parseInt(data.price_monthly)
            : null,
          priceWithinCity: data.price_within_city
            ? parseInt(data.price_within_city)
            : null,
          priceOutOfCity: data.price_out_of_city
            ? parseInt(data.price_out_of_city)
            : null,

          images: uploadedImages,
          metadata: metadata,

          status: VehicleStatus.PUBLISHED,
          isAvailable: true,
        },
      });

      result.success++;
    } catch (error: any) {
      result.errors.push({
        row: i + 2,
        error: error.message || "Unknown error creating vehicle",
        data: rowObj,
      });
    }
  }

  return result;
}
