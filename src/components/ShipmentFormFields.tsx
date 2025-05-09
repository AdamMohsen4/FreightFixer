import { RefObject } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Input } from "./ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { shipmentFormSchema } from "@/lib/schemas/shipment";

interface ShipmentFormFieldsProps {
  form: UseFormReturn<z.infer<typeof shipmentFormSchema>>;
  nameInputRef?: RefObject<HTMLInputElement | null>;
}

export function ShipmentFormFields({
  form,
  nameInputRef,
}: ShipmentFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Matti Virtanen"
                {...field}
                ref={(e) => {
                  field.ref(e);
                  if (nameInputRef && e) nameInputRef.current = e;
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Business ID (Y-tunnus){" "}
              <span className="text-muted-foreground font-normal">
                (Optional)
              </span>
            </FormLabel>
            <FormControl>
              <Input placeholder="1234567-8" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input placeholder="Mannerheimintie 10 A 15" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="00100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Helsinki" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
