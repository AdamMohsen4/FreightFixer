import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipmentId?: string | null;
  count?: number;
  title?: string;
  description?: React.ReactNode;
  confirmButtonText?: string;
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  shipmentId,
  count = 0,
  title = "Delete Shipment",
  description,
  confirmButtonText = "Delete",
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">{title}</DialogTitle>
          <DialogDescription>
            {description ? (
              description
            ) : shipmentId ? (
              <>
                Are you sure you want to delete shipment #{shipmentId}? This
                action cannot be undone.
              </>
            ) : count > 0 ? (
              <>
                Are you sure you want to delete {count} shipment
                {count > 1 ? "s" : ""}? This action cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete this shipment? This action
                cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
