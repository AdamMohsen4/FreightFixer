import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Form } from "./ui/form";

import {
  shipmentFormSchema,
  defaultShipmentValues,
} from "@/lib/schemas/shipment";
import { updateShipment, Shipment } from "@/lib/shipment-utils";
import { ShipmentFormFields } from "./ShipmentFormFields";

interface EditShipmentDialogProps {
  shipment: Shipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditShipmentDialog({
  shipment,
  open,
  onOpenChange,
}: EditShipmentDialogProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof shipmentFormSchema>>({
    resolver: zodResolver(shipmentFormSchema),
    defaultValues: defaultShipmentValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (shipment) {
      form.reset({
        name: shipment.name,
        company: shipment.company || "",
        street: shipment.street,
        postal_code: shipment.postal_code,
        city: shipment.city,
      });
    }
  }, [shipment, form]);

  useEffect(() => {
    if (open && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  async function onSubmit(data: z.infer<typeof shipmentFormSchema>) {
    if (!shipment) return;

    try {
      await updateShipment(data, shipment);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update shipment:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Shipment</DialogTitle>
          <DialogDescription>
            Update the details for shipment #{shipment?.id}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <ShipmentFormFields form={form} nameInputRef={nameInputRef} />

            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
