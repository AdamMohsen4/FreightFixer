import React, { useState } from "react";
import { SidebarInset } from "@/components/ui/sidebar";

import { ImportShipmentsSheet } from "@/components/ImportShipmentsSheet";
import { ShipmentsTable } from "@/components/ShipmentsTable";
import {
  PageHeader,
  PageTitle,
  ActionButtons,
  EmptyState,
} from "@/components/ShipmentPageComponents";

import { useShipments } from "@/hooks/use-shipments";

const ShipmentsPage: React.FC = () => {
  const [importSheetOpen, setImportSheetOpen] = useState(false);
  const { hasShipments } = useShipments();

  return (
    <>
      <SidebarInset>
        <PageHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex justify-between items-center mb-4">
              <PageTitle />
              <ActionButtons onImport={() => setImportSheetOpen(true)} />
            </div>

            <div className="mt-4">
              {hasShipments ? <ShipmentsTable /> : <EmptyState />}
            </div>
          </div>
        </div>
      </SidebarInset>

      <ImportShipmentsSheet
        open={importSheetOpen}
        onOpenChange={setImportSheetOpen}
      />
    </>
  );
};

export default ShipmentsPage;
