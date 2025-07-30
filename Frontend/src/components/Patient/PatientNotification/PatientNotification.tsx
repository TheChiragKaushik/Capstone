import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Fade,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CloseIcon from "@mui/icons-material/Close";
import type React from "react";

type PatientNotificationProps = {
  message?: string;
  onClose?: () => void;
};
const PatientNotification: React.FC<PatientNotificationProps> = ({
  message = "You have a new notification!",
  onClose,
}) => {
  return (
    <Fade in={true}>
      <Box
        sx={{
          position: "fixed",
          zIndex: 1400,
          right: { xs: "50%", sm: "50%", md: 24 },
          left: { xs: "50%", sm: "50%", md: "auto" },
          transform: {
            xs: "translate(-50%, 0)",
            sm: "translate(-50%, 0)",
            md: "none",
          },
          bottom: 24,
          minWidth: 310,
          maxWidth: 440,
          boxShadow: 6,
        }}
      >
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "background.paper",
            px: 2,
            py: 1,
            borderRadius: 2,
            boxShadow: 3,
          }}
          elevation={5}
        >
          <NotificationsActiveIcon
            color="primary"
            sx={{ mr: 2, fontSize: 32 }}
          />
          <CardContent sx={{ flex: 1, py: 1, px: 0 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {message}
            </Typography>
          </CardContent>
          {onClose && (
            <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Card>
      </Box>
    </Fade>
  );
};

export default PatientNotification;
