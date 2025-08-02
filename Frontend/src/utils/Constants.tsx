import { createTheme } from "@mui/material/styles";
import type { PharmacyInventory } from "./Interfaces";

export const AppTheme = createTheme({
  palette: {
    primary: {
      main: "#4F46E5",
    },
    secondary: {
      main: "#10B981",
    },
    background: {
      default: "#fdfbf7",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.5rem",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          textTransform: "none",
          fontWeight: 700,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "1rem",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

export const colors = {
  beige50: "oklch(0.9885 0.0057 84.57)",
  beige100: "oklch(0.971 0.0114 84.58)",
  beige200: "oklch(0.9385 0.0254 86.87)",
  beige300: "oklch(0.8968 0.0395 87.57)",
  beige400: "oklch(0.8386 0.0533 89.04)",
  brown50: "oklch(0.9741 0.0034 67.78)",
  brown100: "oklch(0.9108 0.0139 67.65)",
  brown200: "oklch(0.8109 0.0353 71.57)",
  brown300: "oklch(0.7162 0.0542 74.44)",
  brown400: "oklch(0.6032 0.0666 72.41)",
  brown500: "oklch(0.5083 0.0606 67.57)",
  brown600: "oklch(0.4388 0.0508 68.1)",
  brown700: "oklch(0.3655 0.0414 64.47)",
  brown800: "oklch(0.2896 0.0294 61.86)",
  brown900: "oklch(0.2125 0.0172 58.53)",
};

export const stringAvatar = (name: string) => {
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return {
    sx: {
      bgcolor: colors.brown500,
    },
    children: `${first}${second}` || first,
  };
};

export const genderDropdownValues = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

export const bloodGroupDropdownValues = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

export const IndicatorLegend = ({
  indicatorStyle,
  heading,
}: {
  indicatorStyle?: string;
  heading?: string;
}) => {
  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 ${indicatorStyle} rounded-full mr-2`}></div>
      <span className="text-xs text-brown-500">{heading}</span>
    </div>
  );
};

export const MedicationForTypes: string[] = [
  "Pain Relievers (Analgesics)",
  "Antibiotics",
  "Antivirals",
  "Antifungals",
  "Antihistamines",
  "Antidepressants",
  "Antianxiety Medications",
  "Antihypertensives (for Blood Pressure)",
  "Antidiabetics (for Diabetes)",
  "Statins (for Cholesterol)",
  "Anti-inflammatories",
  "Antacids",
  "Anticonvulsants",
  "Antineoplastics (for Cancer)",
  "Hormone Replacements",
  "Bronchodilators (for Respiratory issues)",
  "Anticoagulants (Blood Thinners)",
];

export const ErrorPlaceholder = () => (
  <span style={{ visibility: "hidden" }}>ErrorPlaceholder</span>
);

export const getStatus = (item: PharmacyInventory) => {
  if (
    item.currentStockTablets !== undefined &&
    item.reorderThresholdTablets !== undefined
  ) {
    if (item.currentStockTablets === 0 || item.currentStockTablets === null)
      return { status: "Out of Stock", color: "red" };
    if (item.currentStockTablets < item.reorderThresholdTablets)
      return { status: "Low Stock", color: "yellow" };
    return { status: "In Stock", color: "green" };
  }
  if (
    item.currentStockVolume !== undefined &&
    item.reorderThresholdVolume !== undefined
  ) {
    if (item.currentStockVolume === 0 || item.currentStockTablets === null)
      return { status: "Out of Stock", color: "red" };
    if (item.currentStockVolume <= item.reorderThresholdVolume)
      return { status: "Low Stock", color: "yellow" };
    return { status: "In Stock", color: "green" };
  }
  return { status: "Unknown", color: "gray" };
};
