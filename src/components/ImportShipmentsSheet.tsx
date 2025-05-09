import type * as React from "react";
import { useState } from "react";
import { X } from "lucide-react";

import templateCsvPath from "../assets/shipment-import-template.csv?url";

import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "./ui/sheet";
import { toast } from "sonner";
import { shipmentFormSchema } from "@/lib/schemas/shipment";
import { processShipmentImport } from "@/lib/csv-utils";
import { FileUploadArea } from "./FileUploadArea";
import { TemplateDownload } from "./TemplateDownload";
import { ImportProgress } from "./ImportProgress";
import { ImportResults, ImportStats } from "./ImportResults";

interface ImportShipmentsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportShipmentsSheet({
  open,
  onOpenChange,
}: ImportShipmentsSheetProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "text/csv") {
        setFile(droppedFile);
      } else {
        toast.error("Invalid file type", {
          description: "Please upload a CSV file.",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsUploading(true);
    setImportProgress(0);
    setImportStats(null);

    try {
      // Read the file content
      const text = await file.text();
      
      // Process the CSV data
      const stats = await processShipmentImport(
        text,
        shipmentFormSchema,
        (progress) => setImportProgress(progress)
      );

      setImportStats(stats);

      // Show appropriate toast based on results
      if (stats.failed === 0) {
        toast.success("Import successful", {
          description: `${stats.successful} shipments have been imported successfully.`,
        });
        setFile(null);
        setTimeout(() => {
          onOpenChange(false);
          setImportStats(null);
        }, 2000);
      } else if (stats.successful === 0) {
        toast.error("Import failed", {
          description: `All ${stats.total} shipments failed to import. Please check the errors.`,
        });
      } else {
        toast.warning("Import partially successful", {
          description: `${stats.successful} shipments imported, ${stats.failed} failed.`,
        });
      }
    } catch (error) {
      toast.error("Import failed", {
        description: error instanceof Error ? error.message : "An error occurred while processing the CSV file.",
      });
      console.error("CSV import error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = templateCsvPath;
    link.download = "shipment-import-template.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg flex flex-col p-0 border-neutral-200 dark:border-neutral-800">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-base">Import Shipment List</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold">Upload a CSV file</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Through imports you can add multiple shipments. You will be asked
              for confirmation before we import shipments.
            </p>
          </div>

          <FileUploadArea
            isDragging={isDragging}
            file={file}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
          />

          <TemplateDownload onDownload={handleDownloadTemplate} />
        </div>

        {isUploading && <ImportProgress progress={importProgress} />}

        {importStats && !isUploading && <ImportResults stats={importStats} />}

        <SheetFooter className="flex justify-between border-t p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setImportStats(null);
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleImport}
            disabled={!file || isUploading}
          >
            {isUploading ? "Importing..." : "Import"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
