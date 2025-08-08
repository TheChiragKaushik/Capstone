import Box from "@mui/material/Box";
import type React from "react";
import type { NotificationPanelProps } from "../../../utils/Interfaces";
import { Typography } from "@mui/material";
import { useState } from "react";
import { colors } from "../../../utils/Constants";

type NotificationType = "Dose Reminder" | "Raise Refill" | "Approved Refill";
const PatientNotificationPanel: React.FC<NotificationPanelProps> = ({
  visibility,
  onClose,
}) => {
  const [activeNotificationType, setActiveNotificationType] =
    useState<NotificationType>("Dose Reminder");
  return (
    <>
      {visibility === "visible" && (
        <div
          className="fixed inset-0 bg-beige-50 opacity-85 z-40 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
        ></div>
      )}
      <Box
        className={`fixed top-0 right-0 h-screen w-2/3 md:w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
          ${visibility === "visible" ? "translate-x-0" : "translate-x-full"}`}
        sx={{}}
      >
        <div className="bg-beige-100 flex justify-center items-center p-4 border-b border-gray-200">
          <h2 className="Heading">Patient Notifications</h2>
        </div>

        <div className="bg-beige-50 flex flex-col items-center h-screen py-4">
          <div className="w-full grid grid-cols-3 place-items-center place-content-between border-b-2 border-b-brown-500 pt-2">
            <Typography
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: {
                  xs: 8,
                  md: 15,
                },
              }}
            >
              Dose Reminders
            </Typography>
            <Typography
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderLeft: 2,
                borderLeftColor: colors.brown500,
                borderRight: 2,
                borderRightColor: colors.brown500,
                fontSize: {
                  xs: 8,
                  md: 15,
                },
              }}
            >
              Raise Refill
            </Typography>
            <Typography
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: {
                  xs: 8,
                  md: 15,
                },
              }}
            >
              Approved Refills
            </Typography>
          </div>
          <div className="w-full grid grid-cols-2 place-items-center place-content-between  border-b-2 border-b-brown-500 pt-4">
            <Typography
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: 2,
                borderRightColor: colors.brown500,
                fontSize: {
                  xs: 8,
                  md: 15,
                },
              }}
            >
              New
            </Typography>
            <Typography
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderLeftColor: colors.brown500,
                fontSize: {
                  xs: 8,
                  md: 15,
                },
              }}
            >
              Checked
            </Typography>
          </div>
        </div>
      </Box>
    </>
  );
};

export default PatientNotificationPanel;
