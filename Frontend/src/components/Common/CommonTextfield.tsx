import { TextField, type TextFieldProps } from "@mui/material";
import { colors } from "../../utils/Constants";
import type React from "react";
type CommonTextfieldProps = Omit<TextFieldProps, "type"> & {
  type?: "text" | "email" | "password" | "date" | "number";
  isSelect?: boolean;
  children?: React.ReactNode;
};

const CommonTextfield: React.FC<CommonTextfieldProps> = ({
  children,
  isSelect,
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
      select={isSelect}
      {...props}
    >
      {isSelect ? children : null}
    </TextField>
  );
};

export default CommonTextfield;
