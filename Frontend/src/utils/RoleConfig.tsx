import type { RoleConfiguration, RouteComponentProps } from "./Interfaces";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TodayIcon from "@mui/icons-material/Today";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import RepeatOneOnIcon from "@mui/icons-material/RepeatOneOn";
import GridViewIcon from "@mui/icons-material/GridView";
import PatientDashboard from "../components/Patient/PatientDashboard/PatientDashboard";
import PatientReminders from "../components/Patient/PatientReminders/PatientReminders";
import PatientRefillRequests from "../components/Patient/PatientRefillRequests/PatientRefillRequests";
import PatientCalender from "../components/Patient/PatientCalender/PatientCalender";
import PatientProfile from "../components/Patient/PatientProfile/PatientProfile";
import PatientNotification from "../components/Patient/PatientNotification/PatientNotification";
import PatientNotificationPanel from "../components/Patient/PatientNotification/PatientNotificationPanel";

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
      dashboard: (props: RouteComponentProps) => (
        <PatientDashboard {...props} />
      ),
      reminders: (props: RouteComponentProps) => (
        <PatientReminders {...props} />
      ),
      refillRequests: (props: RouteComponentProps) => (
        <PatientRefillRequests {...props} />
      ),
      calender: (props: RouteComponentProps) => <PatientCalender {...props} />,
      profile: (props: RouteComponentProps) => <PatientProfile {...props} />,
    },
    notifications: {
      panel: PatientNotificationPanel,
      dialog: PatientNotification,
    },
  },
  Provider: {
    navigation: [
      {
        kind: "header",
        title: "Main items",
      },
      {
        segment: "dashboard",
        title: "Dashboard",
        icon: <DashboardIcon />,
      },
      {
        segment: "orders",
        title: "Orders",
        icon: <ShoppingCartIcon />,
      },
    ],
    routes: {
      dashboard: () => <h1>Dahsboard</h1>,
      orders: () => <h1>Orders</h1>,
    },
  },
  Pharmacy: {
    navigation: [
      {
        kind: "header",
        title: "Main items",
      },
      {
        segment: "dashboard",
        title: "Dashboard",
        icon: <DashboardIcon />,
      },
      {
        segment: "orders",
        title: "Orders",
        icon: <ShoppingCartIcon />,
      },
    ],
    routes: {
      dashboard: () => <h1>Dashboard</h1>,
      orders: () => <h1>Orders</h1>,
    },
    notifications: {
      panel: PatientNotificationPanel,
      dialog: PatientNotification,
    },
  },
};

export default RoleConfig;
