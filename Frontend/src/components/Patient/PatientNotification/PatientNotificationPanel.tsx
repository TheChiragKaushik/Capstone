import Box from "@mui/material/Box";
import type React from "react";
import type { NotificationPanelProps } from "../../../utils/Interfaces";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { colors } from "../../../utils/Constants";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchAllNotifications } from "../../../redux/features/patientNotificationsSlice";
import NotificationItem from "./PatientNotificationPanel/NotificationItem";

type NotificationType = "New" | "Checked";
const PatientNotificationPanel: React.FC<NotificationPanelProps> = ({
  visibility,
  onClose,
  userId,
  navigateToRoute
}) => {
  const [activeNotificationType, setActiveNotificationType] =
    useState<NotificationType>("New");

  const dispatch = useAppDispatch();
  const { newNotifications, checkedNotifications } = useAppSelector(
    (state) => state.patientNotifications
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchAllNotifications(userId));
    }
  }, [dispatch, userId]);

  return (
    <>
      {visibility === "visible" && (
        <div
          className="fixed inset-0 bg-beige-50 opacity-85 z-40 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
        ></div>
      )}
      <Box
        className={`fixed overflow-y-auto top-0 right-0 h-screen w-2/3 md:w-1/2 bg-beige-50 shadow-lg transform transition-transform duration-300 ease-in-out z-50
          ${visibility === "visible" ? "translate-x-0" : "translate-x-full"}`}
        sx={{}}
      >
        <div className="bg-beige-100 flex justify-center items-center p-4 border-b border-gray-200">
          <h2 className="Heading">Patient Notifications</h2>
        </div>

        <div className="flex flex-col relative justify-center py-4">
          <div className="bg-beige-400 sticky top-10 flex items-center rounded-full justify-center mx-16">
            <Typography
              sx={{
                width: "100%",
                display: "flex",
                backgroundColor:
                  activeNotificationType === "New" ? colors.brown500 : null,
                padding: 1,
                alignItems: "center",
                fontWeight: 900,
                color: "white",
                justifyContent: "center",
                fontSize: {
                  xs: 8,
                  md: 15,
                },
              }}
              className="rounded-full cursor-pointer"
              onClick={() =>
                setActiveNotificationType((prev) =>
                  prev === "New" ? "Checked" : "New"
                )
              }
            >
              New
            </Typography>
            <Typography
              className="rounded-full cursor-pointer"
              onClick={() =>
                setActiveNotificationType((prev) =>
                  prev === "New" ? "Checked" : "New"
                )
              }
              sx={{
                width: "100%",
                display: "flex",
                backgroundColor:
                  activeNotificationType === "Checked" ? colors.brown500 : null,
                padding: 1,
                color: "white",
                fontWeight: 900,
                alignItems: "center",
                justifyContent: "center",
                fontSize: {
                  xs: 8,
                  md: 15,
                },
              }}
            >
              Checked
            </Typography>
          </div>
          <div className="p-4">
            {activeNotificationType === "New" ? (
              newNotifications && newNotifications.length > 0 ? (
                newNotifications.map((notification, index) => (
                  <NotificationItem
                    notification={notification}
                    key={notification?.id ?? "" + index}
                    userId={userId}
                    navigateToRoute={navigateToRoute}
                  />
                ))
              ) : (
                <Typography className="text-center text-gray-500 my-4">
                  No new notifications.
                </Typography>
              )
            ) : activeNotificationType === "Checked" ? (
              checkedNotifications && checkedNotifications.length > 0 ? (
                checkedNotifications.map((notification, index) => (
                  <NotificationItem
                    notification={notification}
                    key={notification?.id ?? "" + index}
                    userId={userId}
                    navigateToRoute={navigateToRoute}
                  />
                ))
              ) : (
                <Typography className="text-center text-gray-500 my-4">
                  No checked notifications.
                </Typography>
              )
            ) : null}
          </div>
        </div>
      </Box>
    </>
  );
};

export default PatientNotificationPanel;
