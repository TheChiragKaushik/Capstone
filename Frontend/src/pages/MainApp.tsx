import * as React from "react";
import { useEffect } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import type { Session } from "@toolpad/core/AppProvider";
import { useLocation, useNavigate } from "react-router";
import RoleConfig from "../utils/RoleConfig";
import { useDemoRouter } from "@toolpad/core/internal";
import AppTitle from "../components/MainApp/AppTitle";
import { AppTheme, colors, showOsNotification } from "../utils/Constants";
import axios from "axios";
import { APIEndpoints } from "../api/api";
import type {
  InventoryRestockReminderNotification,
  PatientEO,
  PatientNotificationsRequest,
  PharmacyEO,
  ProviderEO,
  RaiseRefillEO,
} from "../utils/Interfaces";
import {
  addListener,
  connectUserQueue,
  disconnectUserQueue,
  removeListener,
} from "../utils/WebSocket";
import ToolbarActionsSearch from "../components/MainApp/ToolbarActionsSearch";

const MainApp = () => {
  const location = useLocation();
  const { name, email, role, userId } = location.state;

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
  const [session, setSession] = React.useState<Session | null>(dynamicSession);

  const navigate = useNavigate();

  if (!RoleConfig[role]) {
    throw new Error(`Role "${role}" is not defined in RoleConfig.`);
  }

  const handleLogout = () => {
    setSession(null);
    navigate("/logon", { replace: true });
  };

  const authentication = React.useMemo(
    () => ({
      signIn: () => setSession(dynamicSession),
      signOut: handleLogout,
    }),
    []
  );

  const { navigation, routes, notifications } = RoleConfig[role];
  const router = useDemoRouter("/dashboard");
  const pathname = router.pathname.replace("/", "") || "dashboard";

  const NoticiationComponent = notifications?.dialog;
  const ComponentToRender = routes[pathname] || (() => <h1>Not Found</h1>);

  const [user, setUser] = React.useState<
    PatientEO | PharmacyEO | ProviderEO | undefined
  >(undefined);

  const getUserData = async () => {
    try {
      const user = await axios.get(
        `${APIEndpoints.UserProfile}?${role}Id=${userId}`
      );
      const fetchedUser = user.data;
      if (role === "Patient") {
        setUser(fetchedUser as PatientEO);
      } else if (role === "Doctor") {
        setUser(fetchedUser as ProviderEO);
      } else if (role === "Pharmacy") {
        setUser(fetchedUser as PharmacyEO);
      } else {
        setUser(undefined);
        console.warn("Unknown role, cannot assign user type");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const [newNotifications, setNewNotifications] = React.useState<
    | PatientNotificationsRequest[]
    | RaiseRefillEO[]
    | InventoryRestockReminderNotification[]
  >([]);

  const addNotification = (
    notification:
      | PatientNotificationsRequest
      | RaiseRefillEO
      | InventoryRestockReminderNotification
  ) => {
    setNewNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
  };

  const removeNotification = (id: string) => {
    setNewNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => {
        if ("_id" in notification) {
          return notification._id !== id;
        }
        if ("raiseRefillId" in notification) {
          return notification.raiseRefillId !== id;
        }
        if ("inventoryRestockReminderNotificationId" in notification) {
          return notification.inventoryRestockReminderNotificationId !== id;
        }
        return true;
      })
    );
  };

  useEffect(() => {
    getUserData();

    if (role === "Patient" || role === "Pharmacy") {
      connectUserQueue(role, userId);

      const onUserMessage = (
        message:
          | PatientNotificationsRequest
          | RaiseRefillEO
          | InventoryRestockReminderNotification,
        type: string
      ) => {
        console.log(`Received ${type} message:`, message);

        if (role === "Patient" && "raiseRefillId" in message) {
          setTimeout(() => {
            addNotification(message);
            showOsNotification(message);
          }, 2000);
        } else if (
          role === "Pharmacy" &&
          "  inventoryRestockReminderNotificationId" in message
        ) {
          setTimeout(() => {
            addNotification(message);
            showOsNotification(message);
          }, 2000);
        } else {
          addNotification(message);
          showOsNotification(message);
        }
      };

      addListener(onUserMessage);

      return () => {
        removeListener(onUserMessage);
        disconnectUserQueue();
      };
    }
  }, []);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }, []);

  return (
    <>
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
            toolbarActions: () => (
              <ToolbarActionsSearch
                role={role}
                user={user}
                navigateToRoute={router}
              />
            ),
          }}
          sx={{
            "& .MuiStack-root > .MuiStack-root:nth-of-type(1)": {
              width: {
                xs: "70%",
                sm: "65%",
              },
              justifyContent: "space-between",
            },
            "& .MuiPaper-root": {
              background: colors.beige100,
            },
          }}
        >
          <ComponentToRender
            user={user}
            userId={userId}
            pathname={pathname}
            navigateToRoute={router}
          />
        </DashboardLayout>
      </AppProvider>

      {NoticiationComponent && (
        <NoticiationComponent
          notifications={newNotifications}
          onRemove={removeNotification}
          navigateToRoute={router}
          userId={user?._id}
        />
      )}
    </>
  );
};

export default MainApp;
