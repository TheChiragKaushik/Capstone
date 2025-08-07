import axios from "axios";
import ActionCard from "./ActionCard";
import { useEffect, useState } from "react";
import { APIEndpoints } from "../../../api/api";
import type {
  MedicationObject,
  PharmacyEO,
  PharmacyInventory,
} from "../../../utils/Interfaces";
import { getStatus, isTodayDate } from "../../../utils/Constants";
import type { Router } from "@toolpad/core/AppProvider";

const DashboardActions = ({
  userId,
  navigateToRoute,
}: {
  userId: string | undefined;
  navigateToRoute?: Router;
}) => {
  const [pendingRefills, setPendingRefills] = useState(0);
  const [todayPendingRefills, setTodayPendingRefills] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [outOfStockItems, setOutOfStockItems] = useState(0);

  const fetchStockData = async () => {
    try {
      const pharmacyResponse = await axios.get(
        `${APIEndpoints.Pharmacy}/${userId}`
      );
      const pharmacyData: PharmacyEO = pharmacyResponse.data;

      if (pharmacyData && pharmacyData.pharmacyInventory) {
        const refillRequests = pharmacyData.refillMedications?.filter(
          (req) => req.status === "Request Raised"
        );
        setTodayPendingRefills(
          refillRequests?.filter((req) => isTodayDate(req.requestDate ?? ""))
            .length ?? 0
        );
        setPendingRefills(refillRequests?.length ?? 0);

        const inventoryWithMedications = await Promise.all(
          pharmacyData.pharmacyInventory.map(
            async (item: PharmacyInventory) => {
              const medicationResponse = await axios.get(
                `${APIEndpoints.Admin}/medications?MedicationId=${item.medicationId}`
              );
              const medicationData: MedicationObject = medicationResponse.data;
              const status = getStatus(item);

              return {
                ...item,
                medicationName: medicationData.name,
                medicationType: medicationData.type,
                medicationFor: medicationData.description,
                status: status.status,
                statusColor: status.color,
                medicationForm: medicationData.oneTablet ? "Tablet" : "Liquid",
              };
            }
          )
        );

        const lowStockCount = inventoryWithMedications.filter(
          (item) => item.status === "Low Stock"
        ).length;
        const outOfStockCount = inventoryWithMedications.filter(
          (item) => item.status === "Out of Stock"
        ).length;

        setLowStockItems(lowStockCount);
        setOutOfStockItems(outOfStockCount);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ActionCard
          icon="fas fa-prescription"
          heading={`Pending Refills`}
          totalCount={`${pendingRefills}`}
          specificCount={`${todayPendingRefills > 0 ? `+${todayPendingRefills}` : `0`} today`}
          specificCountColor={`text-red-600`}
          buttonHeading={`Process refills`}
          onClickFunction={() => navigateToRoute?.navigate("processRefill")}
        />
        <ActionCard
          icon="fas fa-pills"
          heading={`Low Stock Items`}
          totalCount={`${lowStockItems}`}
          specificCount={`${outOfStockItems} critical`}
          specificCountColor={`text-amber-600`}
          buttonHeading={`Update inventory`}
          onClickFunction={() => navigateToRoute?.navigate("inventoryUpdate")}
        />
      </div>
    </>
  );
};

export default DashboardActions;
