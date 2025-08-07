import type React from "react";
import {
  type ProviderEO,
  type RaiseRefillEO,
} from "../../../../utils/Interfaces";
import { useEffect, useState } from "react";
import axios from "axios";
import { APIEndpoints } from "../../../../api/api";

type PrescriptionProps = {
  medicationName?: string;
  medicationUnit?: string;
  prescriberName?: string;
  prescribedDate?: string;
  inHandQuantity?: string;
  quantityNeeded?: string;
  directions?: string;
  lastRefillDate?: string;
  refillMedication?: RaiseRefillEO;
};

const Prescription: React.FC<PrescriptionProps> = ({ refillMedication }) => {
  const [providerDetails, setProviderDetails] = useState<ProviderEO>(
    {} as ProviderEO
  );

  const fetchProviderDetails = async () => {
    try {
      const provider = await axios.get(
        `${APIEndpoints.UserProfile}?ProviderId=${refillMedication?.providerId}`
      );

      if (provider.data) {
        setProviderDetails(provider.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProviderDetails();
  }, []);
  return (
    <div>
      <h4 className="text-md font-medium text-gray-700 mb-4">
        Prescription Details
      </h4>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Medication</p>
            <p className="text-md font-medium text-gray-900">
              {refillMedication?.medicationName}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Prescriber</p>
            <p className="text-sm text-gray-900">
              Dr. {providerDetails?.firstName}&nbsp;{providerDetails?.lastName}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Prescribed Date</p>
            <p className="text-sm text-gray-900">
              {refillMedication?.medicationPrescribed?.startDate}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">In hand Quantity</p>
            <p className="text-sm text-gray-900">
              {refillMedication?.medicationPrescribed?.currentTabletsInHand !==
              null
                ? refillMedication?.medicationPrescribed?.currentTabletsInHand +
                  ` Tablets`
                : refillMedication?.medicationPrescribed?.currentVolumeInhand +
                  ` ${refillMedication?.medicationPrescribed?.medication?.liquidUnitMeasure}`}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Quantity Needed</p>
            <p className="text-sm text-gray-900">
              {refillMedication?.doseTabletsRequired !== null
                ? refillMedication?.doseTabletsRequired + " Tablets"
                : refillMedication?.doseVolumeRequired + " by Volume"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Directions</p>
            <p className="text-sm text-gray-900">
              {refillMedication?.medicationPrescribed?.schedule?.[0]
                ?.instruction ?? "No instruction available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescription;
