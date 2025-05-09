import type { Shipment } from "@/components/ShipmentsTable";
import { format } from "date-fns";

export function shipmentsToCSV(shipments: Shipment[]): string {
  const headers = [
    "Shipment ID",
    "Recipient Name",
    "Company",
    "Street Address",
    "Postal Code",
    "City",
    "Full Address",
    "Date Created",
  ];

  const csvRows = [headers.join(",")];

  for (const shipment of shipments) {
    const row = [
      shipment.id,
      escapeCsvValue(shipment.name),
      escapeCsvValue(shipment.company),
      escapeCsvValue(shipment.street),
      shipment.postal_code,
      escapeCsvValue(shipment.city),
      escapeCsvValue(shipment.destination),
      formatDate(shipment.created_at),
    ];
    csvRows.push(row.join(","));
  }

  return csvRows.join("\n");
}

function escapeCsvValue(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    const escapedValue = value.replace(/"/g, '""');
    return `"${escapedValue}"`;
  }
  return value;
}

function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), "yyyy-MM-dd HH:mm:ss");
  } catch {
    return dateString;
  }
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
