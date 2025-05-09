import { z } from "zod";
import { toast } from "sonner";
import { correctCity } from "@/services/cityCorrection";
import { shipmentFormSchema } from "./schemas/shipment";

const STORAGE_KEY = "shipments";
const UPDATE_EVENT = "shipments-updated";

export interface Shipment {
  id: string;
  name: string;
  company: string;
  street: string;
  postal_code: string;
  city: string;
  created_at: string; // ISO date string
  destination: string;
  corrected_city: string;
  confidence: number;
}

export async function createShipment(
  data: z.infer<typeof shipmentFormSchema>,
  shipmentId: string
): Promise<Shipment> {
  const result = await correctCity(data.city.toLowerCase().trim());

  const newShipment: Shipment = {
    id: shipmentId,
    ...data,
    created_at: new Date().toISOString(),
    destination: `${data.street}, ${data.postal_code} ${data.city}`,
    corrected_city: result.corrected,
    confidence: result.confidence,
  };

  const existingShipmentsJSON = localStorage.getItem(STORAGE_KEY);
  const existingShipments = existingShipmentsJSON
    ? JSON.parse(existingShipmentsJSON)
    : [];

  const updatedShipments = [...existingShipments, newShipment];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShipments));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));

  toast.success("Shipment created", {
    description: `Shipment #${shipmentId} for ${data.name} has been created successfully.`,
  });

  return newShipment;
}

export async function updateShipment(
  data: z.infer<typeof shipmentFormSchema>,
  existingShipment: Shipment
): Promise<Shipment> {
  const result = await correctCity(data.city.toLowerCase().trim());

  const updatedShipment: Shipment = {
    ...existingShipment,
    ...data,
    destination: `${data.street}, ${data.postal_code} ${data.city}`,
    corrected_city: result.corrected,
    confidence: result.confidence,
  };

  const shipmentsJSON = localStorage.getItem(STORAGE_KEY);
  if (!shipmentsJSON) {
    throw new Error("No shipments found in storage");
  }
  const shipments = JSON.parse(shipmentsJSON);
  const updatedShipments = shipments.map((s: Shipment) =>
    s.id === existingShipment.id ? updatedShipment : s
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShipments));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));

  toast.success("Shipment updated", {
    description: `Shipment #${existingShipment.id} has been updated successfully.`,
  });

  return updatedShipment;
}
