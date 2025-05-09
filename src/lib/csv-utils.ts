import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createShipment } from "./shipment-utils";

/**
 * Parse CSV text into an array of record objects
 */
export function parseCSV(text: string) {
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());

    if (values.length === headers.length) {
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      rows.push(row);
    }
  }

  return rows;
}

/**
 * Validate a row against a schema
 */
export function validateRow<T extends z.ZodType>(
  row: Record<string, string>,
  schema: T,
  rowIndex: number
) {
  try {
    const result = schema.safeParse(row);
    if (result.success) {
      return { valid: true, data: result.data };
    } else {
      const errors = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return {
        valid: false,
        error: `Row ${rowIndex + 1}: ${errors}`,
      };
    }
  } catch {
    return {
      valid: false,
      error: `Row ${rowIndex + 1}: Invalid data format`,
    };
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Process shipment data from CSV
 */
export async function processShipmentImport(
  csvText: string,
  schema: z.ZodType,
  onProgress: (progress: number) => void
) {
  const rows = parseCSV(csvText);

  if (rows.length === 0) {
    throw new Error("The CSV file is empty or has an invalid format.");
  }

  const stats = {
    total: rows.length,
    successful: 0,
    failed: 0,
    errors: [] as Array<{ row: number; message: string }>,
  };

  // Process each row with a delay to show progress
  for (let i = 0; i < rows.length; i++) {
    await delay(500);

    const rowIndex = i + 1;
    const validationResult = validateRow(rows[i], schema, i);

    if (validationResult.valid && validationResult.data) {
      try {
        const shipmentId = uuidv4();
        await createShipment(validationResult.data, shipmentId);
        stats.successful++;
      } catch (error) {
        stats.failed++;
        stats.errors.push({
          row: rowIndex,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    } else if (!validationResult.valid && validationResult.error) {
      stats.failed++;
      stats.errors.push({
        row: rowIndex,
        message: validationResult.error,
      });
    }

    // Update progress
    onProgress(Math.round(((i + 1) / rows.length) * 100));
  }

  return stats;
}
