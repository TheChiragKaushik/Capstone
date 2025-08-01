import { Box, Button } from "@mui/material";
import { colors } from "../../../utils/Constants";
import type { CommonRouteProps } from "../../../utils/Interfaces";
import Inventory from "./ProcessRefillForm/Inventory";
import Patient from "./ProcessRefillForm/Patient";
import Prescription from "./ProcessRefillForm/Prescription";
import { useState } from "react";
import CommonHeading from "../../Common/CommonHeading";
import CommonTextfield from "../../Common/CommonTextfield";

const ProcessRefillForm = ({}: CommonRouteProps) => {
  const [quantity, setQuantity] = useState<number | null>(null);
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border my-2 border-gray-200">
      <CommonHeading
        heading="Process Refill Request"
        subHeading="Review and fill prescription refill"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Patient />
        <Prescription />
      </div>
      <Inventory />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CommonTextfield
          label="Quantity to Dispense"
          type="number"
          variant="outlined"
          slotProps={{
            htmlInput: { min: 0 },
          }}
          value={quantity}
          onChange={(e) => {
            const value = e.target.value;
            setQuantity(value === "" ? null : Number(value));
          }}
          required
        />
      </div>
      <Box display="flex" gap={2}>
        <Button
          sx={{
            bgcolor: "white",
            borderColor: "#d1d5db",
            color: "#4b5563",
            px: 2,
            borderRadius: 2,
            fontSize: "0.875rem",
            fontWeight: 500,
            transition: "background-color 0.3s",
            "&:hover": {
              bgcolor: "#f9fafb",
            },
          }}
          type="button"
          id="cancel-refill"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          sx={{
            bgcolor: "white",
            borderColor: "#fca5a5",
            color: "#b91c1c",
            px: 2,
            borderRadius: 2,
            fontSize: "0.875rem",
            fontWeight: 500,
            transition: "background-color 0.3s",
            "&:hover": {
              bgcolor: "#fef2f2",
            },
          }}
          type="button"
          id="reject-refill"
          variant="outlined"
        >
          Reject Refill
        </Button>
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
          type="submit"
          id="complete-refill"
          variant="contained"
        >
          Complete Refill
        </Button>
      </Box>
    </div>
  );
};

export default ProcessRefillForm;
