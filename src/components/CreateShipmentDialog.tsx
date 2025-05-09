import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { Plus } from "lucide-react";
import { z } from "zod";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form } from "./ui/form";

import {
  shipmentFormSchema,
  defaultShipmentValues,
} from "@/lib/schemas/shipment";
import { createShipment } from "@/lib/shipment-utils";
import { ShipmentFormFields } from "./ShipmentFormFields";

export function CreateShipmentDialog({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [createMore, setCreateMore] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof shipmentFormSchema>>({
    resolver: zodResolver(shipmentFormSchema),
    defaultValues: defaultShipmentValues,
    mode: "onBlur",
  });

  // Focus the name input when the dialog opens
  useEffect(() => {
    if (open && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Focus the name input after creating a shipment with "Create More" checked
  useEffect(() => {
    if (shouldFocus && nameInputRef.current) {
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 200);
      setShouldFocus(false);
    }
  }, [shouldFocus]);

  async function onSubmit(data: z.infer<typeof shipmentFormSchema>) {
    const shipmentId = uuidv4().substring(0, 8).toUpperCase();

    try {
      await createShipment(data, shipmentId);
    } catch (error) {
      console.error("Failed to create shipment:", error);
    } finally {
      if (!createMore) {
        setOpen(false);
      } else {
        setShouldFocus(true);
      }

      form.reset(defaultShipmentValues);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Shipment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Shipment</DialogTitle>
          <DialogDescription>
            Enter the details for the new shipment.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <ShipmentFormFields form={form} nameInputRef={nameInputRef} />

            <DialogFooter className="pt-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="create-more"
                  checked={createMore}
                  onCheckedChange={(checked) => setCreateMore(checked === true)}
                />
                <label
                  htmlFor="create-more"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Create more
                </label>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
