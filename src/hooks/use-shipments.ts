import { useEffect, useState } from "react";

/**
 * Custom hook to manage shipment data and listen for updates
 */
export function useShipments() {
  const [hasShipments, setHasShipments] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkShipments = () => {
      const shipmentsJSON = localStorage.getItem("shipments");
      const shipments = shipmentsJSON ? JSON.parse(shipmentsJSON) : [];
      setHasShipments(shipments.length > 0);
    };

    checkShipments();

    window.addEventListener("shipments-updated", checkShipments);

    return () => {
      window.removeEventListener("shipments-updated", checkShipments);
    };
  }, []);

  return { hasShipments };
}
