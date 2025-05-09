import type * as React from "react";
import { useState } from "react";
import { Download, Upload, X } from "lucide-react";

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

    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Import successful", {
      description: `${file.name} has been imported successfully.`,
    });

    setIsUploading(false);
    setFile(null);
    onOpenChange(false);
  };

  const handleDownloadTemplate = () => {
    toast.success("Template downloaded", {
      description: "shipment-import-template.csv has been downloaded.",
    });
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

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging
                ? "border-[#0F52BA] bg-[#0F52BA]/5"
                : "border-muted-foreground/20"
            } hover:border-[#0F52BA] hover:bg-[#0F52BA]/5 transition-colors cursor-pointer`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <h4 className="text-base font-medium mb-2">Import Shipments</h4>
            <p className="text-sm text-muted-foreground">
              {file ? file.name : "Drag and drop a CSV file or click to upload"}
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold">
              Unsure about how to arrange your list?
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Download the template below to ensure you are following the
              correct format.
            </p>

            <div
              className="flex items-center justify-between mt-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
              onClick={handleDownloadTemplate}
            >
              <div className="flex items-center gap-3">
                <div className="bg-muted p-2 rounded">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="4"
                      y="2"
                      width="16"
                      height="20"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M8 7H16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 12H16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 17H12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">
                  shipment-import-template.csv
                </span>
              </div>
              <Download className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <SheetFooter className="flex justify-between border-t p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
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
