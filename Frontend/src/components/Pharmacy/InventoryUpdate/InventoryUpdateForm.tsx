import { useState } from "react";
import CommonHeading from "../../Common/CommonHeading";
import CommonTextfield from "../../Common/CommonTextfield";
import { Alert, Button, Snackbar } from "@mui/material";
import { colors } from "../../../utils/Constants";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import type { PharmacyInventory } from "../../../utils/Interfaces";

interface InventoryUpdateProps {
  userId: string | undefined;
  inventoryId: string;
  currentStock: number;
  medicationForm: string;
  onUpdateSuccess: () => void;
}

const InventoryUpdateForm = ({
  userId,
  inventoryId,
  currentStock,
  medicationForm,
  onUpdateSuccess,
}: InventoryUpdateProps) => {
  const [newQuantity, setNewQuantity] = useState<number | null>(currentStock);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleUpdate = async () => {
    if (newQuantity === null || newQuantity < 0) {
      setError("Please enter a valid positive quantity.");
      return;
    }
    setLoading(true);
    setError(null);

    const updatePayload: Partial<PharmacyInventory> = {};
    if (medicationForm === "Tablet") {
      updatePayload.currentStockTablets = newQuantity;
    } else if (medicationForm === "Liquid") {
      updatePayload.currentStockVolume = newQuantity;
    }

    try {
      await axios.put(
        `${APIEndpoints.Pharmacy}/inventory/${userId}?InventoryId=${inventoryId}`,
        updatePayload
      );
      onUpdateSuccess();
      setSnackbarMessage("Inventory updated successfully!");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error updating inventory:", err);
      setError("Failed to update inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <div className="p-6 my-2">
        <CommonHeading
          heading="Update Inventory"
          subHeading="Adjust medication stock"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CommonTextfield
            variant="outlined"
            size="small"
            label="Current Stock"
            disabled
            value={currentStock}
          />
          <CommonTextfield
            variant="outlined"
            size="small"
            label="New Quantity"
            type="number"
            value={newQuantity}
            onChange={(e) => {
              const value = e.target.value;
              setNewQuantity(value === "" ? null : Number(value));
            }}
            error={!!error}
            helperText={error}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="rounded-lg text-sm font-medium transition-colors duration-300"
            sx={{
              backgroundColor: colors.brown600,
              color: "white",
              p: 1,
              "&:hover": {
                backgroundColor: colors.brown700,
              },
            }}
          >
            {loading ? "Updating..." : "Update Medication"}
          </Button>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InventoryUpdateForm;
