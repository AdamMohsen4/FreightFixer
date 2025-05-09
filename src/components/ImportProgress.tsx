import { Progress } from "./ui/progress";

interface ImportProgressProps {
  progress: number;
}

export function ImportProgress({ progress }: ImportProgressProps) {
  return (
    <div className="px-6 py-3 border-t">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Importing shipments...</span>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
