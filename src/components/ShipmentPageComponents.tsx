import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { CircleAlert, Upload, Plus } from "lucide-react";
import { CreateShipmentDialog } from "./CreateShipmentDialog";

/**
 * Header component with breadcrumb navigation
 */
export const PageHeader: React.FC = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Shipments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

/**
 * Title section with page heading and description
 */
export const PageTitle: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Shipments</h1>
      <p className="text-muted-foreground">
        Manage your shipments and track deliveries
      </p>
    </div>
  );
};

export interface ActionButtonsProps {
  onImport: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onImport }) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onImport}>
        <Upload className="mr-2 h-4 w-4" />
        Import
      </Button>
      <CreateShipmentDialog>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create
        </Button>
      </CreateShipmentDialog>
    </div>
  );
};

export const EmptyState: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex-1 rounded-xl bg-muted/50 flex flex-col items-center justify-center p-6 md:min-h-min">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <CircleAlert className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No shipments</h2>
        <p className="text-muted-foreground mb-6">
          There are no shipments to show. Create your first shipment to get
          started with tracking and managing your deliveries.
        </p>
        <CreateShipmentDialog />
      </div>
    </div>
  );
};
