import { Box, Slide } from "@mui/material";
import type {
  InventoryRestockReminderNotification,
  NotificationDialogProps,
  RaiseRefillEO,
} from "../../../utils/Interfaces";
import PharmacyRefillNotification from "./PharmacyRefillNotification";
import PharmacyInventoryNotification from "./PharmacyInventoryNotification";
import { useAppSelector } from "../../../redux/hooks";

function isRefill(x: any): x is RaiseRefillEO {
  return x && typeof x.raiseRefillId === "string";
}

function isInventory(x: any): x is InventoryRestockReminderNotification {
  return x && typeof x.inventoryRestockReminderNotificationId === "string";
}


const PharmacyNotificationStack: React.FC<NotificationDialogProps> = ({
  navigateToRoute,
  userId,
}) => {
  const notifications = useAppSelector(
    (state) => state.appNotifications.notifications
  );
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1400,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "flex-end",
      }}
    >
      {notifications.map((notification) => {
        if (isRefill(notification)) {
          return (
            <Slide
              key={notification.raiseRefillId}
              direction="up"
              in={true}
              mountOnEnter
              unmountOnExit
            >
              <Box>
                <PharmacyRefillNotification
                  notification={notification}
                  navigateToRoute={navigateToRoute}
                  userId={userId}
                />
              </Box>
            </Slide>
          );
        }
        if (isInventory(notification)) {
          return (
            <Slide
              key={notification.inventoryRestockReminderNotificationId}
              direction="up"
              in={true}
              mountOnEnter
              unmountOnExit
            >
              <Box>
                <PharmacyInventoryNotification
                  notification={notification}
                  navigateToRoute={navigateToRoute}
                  userId={userId}
                />
              </Box>
            </Slide>
          );
        }
      })}
    </Box>
  );
};

export default PharmacyNotificationStack;
