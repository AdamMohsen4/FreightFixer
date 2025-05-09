// TODO: REFACTOR
import { useEffect, useState } from "react";
import { format } from "date-fns";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  MoreHorizontal,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";

import { EditShipmentDialog } from "./EditShipmentDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

import { downloadCSV, shipmentsToCSV } from "@/lib/export-utils";

export interface Shipment {
  id: string;
  name: string;
  company: string;
  street: string;
  postal_code: string;
  city: string;
  created_at: string;
  destination: string;
  corrected_city: string;
  confidence: number;
}

type SortColumn = "id" | "name" | "company" | "street" | "city" | "created_at";
type SortDirection = "asc" | "desc";

export function ShipmentsTable() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState<string | null>(null);

  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const [sortColumn, setSortColumn] = useState<SortColumn>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [selectedShipments, setSelectedShipments] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const loadShipments = () => {
      const shipmentsJSON = localStorage.getItem("shipments");
      if (shipmentsJSON) {
        try {
          const parsedShipments = JSON.parse(shipmentsJSON);
          setShipments(parsedShipments);
        } catch (error) {
          console.error("Failed to parse shipments from localStorage:", error);
          setShipments([]);
        }
      }
    };

    loadShipments();

    const handleShipmentsUpdated = () => {
      loadShipments();
      setSelectedShipments(new Set());
    };

    window.addEventListener("shipments-updated", handleShipmentsUpdated);

    return () => {
      window.removeEventListener("shipments-updated", handleShipmentsUpdated);
    };
  }, []);

  const handleDeleteClick = (id: string) => {
    setShipmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const deleteShipment = () => {
    if (!shipmentToDelete) return;

    const updatedShipments = shipments.filter(
      (shipment) => shipment.id !== shipmentToDelete
    );
    localStorage.setItem("shipments", JSON.stringify(updatedShipments));
    setShipments(updatedShipments);

    toast.success("Shipment deleted", {
      description: `Shipment #${shipmentToDelete} has been deleted.`,
    });

    window.dispatchEvent(new CustomEvent("shipments-updated"));

    setShipmentToDelete(null);
  };

  const bulkDeleteShipments = () => {
    if (selectedShipments.size === 0) return;

    const updatedShipments = shipments.filter(
      (shipment) => !selectedShipments.has(shipment.id)
    );
    localStorage.setItem("shipments", JSON.stringify(updatedShipments));
    setShipments(updatedShipments);

    toast.success("Shipments deleted", {
      description: `${selectedShipments.size} shipment(s) have been deleted.`,
    });

    window.dispatchEvent(new CustomEvent("shipments-updated"));

    setSelectedShipments(new Set());
  };

  const exportSelectedShipments = () => {
    if (selectedShipments.size === 0) return;

    const shipmentsToExport = shipments.filter((shipment) =>
      selectedShipments.has(shipment.id)
    );

    const csvContent = shipmentsToCSV(shipmentsToExport);

    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const filename = `shipments-export-${date}.csv`;

    downloadCSV(csvContent, filename);

    toast.success("Export successful", {
      description: `${selectedShipments.size} shipment(s) exported to CSV.`,
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortedShipments = () => {
    return [...shipments].sort((a, b) => {
      let valueA: string | number | Date;
      let valueB: string | number | Date;

      // Extract values based on sort column
      switch (sortColumn) {
        case "id":
          valueA = a.id;
          valueB = b.id;
          break;
        case "name":
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case "company":
          valueA = a.company ? a.company.toLowerCase() : "";
          valueB = b.company ? b.company.toLowerCase() : "";
          break;
        case "street":
          valueA = a.street.toLowerCase();
          valueB = b.street.toLowerCase();
          break;
        case "city":
          valueA = a.city.toLowerCase();
          valueB = b.city.toLowerCase();
          break;
        case "created_at":
          valueA = new Date(a.created_at);
          valueB = new Date(b.created_at);
          break;
        default:
          valueA = a.id;
          valueB = b.id;
      }

      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-1 h-4 w-4 inline-block opacity-50" />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 inline-block" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline-block" />
    );
  };

  const toggleSelectAll = (sortedShipments: Shipment[]) => () => {
    if (selectedShipments.size === sortedShipments.length) {
      // If all are selected, deselect all
      setSelectedShipments(new Set());
    } else {
      // Otherwise, select all
      const allIds = new Set(sortedShipments.map((shipment) => shipment.id));
      setSelectedShipments(allIds);
    }
  };

  const toggleSelectShipment = (id: string) => {
    const newSelected = new Set(selectedShipments);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedShipments(newSelected);
  };

  if (shipments.length === 0) {
    return null;
  }

  const sortedShipments = getSortedShipments();
  const isAllSelected =
    sortedShipments.length > 0 &&
    selectedShipments.size === sortedShipments.length;
  // Check if some shipments are selected
  const isSomeSelected =
    selectedShipments.size > 0 &&
    selectedShipments.size < sortedShipments.length;

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedShipments.size > 0 && (
        <div className="bg-muted p-2 rounded-md flex items-center justify-between">
          <div className="text-sm font-medium">
            {selectedShipments.size} shipment
            {selectedShipments.size > 1 ? "s" : ""} selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportSelectedShipments}
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) {
                      (el as unknown as HTMLInputElement).indeterminate =
                        isSomeSelected;
                    }
                  }}
                  onCheckedChange={toggleSelectAll(sortedShipments)}
                  aria-label="Select all shipments"
                />
              </TableHead>
              <TableHead
                className="w-[100px] whitespace-nowrap cursor-pointer"
                onClick={() => handleSort("id")}
              >
                Shipment ID {renderSortIcon("id")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Recipient {renderSortIcon("name")}
              </TableHead>
              <TableHead
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort("company")}
              >
                Business ID {renderSortIcon("company")}
              </TableHead>
              <TableHead
                className="hidden md:table-cell cursor-pointer"
                onClick={() => handleSort("street")}
              >
                Address {renderSortIcon("street")}
              </TableHead>
              <TableHead
                className="hidden md:table-cell cursor-pointer"
                onClick={() => handleSort("city")}
              >
                <div className="flex items-center gap-1">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-flex cursor-help">
                          <Sparkles className="h-4 w-4 text-[#0F52BA] filter drop-shadow-[0_0_3px_#0F52BA]" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-muted-foreground">
                        <p>AI-powered city name correction.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  City {renderSortIcon("city")}
                </div>
              </TableHead>
              <TableHead
                className="hidden md:table-cell cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                Date Created {renderSortIcon("created_at")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedShipments.has(shipment.id)}
                    onCheckedChange={() => toggleSelectShipment(shipment.id)}
                    aria-label={`Select shipment ${shipment.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">#{shipment.id}</TableCell>
                <TableCell>{shipment.name}</TableCell>
                <TableCell>{shipment.company || "-"}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {shipment.street}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help border-b border-dotted border-muted-foreground/50">
                          {shipment.corrected_city || shipment.city}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="min-w-48 p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">
                              Original
                            </span>
                            <span className="text-xs font-medium">
                              {shipment.city}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">
                              Corrected
                            </span>
                            <span className="text-xs font-medium text-[#0F52BA]">
                              {shipment.corrected_city}
                            </span>
                          </div>
                          {shipment.confidence !== undefined && (
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-xs text-muted-foreground">
                                  Confidence
                                </span>
                                <span className="text-xs font-medium">
                                  {Math.round(shipment.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(shipment.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingShipment(shipment);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit shipment
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(shipment.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete shipment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditShipmentDialog
        shipment={editingShipment}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        shipmentId={shipmentToDelete}
        onConfirm={deleteShipment}
      />

      <DeleteConfirmationDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        count={selectedShipments.size}
        title="Delete Multiple Shipments"
        confirmButtonText="Delete"
        onConfirm={bulkDeleteShipments}
      />
    </div>
  );
}
