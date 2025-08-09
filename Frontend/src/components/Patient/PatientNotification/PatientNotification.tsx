import { Box, Fade, Button, Snackbar, Alert } from "@mui/material";
import type React from "react";
import type {
  DoseStatusSetRequest,
  PatientNotificationsRequest,
} from "../../../utils/Interfaces";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import { colors } from "../../../utils/Constants";
import { useAppDispatch } from "../../../redux/hooks";
import { fetchAllNotifications } from "../../../redux/features/patientNotificationsSlice";

type PatientNotificationProps = {
  notification?: PatientNotificationsRequest;
  onClose?: () => void;
};

const DEFAULT_RING_ID = "6890a2df83c52777f2a65306";

const PatientNotification: React.FC<PatientNotificationProps> = ({
  notification,
  onClose,
}) => {
  const [sounds, setSounds] = useState<
    { _id: string; url: string; name?: string }[]
  >([]);
  const [defaultRingUrl, setDefaultRingUrl] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({ open: false, severity: "success", message: "" });

  const [doseStatusUpdate] = useState<DoseStatusSetRequest>({
    prescriptionId: notification?.prescriptionId,
    medicationPrescribedId: notification?.medicationPrescribedId,
    date: notification?.dateToTakeOn,
    scheduleId: notification?.scheduleId,
    doseStatusUpdate: {
      scheduleId: notification?.scheduleId,
      taken: undefined,
      tabletsTaken: undefined,
      actualTimeTaken: undefined,
    },
  });

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const fetchAllSounds = async () => {
    try {
      const res = await axios.get(`${APIEndpoints.Admin}/ringtones`);
      if (res.data) {
        setSounds(res.data);
        const defaultSound = res.data.find(
          (sound: { _id: string; url: string; name?: string }) =>
            sound._id === DEFAULT_RING_ID
        );
        setDefaultRingUrl(defaultSound?.url || null);
      }
    } catch (error) {
      console.error("Failed to fetch sounds:", error);
    }
  };

  useEffect(() => {
    fetchAllSounds();
  }, []);

  useEffect(() => {
    if (!sounds.length) return;

    const soundId = notification?.soundUrl;
    let soundToPlayUrl = defaultRingUrl;

    if (soundId) {
      const matchedSound = sounds.find((sound) => sound._id === soundId);
      if (matchedSound) soundToPlayUrl = matchedSound.url;
    }

    if (soundToPlayUrl) {
      const audio = new Audio(soundToPlayUrl);
      audio.loop = true;
      audio.play();
      audioRef.current = audio;
    }

    return () => {
      stopAudio();
    };
  }, [notification, sounds, defaultRingUrl]);

  const setDoseStatus = async (payload: DoseStatusSetRequest) => {
    if (!notification?.patientId) return false;
    try {
      const response = await axios.put(
        `${APIEndpoints.Notifications}/status/${notification.patientId}`,
        payload
      );

      return Boolean(response.data);
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (!onClose) return;
    const timeout = setTimeout(async () => {
      const updatedStatus: DoseStatusSetRequest = {
        ...doseStatusUpdate,
        doseStatusUpdate: {
          ...doseStatusUpdate.doseStatusUpdate,
          scheduleId: notification?.scheduleId,
          taken: false,
          tabletsTaken: 0,
          actualTimeTaken: undefined,
        },
      };

      const sent = await setDoseStatus(updatedStatus);
      dispatch(fetchAllNotifications(notification?.patientId ?? ""));

      if (!sent) {
        setSnackbar({
          open: true,
          severity: "error",
          message:
            "Failed to update medication status due to network or server error.",
        });
      }

      stopAudio();
      if (onClose) onClose();
    }, 60000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  const handleTaken = async () => {
    if (!notification) return;
    let tabletsTaken: number;
    if (
      notification.doseTablets !== null &&
      notification.doseTablets !== undefined
    ) {
      tabletsTaken = notification.doseTablets;
    } else {
      tabletsTaken = notification.doseVolume ?? 0;
    }

    const now = new Date();
    const actualTimeTaken = now.toTimeString().slice(0, 5);

    const success = await setDoseStatus({
      ...doseStatusUpdate,
      doseStatusUpdate: {
        ...doseStatusUpdate.doseStatusUpdate,
        scheduleId: notification.scheduleId,
        taken: true,
        tabletsTaken,
        actualTimeTaken,
      },
    });

    const checkNotificationPayload = {
      patientId: notification?.patientId,
      fieldToUpdateId: notification?._id,
      taken: true,
    };
    const checkNotification = await axios.put(
      `${APIEndpoints.Patient}/check?dosereminder=true`,
      checkNotificationPayload
    );
    dispatch(fetchAllNotifications(notification?.patientId ?? ""));

    if (success && checkNotification) {
      setSnackbar({
        open: true,
        severity: "success",
        message: "Marked as taken successfully.",
      });
    } else {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to mark as taken. Please try again.",
      });
    }

    stopAudio();
    if (onClose) onClose();
  };

  const handleSnackbarClose = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <>
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
          }}
        >
          <div className="bg-white rounded-xl p-6 border-l-4 border-brown-500">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-brown-100 p-3 rounded-full">
                  <i
                    className="fa-solid fa-clock fa-lg"
                    style={{ color: colors.brown500 }}
                  ></i>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-brown-600">
                      Time for your medication
                    </h3>
                    <div className="pulse-dot w-2 h-2 bg-brown-500 rounded-full"></div>
                  </div>
                  <p className="text-brown-500 mb-2">{notification?.message}</p>
                  <strong>{notification?.medicationName}</strong>
                  <div className="text-sm flex flex-col text-brown-400 space-y-1">
                    <p>📅 Today, {notification?.scheduledTime} </p>
                    <p>
                      💊 Take{" "}
                      {notification?.doseTablets !== null &&
                      notification?.doseTablets !== undefined
                        ? `${notification?.doseTablets} Tablet`
                        : `${notification?.doseVolume ?? 0} ml`}
                    </p>
                    <p>{notification?.instruction}</p>
                  </div>
                  <div className="flex items-center space-x-3 mt-10">
                    <Button
                      onClick={handleTaken}
                      sx={{
                        backgroundColor: colors.brown600,
                        color: "white",
                        "&:hover": {
                          backgroundColor: colors.brown700,
                        },
                      }}
                      className="rounded-lg text-sm font-medium hover:bg-brown-600 focus:outline-none focus:ring-2 focus:ring-brown-400"
                    >
                      Mark as Taken
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Fade>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PatientNotification;
