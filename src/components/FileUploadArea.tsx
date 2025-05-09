import React from "react";
import { Upload } from "lucide-react";

interface FileUploadAreaProps {
  isDragging: boolean;
  file: File | null;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUploadArea({
  isDragging,
  file,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
}: FileUploadAreaProps) {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging
          ? "border-[#0F52BA] bg-[#0F52BA]/5"
          : "border-muted-foreground/20"
      } hover:border-[#0F52BA] hover:bg-[#0F52BA]/5 transition-colors cursor-pointer`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <input
        id="file-upload"
        type="file"
        accept=".csv"
        className="hidden"
        onChange={onFileChange}
      />
      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
      <h4 className="text-base font-medium mb-2">Import Shipments</h4>
      <p className="text-sm text-muted-foreground">
        {file ? file.name : "Drag and drop a CSV file or click to upload"}
      </p>
    </div>
  );
}
