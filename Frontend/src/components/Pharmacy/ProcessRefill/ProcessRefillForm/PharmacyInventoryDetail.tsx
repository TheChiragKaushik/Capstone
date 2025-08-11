import type React from "react";
import { useEffect, useState } from "react";
import type { PharmacyInventory } from "../../../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../../../api/api";

type PharmacyInventoryProps = {
    pharmacyId?: string;
    medicationId?: string;
    medicationName?: string;
}
const PharmacyInventoryDetail: React.FC<PharmacyInventoryProps> = ({
    pharmacyId,
    medicationId,
    medicationName
}) => {

    const [pharmacyInventory, setPharmacyInventory] = useState<PharmacyInventory>({});

    const fetchPharmacyMedicationInventoryDetails = async () => {
        try {
            const inventory = await axios.get(`${APIEndpoints.Pharmacy}/inventory/${pharmacyId}?MedicationId=${medicationId}`);
            if (inventory.data) {
                setPharmacyInventory(inventory.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchPharmacyMedicationInventoryDetails();
    }, [pharmacyId, medicationId])
    return (
        <div>
            <h4 className="text-md font-medium text-gray-700 mb-4">
                Medication Inventory Details
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500">Medication:{" "}</p>
                        <p className="text-md font-medium text-gray-900">
                            {medicationName ?? ""}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Current Stock{" "}</p>
                        <p className="text-sm text-gray-900">
                            {pharmacyInventory?.currentStockTablets !== null ?
                                pharmacyInventory.currentStockTablets
                                : pharmacyInventory.currentStockVolume}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PharmacyInventoryDetail