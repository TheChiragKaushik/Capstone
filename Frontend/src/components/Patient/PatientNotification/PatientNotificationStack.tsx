import React from "react";
import { Box, Slide } from "@mui/material";
import PatientNotification from "./PatientNotification";
import type {
  NotificationDialogProps,
  PatientNotificationsRequest,
  RaiseRefillEO,
} from "../../../utils/Interfaces";
import RefillNotification from "./RefillNotification";
import { useAppSelector } from "../../../redux/hooks";

function isPatientNotification(x: any): x is PatientNotificationsRequest {
  return x && typeof x._id === "string";
}

function isRefill(x: any): x is RaiseRefillEO {
  return x && typeof x.raiseRefillId === "string";
}

const PatientNotificationStack: React.FC<NotificationDialogProps> = ({
  navigateToRoute,
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
        if (isPatientNotification(notification)) {
          return (
            <Slide
              key={notification._id}
              direction="up"
              in={true}
              mountOnEnter
              unmountOnExit
            >
              <Box>
                <PatientNotification notification={notification} />
              </Box>
            </Slide>
          );
        }
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
                <RefillNotification
                  notification={notification}
                  navigateToRoute={navigateToRoute}
                />
              </Box>
            </Slide>
          );
        }
        return null;
      })}
    </Box>
  );
};

export default PatientNotificationStack;
