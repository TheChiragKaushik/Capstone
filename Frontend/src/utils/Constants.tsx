import { createTheme, styled } from "@mui/material/styles";
import type {
  AllergyEO,
  InventoryRestockReminderNotification,
  MedicationPrescribed,
  PatientEO,
  PatientNotificationsRequest,
  PharmacyEO,
  PharmacyInventory,
  Prescription,
  ProviderEO,
  RaiseRefillEO,
} from "./Interfaces";
import axios, { type AxiosResponse } from "axios";
import { APIEndpoints } from "../api/api";

export const showOsNotification = (
  message:
    | PatientNotificationsRequest
    | RaiseRefillEO
    | InventoryRestockReminderNotification
) => {
  if (Notification.permission === "granted") {
    const title = "New Notification";
    let body = "";

    if ("inventoryRestockReminderNotificationId" in message) {
      body = message.medicationName
        ? `Inventory restock reminder for: ${message.medicationName}`
        : message.message || "Inventory restock reminder";
    } else if ("raiseRefillId" in message) {
      body = `Refill request received with ID: ${message.raiseRefillId}`;
    } else {
      body = message?.message || "You have a new notification";
    }

    const notification = new Notification(title, {
      body,
      icon: "/path/to/icon.png",
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

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

export const ProviderSpecializations: string[] = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Neurologist",
  "Ophthalmologist",
  "Psychiatrist",
  "Gastroenterologist",
  "Urologist",
];

export const fetchAllAllergies = async () => {
  try {
    const response: AxiosResponse<AllergyEO[]> = await axios.get(
      `${APIEndpoints.Admin}/allergies`
    );
    if (response?.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const ExistingConditions = [
  "Diabetes",
  "Hypertension (High Blood Pressure)",
  "Asthma",
  "Heart Disease",
  "Chronic Kidney Disease",
  "Chronic Obstructive Pulmonary Disease (COPD)",
  "Arthritis",
  "Epilepsy",
  "Cancer",
];

export const MedicationPeriod = [
  { id: 1, label: "Daily" },
  { id: 2, label: "Alternative" },
  { id: 3, label: "Weekly" },
  { id: 4, label: "Bi-weekly" },
  { id: 5, label: "Monthly" },
];

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const StyledCollapseHeader = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  padding: theme.spacing(2),
  backgroundColor: colors.beige100,
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    backgroundColor: colors.beige200,
  },
}));

export const validatePrescriptionSubmitForm = (
  medicationsPrescribed: MedicationPrescribed[],
  newPrescription: Prescription
): string | null => {
  if (medicationsPrescribed.length === 0)
    return "Please prescribe at least one medication.";

  for (let i = 0; i < medicationsPrescribed.length; i++) {
    const med = medicationsPrescribed[i];
    // Medication fields
    if (!med.medicationId)
      return `Medication #${i + 1}: Medication is required.`;
    if (med.medication?.oneTablet) {
      if (!med.totalTabletToTake)
        return `Medication #${i + 1}: Total Tablets to take is required.`;
      if (!med.currentTabletsInHand)
        return `Medication #${i + 1}: Tablets Providing is required.`;
    } else {
      if (!med.totalVolumeToTake)
        return `Medication #${i + 1}: Total Volume to take is required.`;
      if (!med.currentVolumeInhand)
        return `Medication #${i + 1}: Volume Providing is required.`;
    }
    if (
      med.refillsAllowed &&
      (med.refillAlertThreshold === undefined ||
        med.refillAlertThreshold === null)
    ) {
      return `Medication #${i + 1}: Refill Alert Threshold is required when refills are allowed.`;
    }
    if (!med.startDate) return `Medication #${i + 1}: Start Date is required.`;
    if (!med.endDate) return `Medication #${i + 1}: End Date is required.`;
    if (!med.schedule || med.schedule.length === 0)
      return `Medication #${i + 1}: Add at least one schedule.`;
    // Validate each schedule
    for (let j = 0; j < med.schedule.length; j++) {
      const s = med.schedule[j];
      if (!s.period)
        return `Medication #${i + 1}, Schedule #${j + 1}: Period is required.`;
      if (!s.instruction)
        return `Medication #${i + 1}, Schedule #${j + 1}: Instruction is required.`;
      if (!s.scheduledTime)
        return `Medication #${i + 1}, Schedule #${j + 1}: Time is required.`;
      if (med.medication?.oneTablet) {
        if (!s.doseTablets)
          return `Medication #${i + 1}, Schedule #${j + 1}: Dose Tablets is required.`;
      } else {
        if (!s.doseVolume)
          return `Medication #${i + 1}, Schedule #${j + 1}: Dose Volume is required.`;
      }
    }
  }
  if (!newPrescription.prescriptionForDescription)
    return "Prescription For Description is required.";
  return null;
};

export const formattedDateTime = (isoDateString: string): string => {
  return new Date(isoDateString).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export const getRandomLightColor = () => {
  const r = Math.floor(Math.random() * 76) + 180;
  const g = Math.floor(Math.random() * 76) + 180;
  const b = Math.floor(Math.random() * 76) + 180;
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
};

export const isTodayDate = (dateString: string) => {
  const date = new Date(dateString);

  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

export const getMinEndDate = (startDateString: string) => {
  if (!startDateString) return "";

  const startDate = new Date(startDateString);
  startDate.setDate(startDate.getDate() + 1);
  return startDate.toISOString().split("T")[0];
};

export const RelationShipWithUser = [
  "Father",
  "Mother",
  "Brother",
  "Wife",
  "Son",
  "Daughter",
];


export function checkProfileComplete(
  userDetail: PatientEO | ProviderEO | PharmacyEO | undefined,
  type: "Patient" | "Provider" | "Pharmacy"
): boolean {
  if (!userDetail) return false;

  const checkAddress = (address: any) =>
    !!address?.city &&
    !!address?.state &&
    !!address?.street &&
    !!address?.zipCode;

  switch (type) {
    case "Patient": {
      const patient = userDetail as PatientEO;

      const addressComplete = checkAddress(patient.address);

      const emergencyContactComplete =
        !!patient.emergencyContact?.name &&
        !!patient.emergencyContact?.phone &&
        !!patient.emergencyContact?.relationship;

      const medicalInfoComplete =
        !!patient.allergyIds?.length &&
        !!patient.existingConditions?.length;

      const basicInfoComplete =
        !!patient.bloodGroup && !!patient.dateOfBirth;

      return (
        addressComplete &&
        emergencyContactComplete &&
        medicalInfoComplete &&
        basicInfoComplete
      );
    }

    case "Provider": {
      const provider = userDetail as ProviderEO;
      const addressComplete = checkAddress(provider.address);
      return !!provider.specialization && addressComplete;
    }

    case "Pharmacy": {
      const pharmacy = userDetail as PharmacyEO;
      return checkAddress(pharmacy.address);
    }

    default:
      console.warn(`Unknown type "${type}"`);
      return false;
  }
}