import axios from "axios";
import type {
  CommonRouteProps,
  MedicationObject,
  PharmacyInventory,
} from "../../../utils/Interfaces";
import CommonHeading from "../../Common/CommonHeading";
import InventoryActions from "./InventoryActions";
import Stat from "./Stat";
import { APIEndpoints } from "../../../api/api";
import { useEffect, useState } from "react";
import { getStatus } from "../../../utils/Constants";

const InventoryUpdate = ({ userId }: CommonRouteProps) => {
  const [totalMedications, setTotalMedications] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [outOfStockItems, setOutOfStockItems] = useState(0);

  const fetchData = async () => {
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

        setTotalMedications(inventoryWithMedications.length);
        setLowStockItems(lowStockCount);
        setOutOfStockItems(outOfStockCount);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading="Inventory Management"
        subHeading="Update and manage medication inventory"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Stat
          bg="bg-teal-100"
          icon="fas fa-pills text-teal-600"
          heading="Total Medications"
          subHeading={totalMedications.toString()}
        />
        <Stat
          bg="bg-yellow-100"
          icon="fas fa-exclamation-triangle text-yellow-600"
          heading="Low Stock"
          subHeading={lowStockItems.toString()}
        />
        <Stat
          bg="bg-red-100"
          icon="fas fa-exclamation-circle text-red-600"
          heading="Out of Stock"
          subHeading={outOfStockItems.toString()}
        />
      </div>
      <InventoryActions userId={userId} onInventoryUpdate={fetchData} />
    </div>
  );
};

export default InventoryUpdate;
