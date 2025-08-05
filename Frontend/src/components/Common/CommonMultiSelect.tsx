import { TextField, type TextFieldProps } from "@mui/material";
import { colors } from "../../utils/Constants";
import type React from "react";

type CommonMultiSelectProps = Omit<TextFieldProps, "type" | "select"> & {
  type?: "text" | "email" | "password" | "date" | "number" | "search";
  children?: React.ReactNode;
  isMultiSelect?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

const CommonMultiSelect: React.FC<CommonMultiSelectProps> = ({
  children,
  isMultiSelect = false,
  open,
  onOpen,
  onClose,
  sx,
  ...props
}) => {
  return (
    <TextField
      className="text-sm font-medium text-brown-500 mb-1 w-full px-4 py-3 rounded-lg focus:outline-none"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "0.5rem",
          backgroundColor: colors.beige50,
          "& fieldset": {
            borderColor: colors.beige300,
          },
          "&:hover fieldset": {
            borderColor: colors.brown500,
          },
          "&.Mui-focused fieldset": {
            borderColor: colors.brown500,
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: colors.brown500,
        },
        ...sx,
      }}
      margin="normal"
      fullWidth
      autoFocus
      select={isMultiSelect}
      slotProps={{
        select: {
          multiple: true,
          value: Array.isArray(props.value) ? props.value : [],
          renderValue: (selected) => (selected as string[]).join(", "),
          open,
          onOpen,
          onClose,
        },
      }}
      {...props}
    >
      {isMultiSelect ? children : null}
    </TextField>
  );
};

export default CommonMultiSelect;
