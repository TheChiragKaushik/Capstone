import type { CommonRouteProps } from "../../../utils/Interfaces";
import { useState } from "react";
import CommonHeading from "../../Common/CommonHeading";
import CommonTextfield from "../../Common/CommonTextfield";
import { Button } from "@mui/material";
import { colors } from "../../../utils/Constants";

const InventoryUpdateForm = ({}: CommonRouteProps) => {
  const [quantity, setQuantity] = useState("");

  return (
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
          value={quantity}
        />
        <CommonTextfield
          variant="outlined"
          size="small"
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
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
          <i className="fas fa-plus mr-2"></i>
          Update Medication
        </Button>
      </div>
    </div>
  );
};

export default InventoryUpdateForm;
