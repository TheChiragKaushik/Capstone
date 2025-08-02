import {
  type CommonRouteProps,
  type Medication,
  type PharmacyInventory,
  type PharmacyInventoryPayload,
} from "../../../utils/Interfaces";
import { useState, useEffect } from "react";
import CommonHeading from "../../Common/CommonHeading";
import CommonTextfield from "../../Common/CommonTextfield";
import {
  Button,
  Collapse,
  MenuItem,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { colors, MedicationForTypes } from "../../../utils/Constants";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import MedicationDetails from "./MedicationDetails";

const AddInventoryForm = ({ userId: pharmacyId }: CommonRouteProps) => {
  const [existingInventoryIds, setExistingInventoryIds] = useState<string[]>(
    []
  );
  const [type, setType] = useState<string>();
  const [medicationId, setMedicationId] = useState<string | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationType, setMedicationType] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [inventoryItem, setInventoryItem] = useState<PharmacyInventory>({
    medicationId: "",
    lastRestockDate: "",
  });

  useEffect(() => {
    const getPharmacy = async () => {
      try {
        const response = await axios.get(
          `${APIEndpoints.Pharmacy}/${pharmacyId}`
        );
        if (response.data && response.data.pharmacyInventory) {
          const ids = response.data.pharmacyInventory.map(
            (item: any) => item.medicationId
          );
          setExistingInventoryIds(ids);
        }
      } catch (err) {
        console.error("Error fetching pharmacy inventory:", err);
      }
    };
    getPharmacy();
  }, [type]);

  useEffect(() => {
    if (medicationId) {
      setInventoryItem((prev) => ({ ...prev, medicationId: medicationId }));
    }
  }, [medicationId]);

  const handleTypeSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value;
    setType(type);
    setMedicationType(type);
    setMedicationId(null);
    setMedications([]);
    setError(null);

    try {
      const response = await axios.get(
        `${APIEndpoints.Admin}/medications?type=${type}`
      );
      if (response.data) {
        const availableMedications = response.data.filter(
          (med: Medication) => !existingInventoryIds.includes(med._id)
        );
        setMedications(availableMedications);
      }
    } catch (err) {
      console.error("Error fetching medications:", err);
      setError("Failed to fetch medications. Please try again.");
    }
  };

  const handleMedicationSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMedicationId = e.target.value;
    setMedicationId(selectedMedicationId);

    setInventoryItem((prev) => ({
      ...prev,
      medicationId: selectedMedicationId,
      currentStockTablets: undefined,
      currentStockVolume: undefined,
      reorderThresholdTablets: undefined,
      reorderThresholdVolume: undefined,
    }));
  };

  const handleAddMedicationInInventory = async () => {
    setError(null);
    setLoading(true);
    setSuccessMessage(null);

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const selectedMedication = medications.find((m) => m._id === medicationId);

    const payload: PharmacyInventoryPayload = {
      medicationId: medicationId as string,
      lastRestockDate: formattedDate,
    };

    if (selectedMedication?.oneTablet || selectedMedication?.tabletsInPack) {
      payload.currentStockTablets = inventoryItem.currentStockTablets;
      payload.reorderThresholdTablets = inventoryItem.reorderThresholdTablets;
    } else if (
      selectedMedication?.volumePerDose ||
      selectedMedication?.totalVolume
    ) {
      payload.currentStockVolume = inventoryItem.currentStockVolume;
      payload.reorderThresholdVolume = inventoryItem.reorderThresholdVolume;
    }

    try {
      console.log(payload);
      await axios.put(
        `${APIEndpoints.Pharmacy}/inventory/${pharmacyId}`,
        payload
      );
      setSuccessMessage("Medication inventory updated successfully!");
      setMedicationType("");
      setMedicationId(null);
      setMedications([]);
      setInventoryItem({ medicationId: "", lastRestockDate: "" });
      setExistingInventoryIds((prev) => [...prev, payload.medicationId]);
    } catch (err: any) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data?.message ||
            "Failed to update inventory. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mt-6 mb-2">
      <CommonHeading
        heading="Add Inventory"
        subHeading="Add medication stock"
      />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CommonTextfield
          variant="outlined"
          isSelect
          size="small"
          label="Medication Type"
          onChange={handleTypeSelect}
          value={medicationType}
        >
          {MedicationForTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </CommonTextfield>

        <CommonTextfield
          variant="outlined"
          isSelect
          size="small"
          label={
            medications.length > 0
              ? "Medication"
              : "No new Medication available"
          }
          onChange={handleMedicationSelect}
          value={medicationId || ""}
          disabled={medications.length === 0}
        >
          {medications.length > 0 &&
            medications.map((medication) => (
              <MenuItem key={medication?._id} value={medication?._id}>
                {medication?.name}
              </MenuItem>
            ))}
        </CommonTextfield>
      </div>

      <Collapse in={medicationId !== null}>
        <MedicationDetails medicationId={medicationId} />
      </Collapse>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CommonTextfield
          variant="outlined"
          size="small"
          label="Current Intake Stock"
          value={
            medicationId &&
            medications.find((m) => m._id === medicationId)?.oneTablet
              ? inventoryItem.currentStockTablets || ""
              : inventoryItem.currentStockVolume || ""
          }
          onChange={(e) => {
            const selectedMedication = medications.find(
              (m) => m._id === medicationId
            );
            const value = e.target.value
              ? parseInt(e.target.value, 10)
              : undefined;
            if (selectedMedication?.oneTablet) {
              setInventoryItem((prev) => ({
                ...prev,
                currentStockTablets: value,
              }));
            } else {
              setInventoryItem((prev) => ({
                ...prev,
                currentStockVolume: value,
              }));
            }
          }}
          type="number"
          disabled={!medicationId}
        />
        <CommonTextfield
          variant="outlined"
          size="small"
          label="Re-Order Threshold"
          value={
            medicationId &&
            medications.find((m) => m._id === medicationId)?.oneTablet
              ? inventoryItem.reorderThresholdTablets || ""
              : inventoryItem.reorderThresholdVolume || ""
          }
          onChange={(e) => {
            const selectedMedication = medications.find(
              (m) => m._id === medicationId
            );
            const value = e.target.value
              ? parseInt(e.target.value, 10)
              : undefined;
            if (selectedMedication?.oneTablet) {
              setInventoryItem((prev) => ({
                ...prev,
                reorderThresholdTablets: value,
              }));
            } else {
              setInventoryItem((prev) => ({
                ...prev,
                reorderThresholdVolume: value,
              }));
            }
          }}
          type="number"
          disabled={!medicationId}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          onClick={handleAddMedicationInInventory}
          className="rounded-lg text-sm font-medium transition-colors duration-300"
          sx={{
            backgroundColor: colors.brown600,
            color: "white",
            p: 1,
            "&:hover": {
              backgroundColor: colors.brown700,
            },
          }}
          disabled={
            loading ||
            !medicationId ||
            (!inventoryItem.currentStockTablets &&
              !inventoryItem.currentStockVolume)
          }
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              <i className="fas fa-plus mr-2"></i>
              Update Medication
            </>
          )}
        </Button>
      </div>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddInventoryForm;
