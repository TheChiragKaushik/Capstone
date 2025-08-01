import type { CommonRouteProps, RoleConfiguration } from "./Interfaces";

// Components
import PatientDashboard from "../components/Patient/PatientDashboard/PatientDashboard";
import PatientReminders from "../components/Patient/PatientReminders/PatientReminders";
import PatientRefillRequests from "../components/Patient/PatientRefillRequests/PatientRefillRequests";
import PatientCalender from "../components/Patient/PatientCalender/PatientCalender";
import PatientProfile from "../components/Patient/PatientProfile/PatientProfile";
// import PatientNotification from "../components/Patient/PatientNotification/PatientNotification";
import PatientNotificationPanel from "../components/Patient/PatientNotification/PatientNotificationPanel";
import ProviderDashboard from "../components/Provider/ProviderDashboard/ProviderDashboard";
import PrescribeMedication from "../components/Provider/PrescribeMedication/PrescribeMedication";
import PharmacyDashboard from "../components/Pharmacy/PharmacyDashboard/PharmacyDashboard";
// import PharmacyNotification from "../components/Pharmacy/PharmacyNotification/PharmacyNotification";
import PharmacyNotificationPanel from "../components/Pharmacy/PharmacyNotification/PharmacyNotificationPanel";
import ProcessRefill from "../components/Pharmacy/ProcessRefill/ProcessRefill";
import InventoryUpdate from "../components/Pharmacy/InventoryUpdate/InventoryUpdate";

// Icons
import TodayIcon from "@mui/icons-material/Today";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import RepeatOneOnIcon from "@mui/icons-material/RepeatOneOn";
import GridViewIcon from "@mui/icons-material/GridView";
import InventoryIcon from "@mui/icons-material/Inventory";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ProcessRefillForm from "../components/Pharmacy/ProcessRefill/ProcessRefillForm";
import ProviderProfile from "../components/Provider/PatientProfile/PatientProfile";
import PharmacyProfile from "../components/Pharmacy/PharmacyProfile/PharmacyProfile";

const RoleConfig: RoleConfiguration = {
  Patient: {
    navigation: [
      {
        segment: "dashboard",
        title: "Dashboard",
        icon: <GridViewIcon />,
      },
      {
        segment: "reminders",
        title: "Reminders",
        icon: <HistoryToggleOffIcon />,
      },
      {
        segment: "refillRequests",
        title: "Refill Requests",
        icon: <RepeatOneOnIcon />,
      },
      {
        segment: "calender",
        title: "Calender",
        icon: <TodayIcon />,
      },
      {
        segment: "profile",
        title: "Profile",
        icon: <AccountBoxIcon />,
      },
    ],
    routes: {
      dashboard: (props: CommonRouteProps) => <PatientDashboard {...props} />,
      reminders: (props: CommonRouteProps) => <PatientReminders {...props} />,
      refillRequests: (props: CommonRouteProps) => (
        <PatientRefillRequests {...props} />
      ),
      calender: (props: CommonRouteProps) => <PatientCalender {...props} />,
      profile: (props: CommonRouteProps) => <PatientProfile {...props} />,
    },
    notifications: {
      panel: PatientNotificationPanel,
      // dialog: PatientNotification,
    },
  },
  Provider: {
    navigation: [
      {
        segment: "dashboard",
        title: "Dashboard",
        icon: <GridViewIcon />,
      },
      {
        segment: "profile",
        title: "Profile",
        icon: <AccountBoxIcon />,
      },
    ],
    routes: {
      dashboard: (props: CommonRouteProps) => <ProviderDashboard {...props} />,
      prescribeMedication: (props: CommonRouteProps) => (
        <PrescribeMedication {...props} />
      ),
      profile: (props: CommonRouteProps) => <ProviderProfile {...props} />,
    },
  },
  Pharmacy: {
    navigation: [
      {
        segment: "dashboard",
        title: "Dashboard",
        icon: <GridViewIcon />,
      },
      {
        segment: "processRefill",
        title: "Process Refill",
        icon: <AutorenewIcon />,
      },
      {
        segment: "inventoryUpdate",
        title: "Inventory Update",
        icon: <InventoryIcon />,
      },
      {
        segment: "profile",
        title: "Profile",
        icon: <AccountBoxIcon />,
      },
    ],
    routes: {
      dashboard: (props: CommonRouteProps) => <PharmacyDashboard {...props} />,
      processRefill: (props: CommonRouteProps) => <ProcessRefill {...props} />,
      inventoryUpdate: (props: CommonRouteProps) => (
        <InventoryUpdate {...props} />
      ),
      processRefillForm: (props: CommonRouteProps) => (
        <ProcessRefillForm {...props} />
      ),
      profile: (props: CommonRouteProps) => <PharmacyProfile {...props} />,
    },
    notifications: {
      panel: PharmacyNotificationPanel,
      // dialog: PharmacyNotification,
    },
  },
};

export default RoleConfig;
