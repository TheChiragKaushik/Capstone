import axios from "axios";
import ActionCard from "./ActionCard";
import { useEffect, useState } from "react";
import { APIEndpoints } from "../../../api/api";
import type {
  MedicationObject,
  PharmacyInventory,
} from "../../../utils/Interfaces";
import { getStatus } from "../../../utils/Constants";

const DashboardActions = ({ userId }: { userId: string | undefined }) => {
  const [lowStockItems, setLowStockItems] = useState(0);
  const [outOfStockItems, setOutOfStockItems] = useState(0);

  const fetchStockData = async () => {
    try {
      const pharmacyResponse = await axios.get(
        `${APIEndpoints.Pharmacy}/${userId}`
      );
      const pharmacyData = pharmacyResponse.data;

      if (pharmacyData && pharmacyData.pharmacyInventory) {
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
          totalCount={`24`}
          specificCount={`+8 today`}
          specificCountColor={`text-red-600`}
          buttonHeading={`Process refills`}
        />
        <ActionCard
          icon="fas fa-pills"
          heading={`Low Stock Items`}
          totalCount={`${lowStockItems}`}
          specificCount={`${outOfStockItems} critical`}
          specificCountColor={`text-amber-600`}
          buttonHeading={`Update inventory`}
        />
      </div>
    </>
  );
};

export default DashboardActions;
