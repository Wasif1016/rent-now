import { prisma } from "@/lib/prisma";
import { RegistrationStatus } from "@prisma/client";

interface CSVRow {
  business_name: string;
  email: string;
  phone?: string;
  town?: string;
  city: string;
  province?: string;
  google_maps_url?: string;
}

interface ImportResult {
  success: number;
  errors: Array<{ row: number; error: string; data: CSVRow }>;
  total: number;
}

/**
 * Parse CSV text into rows
 * Simple CSV parser (can be replaced with papaparse later)
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
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
    return {
      valid: false,
      error: `Row ${rowIndex + 1}: Column count mismatch`,
    };
  }

  const data: any = {};
  for (let i = 0; i < headers.length; i++) {
    data[headers[i]] = row[i]?.trim() || "";
  }

  // Required fields
  if (!data.business_name || !data.business_name.trim()) {
    return {
      valid: false,
      error: `Row ${rowIndex + 1}: business_name is required`,
    };
  }

  if (data.email && !isValidEmail(data.email)) {
    return {
      valid: false,
      error: `Row ${rowIndex + 1}: Invalid email format: ${data.email}`,
    };
  }

  if (!data.city || !data.city.trim()) {
    return {
      valid: false,
      error: `Row ${rowIndex + 1}: city is required`,
    };
  }

  return {
    valid: true,
    data: data as CSVRow,
  };
}

/**
 * Import businesses from CSV
 */
export async function importBusinessesFromCSV(
  csvText: string
): Promise<ImportResult> {
  const result: ImportResult = {
    success: 0,
    errors: [],
    total: 0,
  };

  try {
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
    const headers = rows[0].map((h) =>
      h.trim().toLowerCase().replace(/\s+/g, "_")
    );
    const dataRows = rows.slice(1);

    result.total = dataRows.length;

    // Validate headers
    const requiredHeaders = ["business_name", "city"];
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

    // Fetch available cities
    const cities = await prisma.city.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // Create a map of normalized city name -> city ID
    const cityMap = new Map<string, string>();
    cities.forEach((city) => {
      cityMap.set(city.name.toLowerCase().trim(), city.id);
    });

    // Process each row
    const emailsToCheck = new Set<string>();
    const businessesToCreate: Array<{
      name: string;
      email?: string;
      phone?: string;
      town?: string;
      province?: string;
      googleMapsUrl?: string;
      slug: string;
      registrationStatus: RegistrationStatus;
      cityId: string;
    }> = [];

    for (let i = 0; i < dataRows.length; i++) {
      const validation = validateRow(dataRows[i], headers, i);

      if (!validation.valid || !validation.data) {
        result.errors.push({
          row: i + 2, // +2 because header is row 1, and we're 0-indexed
          error: validation.error || "Unknown error",
          data: {} as CSVRow,
        });
        continue;
      }

      const data = validation.data;

      // Check for duplicate emails in CSV
      if (data.email && emailsToCheck.has(data.email.toLowerCase())) {
        result.errors.push({
          row: i + 2,
          error: `Duplicate email in CSV: ${data.email}`,
          data,
        });
        continue;
      }

      // Validate City
      const cityName = data.city.toLowerCase().trim();
      const cityId = cityMap.get(cityName);

      if (!cityId) {
        result.errors.push({
          row: i + 2,
          error: `City not found: ${data.city}. Available cities: ${cities
            .map((c) => c.name)
            .join(", ")}`,
          data,
        });
        continue;
      }

      if (data.email) {
        emailsToCheck.add(data.email.toLowerCase());
      }

      // Generate slug
      const slug =
        data.business_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") +
        "-" +
        Math.random().toString(36).substring(2, 9);

      businessesToCreate.push({
        name: data.business_name.trim(),
        email: data.email ? data.email.trim().toLowerCase() : undefined,
        phone: data.phone?.trim() || undefined,
        town: data.town?.trim() || undefined,
        province: data.province?.trim() || undefined,
        googleMapsUrl: data.google_maps_url?.trim() || undefined,
        slug,
        registrationStatus: "NOT_REGISTERED",
        cityId,
      });
    }

    // Check for existing emails in database
    const existingEmails = await prisma.vendor.findMany({
      where: {
        email: {
          in: Array.from(emailsToCheck),
        },
      },
      select: {
        email: true,
      },
    });

    const existingEmailSet = new Set(
      existingEmails.map((v) => v.email?.toLowerCase()).filter(Boolean)
    );

    // Filter out businesses with existing emails and create the rest
    const businessesToInsert = businessesToCreate.filter((b) => {
      if (b.email && existingEmailSet.has(b.email.toLowerCase())) {
        const rowIndex = businessesToCreate.indexOf(b);
        result.errors.push({
          row: rowIndex + 2,
          error: `Email already exists: ${b.email}`,
          data: {
            business_name: b.name,
            email: b.email,
            city: cities.find((c) => c.id === b.cityId)?.name || "",
          } as CSVRow,
        });
        return false;
      }
      return true;
    });

    // Bulk insert
    if (businessesToInsert.length > 0) {
      await prisma.vendor.createMany({
        data: businessesToInsert,
        skipDuplicates: true,
      });
      result.success = businessesToInsert.length;
    }

    return result;
  } catch (error: any) {
    return {
      ...result,
      errors: [
        {
          row: 0,
          error: error.message || "Unknown error during import",
          data: {} as CSVRow,
        },
      ],
    };
  }
}
