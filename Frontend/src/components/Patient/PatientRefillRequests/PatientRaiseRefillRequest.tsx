import React, { useEffect, useState } from "react";
import CommonTextfield from "../../Common/CommonTextfield";
import { type RaiseRefillEO, type PharmacyEO } from "../../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import { Button, MenuItem } from "@mui/material";
import { colors } from "../../../utils/Constants";

type PatientRaiseRefillRequestProps = {
  medicationId?: string;
  refillMedication?: RaiseRefillEO;
};
const PatientRaiseRefillRequest: React.FC<PatientRaiseRefillRequestProps> = ({
  medicationId,
  refillMedication,
}) => {
  const [selectedMedicationPharmacies, setSelectedMedicationPharmacies] =
    useState<PharmacyEO[]>([]);

  const [selectedPharmacy, setSelectedPharmacy] = useState<string>();

  const [raiseRefillRequest, setRaiseRefillRequest] = useState<RaiseRefillEO>(
    {}
  );

  const fetchPharmaciesForMedication = async () => {
    try {
      const pharmacies = await axios.get(
        `${APIEndpoints.Pharmacy}/medication?MedicationId=${medicationId}`
      );
      if (pharmacies.data) {
        setSelectedMedicationPharmacies(pharmacies.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPharmaciesForMedication();
    setRaiseRefillRequest(refillMedication ?? {});
  }, []);

  const handleSelectPharmacyRequest = async () => {
    const payload: RaiseRefillEO = {
      ...raiseRefillRequest,
      pharmacyId: selectedPharmacy,
      status: "Request Raised",
    };
    try {
      const response = await axios.put(
        `${APIEndpoints.Notifications}/requestrefill`,
        payload
      );
      if (response.data) {
        console.log("Success");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-3/5 md:w-1/2 mx-auto p-4">
      <CommonTextfield
        className="md:col-span-2"
        label="Select Pharmacy"
        isSelect
        onChange={(e) => setSelectedPharmacy(e.target.value)}
      >
        {selectedMedicationPharmacies &&
          selectedMedicationPharmacies.map((pharmacy) => (
            <MenuItem key={pharmacy._id} value={pharmacy?._id}>
              {pharmacy?.name}
            </MenuItem>
          ))}
      </CommonTextfield>
      <Button
        onClick={handleSelectPharmacyRequest}
        sx={{
          color: colors.brown600,
          backgroundColor: colors.beige200,
          textTransform: "none",
          "&:hover": { color: colors.brown700 },
        }}
        size="small"
      >
        Raise Request
      </Button>
    </div>
  );
};

export default PatientRaiseRefillRequest;
