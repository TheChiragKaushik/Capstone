import Box from "@mui/material/Box";
import type React from "react";
import type { NotificationPanelProps } from "../../../utils/Interfaces";

const PatientNotificationPanel: React.FC<NotificationPanelProps> = ({
  visibility,
  onClose,
}) => {
  return (
    <>
      {visibility === "visible" && (
        <div
          className="fixed inset-0 bg-white opacity-85 z-40 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
        ></div>
      )}
      <Box
        className={`fixed top-0 right-0 h-screen w-1/3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
          ${visibility === "visible" ? "translate-x-0" : "translate-x-full"}`}
        sx={{}}
      >
        <div className="flex justify-center items-center p-4 border-b border-gray-200">
          <h2 className="Heading">Patient Notifications</h2>
        </div>

        <div className="p-4"></div>
      </Box>
    </>
  );
};

export default PatientNotificationPanel;
