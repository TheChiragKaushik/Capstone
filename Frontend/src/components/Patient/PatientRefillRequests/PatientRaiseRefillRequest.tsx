import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import CommonTextfield from "../../Common/CommonTextfield";
import { type RaiseRefillEO, type PharmacyEO } from "../../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import { Alert, Button, Collapse, MenuItem, Snackbar } from "@mui/material";
import { colors } from "../../../utils/Constants";
import PharmacyDetails from "./PatientRefillRequest/PharmacyDetails";

type PatientRaiseRefillRequestProps = {
  medicationId?: string;
  refillMedication?: RaiseRefillEO;
  setExpandedId?: Dispatch<SetStateAction<string | number | null>>;
  onUpdate?: () => void;
};

const PatientRaiseRefillRequest: React.FC<PatientRaiseRefillRequestProps> = ({
  medicationId,
  refillMedication,
  setExpandedId,
  onUpdate,
}) => {
  const [selectedMedicationPharmacies, setSelectedMedicationPharmacies] =
    useState<PharmacyEO[]>([]);

  // ✅ Selected pharmacy is PharmacyEO instead of string
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyEO | undefined>();

  const [raiseRefillRequest, setRaiseRefillRequest] = useState<RaiseRefillEO>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const fetchPharmaciesForMedication = async () => {
    if (!medicationId) {
      setSelectedMedicationPharmacies([]);
      return;
    }
    try {
      const response = await axios.get(
        `${APIEndpoints.Pharmacy}/medication?MedicationId=${medicationId}`
      );
      if (response.data && Array.isArray(response.data)) {
        setSelectedMedicationPharmacies(response.data);
      } else {
        setSelectedMedicationPharmacies([]);
      }
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
      setSnackbarMessage("Failed to load pharmacies. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setSelectedMedicationPharmacies([]);
    }
  };

  useEffect(() => {
    fetchPharmaciesForMedication();
    setRaiseRefillRequest(refillMedication ?? {});
  }, [medicationId, refillMedication]);

  const handleSelectPharmacyRequest = async () => {
    if (!selectedPharmacy) {
      setSnackbarMessage("Please select a pharmacy before raising a request.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    const payload: RaiseRefillEO = {
      ...raiseRefillRequest,
      pharmacyId: selectedPharmacy._id, // ✅ Now from selectedPharmacy
      status: "Request Raised",
      requestDate: new Date().toISOString(),
    };

    try {
      const response = await axios.put(
        `${APIEndpoints.Notifications}/requestrefill`,
        payload
      );
      if (response.data) {
        setSnackbarMessage("Refill request raised successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        if (setExpandedId && onUpdate) {
          setExpandedId(null);
          onUpdate();
        }
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Error raising refill request:", error);
      setSnackbarMessage("Failed to raise refill request. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <>
      <div className="flex flex-col w-3/5 md:w-1/2 mx-auto p-4">
        <CommonTextfield
          className="md:col-span-2"
          label="Select from available Pharmacies"
          isSelect
          value={selectedPharmacy?._id || ""}
          onChange={(e) => {
            const selected = selectedMedicationPharmacies.find(
              (p) => p._id === e.target.value
            );
            setSelectedPharmacy(selected);
          }}
          disabled={selectedMedicationPharmacies.length === 0}
        >
          {selectedMedicationPharmacies.length > 0 ? (
            selectedMedicationPharmacies.map((pharmacy) => (
              <MenuItem key={pharmacy._id} value={pharmacy._id}>
                {pharmacy.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              No pharmacies available
            </MenuItem>
          )}
        </CommonTextfield>


        <Collapse in={!!selectedPharmacy}>
          <div className="mt-4">
            <PharmacyDetails pharmacy={selectedPharmacy} />
          </div>
        </Collapse>

        <Button
          onClick={handleSelectPharmacyRequest}
          sx={{
            color: colors.brown600,
            backgroundColor: colors.beige200,
            textTransform: "none",
            mt: 2,
            "&:hover": { color: colors.brown700 },
          }}
          disabled={selectedMedicationPharmacies.length === 0}
        >
          Raise Request
        </Button>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PatientRaiseRefillRequest;
