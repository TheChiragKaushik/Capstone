import { Box, Slide } from "@mui/material";
import type { RaiseRefillEO } from "../../../utils/Interfaces";
import PatientNotification from "../../Patient/PatientNotification/PatientNotification";

type PharmacyNotificationStackProps = {
  notifications?: RaiseRefillEO[];
  onRemove?: (id: string) => void;
};

const PharmacyNotificationStack: React.FC<PharmacyNotificationStackProps> = ({
  notifications = [],
  onRemove = () => {},
}) => (
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
    {notifications.map((notification) => (
      <Slide
        key={notification.raiseRefillId}
        direction="up"
        in={true}
        mountOnEnter
        unmountOnExit
      >
        <Box>
          <PatientNotification
            notification={notification}
            onClose={() => onRemove(notification?.raiseRefillId ?? "")}
          />
        </Box>
      </Slide>
    ))}
  </Box>
);

export default PharmacyNotificationStack;
