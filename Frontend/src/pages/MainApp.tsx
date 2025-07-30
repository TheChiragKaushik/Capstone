import * as React from "react";
import { useEffect } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import type { Session } from "@toolpad/core/AppProvider";
import { useLocation, useNavigate } from "react-router";
import RoleConfig from "../utils/RoleConfig";
import { useDemoRouter } from "@toolpad/core/internal";
import AppTitle from "../components/AppTitle";
import { Account } from "@toolpad/core/Account";
import Button from "@mui/material/Button";
import NotificationPanel from "../components/NotificationPanel";
import { AppTheme } from "../utils/Constants";
import axios from "axios";
import { APIEndpoints } from "../api/api";
import type { PatientEO, PharmacyEO, ProviderEO } from "../utils/Interfaces";
import PatientNotification from "../components/Patient/PatientNotification";
import PharmacyNotification from "../components/Pharmacy/PharmacyNotification";
import {
  addListener,
  connectUserQueue,
  disconnectUserQueue,
  removeListener,
} from "../utils/WebSocket";

const ToolbarActionsSearch = () => {
  const [handleAside, setHandleAside] = React.useState(false);

  const handleToggleAside = () => {
    setHandleAside((prev) => !prev);
  };
  return (
    <>
      <Button onClick={handleToggleAside}>
        <CircleNotificationsIcon />
      </Button>
      <NotificationPanel
        onClose={handleToggleAside}
        visibility={`${handleAside ? "visible" : "hidden"}`}
      />
      <Account />
    </>
  );
};

const MainApp = () => {
  const location = useLocation();
  const { name, email, role, userId } = location.state;

  if (!RoleConfig[role]) {
    throw new Error(`Role "${role}" is not defined in RoleConfig.`);
  }

  const dynamicSession = React.useMemo(() => {
    if (name && email) {
      return {
        user: {
          name,
          email,
        },
      };
    }
    return null;
  }, [name, email]);

  const [user, setUser] = React.useState<
    PatientEO | PharmacyEO | ProviderEO | undefined
  >(undefined);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await axios.get(
          `${APIEndpoints.UserProfile}?${role}Id=${userId}`
        );
        setUser(user.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUserData();

    if (role === "Patient" || role === "Pharmacy") {
      connectUserQueue(role, userId);

      function onUserMessage(message: any, type: any) {
        console.log(`Received ${type} message:`, message);
        alert(message.message);
      }
      addListener(onUserMessage);

      return () => {
        removeListener(onUserMessage);
        disconnectUserQueue();
      };
    }
  }, []);

  const navigate = useNavigate();
  const { navigation, routes } = RoleConfig[role];
  const [session, setSession] = React.useState<Session | null>(dynamicSession);
  const router = useDemoRouter("/dashboard");
  const pathname = router.pathname.replace("/", "") || "dashboard";

  const handleLogout = () => {
    setSession(null);
    navigate("/", { replace: true });
  };

  const authentication = React.useMemo(
    () => ({
      signIn: () => setSession(dynamicSession),
      signOut: handleLogout,
    }),
    []
  );

  const ComponentToRender = routes[pathname] || (() => <h1>Not Found</h1>);

  return (
    <AppProvider
      navigation={navigation}
      router={router}
      theme={AppTheme}
      authentication={authentication}
      session={session}
    >
      <DashboardLayout
        defaultSidebarCollapsed
        slots={{
          appTitle: AppTitle,
          toolbarActions: ToolbarActionsSearch,
        }}
        sx={{
          "& .MuiStack-root > .MuiStack-root:nth-of-type(1)": {
            width: "65%",
            justifyContent: "space-between",
          },
        }}
      >
        <ComponentToRender user={user} userId={userId} pathname={pathname} />
        {role === "Patient" || role === "Pharmacy" ? (
          role === "Patient" ? (
            <PatientNotification />
          ) : (
            <PharmacyNotification />
          )
        ) : null}
      </DashboardLayout>
    </AppProvider>
  );
};

export default MainApp;
