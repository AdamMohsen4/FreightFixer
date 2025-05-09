import { z } from "zod";

function validateBusinessId(val: string | undefined) {
  if (!val) return true;

  // Accept format with or without hyphen
  if (val.includes("-")) {
    return /^\d{7}-\d$/.test(val);
  } else {
    return /^\d{8}$/.test(val);
  }
}

function formatBusinessId(val: string | undefined) {
  if (!val) return "";

  if (!val.includes("-") && val.length === 8) {
    return `${val.slice(0, 7)}-${val.slice(7)}`;
  }
  return val;
}

export const shipmentFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  company: z
    .string()
    .optional()
    .refine(validateBusinessId, {
      message: "Business ID must be in format 1234567-8 or 12345678",
    })
    .transform(formatBusinessId),
  street: z.string().min(1, {
    message: "Street address is required",
  }),
  postal_code: z
    .string()
    .min(1, {
      message: "Postal code is required",
    })
    .length(5, {
      message: "Finnish postal code must be 5 digits",
    })
    .regex(/^\d{5}$/, {
      message: "Postal code must contain only numbers",
    }),
  city: z.string().min(1, {
    message: "City is required",
  }),
});

export type ShipmentFormValues = z.infer<typeof shipmentFormSchema>;

export const defaultShipmentValues: ShipmentFormValues = {
  name: "",
  company: "",
  street: "",
  postal_code: "",
  city: "",
};
