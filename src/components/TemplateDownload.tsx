import { Download, FileText } from "lucide-react";

interface TemplateDownloadProps {
  onDownload: () => void;
}

export function TemplateDownload({ onDownload }: TemplateDownloadProps) {
  return (
    <div>
      <h3 className="text-base font-semibold">
        Unsure about how to arrange your list?
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        Download the template below to ensure you are following the correct
        format.
      </p>

      <div
        className="flex items-center justify-between mt-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
        onClick={onDownload}
      >
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded">
            <FileText size={20} />
          </div>
          <span className="text-sm font-medium">
            shipment-import-template.csv
          </span>
        </div>
        <Download className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
