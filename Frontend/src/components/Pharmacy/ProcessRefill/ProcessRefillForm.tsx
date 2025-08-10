import React, { useState } from "react";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import { colors } from "../../../utils/Constants";
import Patient from "./ProcessRefillForm/Patient";
import Prescription from "./ProcessRefillForm/Prescription";
import CommonHeading from "../../Common/CommonHeading";
import CommonTextfield from "../../Common/CommonTextfield";
import type { RaiseRefillEO } from "../../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";

type ProcessRefillFormProps = {
  refillMedication?: RaiseRefillEO;
  onUpdate?: () => void;
  handleAccordionToggle?: (id: string | null) => void;
};

const ProcessRefillForm: React.FC<ProcessRefillFormProps> = ({
  refillMedication,
  onUpdate,
  handleAccordionToggle,
}) => {
  const [quantity, setQuantity] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const validateInput = (): boolean => {
    if (!refillMedication) {
      setError("Refill medication data is missing.");
      return false;
    }

    if (
      quantity === null ||
      quantity === undefined ||
      isNaN(quantity) ||
      quantity <= 0
    ) {
      setError("Quantity must be a positive number.");
      return false;
    }

    const maxAllowed =
      refillMedication.doseTabletsRequired !== null &&
        refillMedication.doseTabletsRequired !== undefined
        ? refillMedication.doseTabletsRequired
        : refillMedication.doseVolumeRequired;

    if (typeof maxAllowed === "number" && quantity > maxAllowed) {
      setError(`Quantity cannot be more than ${maxAllowed}.`);
      return false;
    }

    return true;
  };

  const handleApproveRefillRequest = async () => {
    setError(null);

    if (!validateInput()) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error || "Validation failed");
      setSnackbarOpen(true);
      return;
    }

    if (!refillMedication) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Refill medication data is missing.");
      setSnackbarOpen(true);
      return;
    }

    const isTabletRequired =
      refillMedication.doseTabletsRequired !== null &&
      refillMedication.doseTabletsRequired !== undefined;

    const payload = {
      ...refillMedication,
      status: "Approved",
      ...(isTabletRequired
        ? { refillQuantityTablets: quantity }
        : { refillQuantityVolume: quantity }),
    };

    try {
      const response = await axios.put(
        `${APIEndpoints.Notifications}/approve-request`,
        payload
      );

      if (response.data) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Refill request approved successfully.");
        setSnackbarOpen(true);
        if (onUpdate && handleAccordionToggle) {
          handleAccordionToggle(null);
          onUpdate();
        }
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Failed to approve refill request.");
        setSnackbarOpen(true);
      }
    } catch (error: any) {
      console.error("Error approving refill request:", error);
      setSnackbarSeverity("error");

      if (error.response?.data?.message) {
        setSnackbarMessage(error.response.data.message);
      } else {
        setSnackbarMessage("An unexpected error occurred.");
      }
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border my-2 border-gray-200">
      <CommonHeading
        heading="Process Refill Request"
        subHeading="Review and fill prescription refill"
      />
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Patient patientId={refillMedication?.patientId} />
        <Prescription refillMedication={refillMedication} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CommonTextfield
          label="Quantity to Dispense"
          required
          type="text"
          variant="outlined"
          value={Number(quantity !== null ? quantity : "")}
          onChange={(e) => {
            const value = e.target.value;
            const numericValue = Number(value);

            if (value === "") {
              setQuantity(null);
              if (error) setError(null);
              return;
            }

            if (numericValue >= 0) {
              setQuantity(numericValue);
              if (error) setError(null);
            }
          }}
          error={Boolean(error)}
          helperText={error ? error : ""}
        />
      </div>

      <Box display="flex" gap={2}>
        <Button
          sx={{
            bgcolor: colors.brown600,
            color: "white",
            px: 2,
            borderRadius: 2,
            fontSize: "0.875rem",
            fontWeight: 500,
            transition: "background-color 0.3s",
            border: "none",
            "&:hover": {
              bgcolor: colors.brown700,
            },
          }}
          type="button"
          id="complete-refill"
          variant="contained"
          onClick={handleApproveRefillRequest}
        >
          Complete Refill
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProcessRefillForm;
