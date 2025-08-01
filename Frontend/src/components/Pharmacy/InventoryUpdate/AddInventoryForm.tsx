import type { CommonRouteProps } from "../../../utils/Interfaces";
import { useState } from "react";
import CommonHeading from "../../Common/CommonHeading";
import CommonTextfield from "../../Common/CommonTextfield";
import { Button, MenuItem } from "@mui/material";
import { colors } from "../../../utils/Constants";

const AddInventoryForm = ({}: CommonRouteProps) => {
  const [quantity, setQuantity] = useState("");

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mt-6 mb-2">
      <CommonHeading
        heading="Add Inventory"
        subHeading="Add medication stock"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CommonTextfield
          variant="outlined"
          isSelect
          size="small"
          label="New Medication"
        >
          <MenuItem>1</MenuItem>
          <MenuItem>2</MenuItem>
          <MenuItem>3</MenuItem>
          <MenuItem>4</MenuItem>
        </CommonTextfield>
        <CommonTextfield
          variant="outlined"
          size="small"
          label="Max Stock"
          value={quantity}
        />
        <CommonTextfield
          variant="outlined"
          size="small"
          label="Current Intake Stock"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <CommonTextfield
          variant="outlined"
          size="small"
          label="Re-Order Threshold"
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

export default AddInventoryForm;
