export interface ImportStats {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ row: number; message: string }>;
}

interface ImportResultsProps {
  stats: ImportStats;
}

export function ImportResults({ stats }: ImportResultsProps) {
  return (
    <div className="px-6 py-3 border-t">
      <h4 className="text-sm font-medium mb-2">Import Results</h4>
      <div className="flex justify-between text-sm mb-2">
        <span>Total: {stats.total}</span>
        <span className="text-green-600">Successful: {stats.successful}</span>
        <span className="text-red-600">Failed: {stats.failed}</span>
      </div>
      {stats.errors.length > 0 && (
        <div className="mt-3">
          <h5 className="text-sm font-medium mb-1">Errors:</h5>
          <div className="max-h-32 overflow-y-auto text-xs bg-muted p-2 rounded">
            {stats.errors.map((error, index) => (
              <div key={index} className="mb-1">
                <span className="font-medium">Row {error.row}:</span>{" "}
                {error.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
