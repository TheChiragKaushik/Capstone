import type { CommonRouteProps, RoleConfiguration } from "./Interfaces";

// Components
import PatientDashboard from "../components/Patient/PatientDashboard/PatientDashboard";
import PatientRefillRequests from "../components/Patient/PatientRefillRequests/PatientRefillRequests";
import PatientCalender from "../components/Patient/PatientCalender/PatientCalender";
import PatientProfile from "../components/Patient/PatientProfile/PatientProfile";
import PatientNotificationPanel from "../components/Patient/PatientNotification/PatientNotificationPanel";
import PharmacyDashboard from "../components/Pharmacy/PharmacyDashboard/PharmacyDashboard";
import PharmacyNotificationPanel from "../components/Pharmacy/PharmacyNotification/PharmacyNotificationPanel";
import ProcessRefill from "../components/Pharmacy/ProcessRefill/ProcessRefill";
import InventoryUpdate from "../components/Pharmacy/InventoryUpdate/InventoryUpdate";

// Icons
import TodayIcon from "@mui/icons-material/Today";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import RepeatOneOnIcon from "@mui/icons-material/RepeatOneOn";
import GridViewIcon from "@mui/icons-material/GridView";
import InventoryIcon from "@mui/icons-material/Inventory";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ProcessRefillForm from "../components/Pharmacy/ProcessRefill/ProcessRefillForm";
import ProviderProfile from "../components/Provider/ProviderProfile/ProviderProfile";
import PharmacyProfile from "../components/Pharmacy/PharmacyProfile/PharmacyProfile";
import NewPrescription from "../components/Provider/NewPrescription/NewPrescription";
import PatientNotificationStack from "../components/Patient/PatientNotification/PatientNotificationStackProps";
import PharmacyNotificationStack from "../components/Pharmacy/PharmacyNotification/PharmacyNotificationStack";

const RoleConfig: RoleConfiguration = {
  Patient: {
    navigation: [
      {
        segment: "dashboard",
        title: "Dashboard",
        icon: <GridViewIcon />,
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
      refillRequests: (props: CommonRouteProps) => (
        <PatientRefillRequests {...props} />
      ),
      calender: (props: CommonRouteProps) => <PatientCalender {...props} />,
      profile: (props: CommonRouteProps) => <PatientProfile {...props} />,
    },
    notifications: {
      panel: PatientNotificationPanel,
      dialog: PatientNotificationStack,
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
      dashboard: (props: CommonRouteProps) => <NewPrescription {...props} />,
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
      dialog: PharmacyNotificationStack,
    },
  },
};

export default RoleConfig;
