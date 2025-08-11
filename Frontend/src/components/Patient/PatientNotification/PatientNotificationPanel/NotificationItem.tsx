import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import type {
  DoseReminderNotification,
  DoseStatusSetRequest,
  MedicationPrescribed,
  PatientNotificationsRequest,
  RaiseRefillNotifications,
  RefillApprovedNotifications,
  SinglePatientNotification,
} from "../../../../utils/Interfaces";
import { useAppDispatch } from "../../../../redux/hooks";
import { APIEndpoints } from "../../../../api/api";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { fetchAllNotifications } from "../../../../redux/features/patientNotificationsSlice";
import { addPatientRaiseRefillNotificationId, removePatientRaiseRefillNotificationId } from "../../../../redux/features/patientRaiseRefillNotificationId";
import type { Router } from "@toolpad/core/AppProvider";
import { colors } from "../../../../utils/Constants";
import { removeAppNotification } from "../../../../redux/features/appNotificationsSlice";

type DoseUpdatePayload = {
  tabletsTaken?: number;
  volumeTaken?: number;
};


const setDoseStatus = async (
  notification: PatientNotificationsRequest,
  payload: DoseStatusSetRequest,
  taken: boolean
) => {
  if (!notification?.patientId) return false;

  try {
    const response = await axios.put(
      `${APIEndpoints.Notifications}/status/${notification.patientId}`,
      payload
    );

    let isTaken: boolean = payload.doseStatusUpdate?.taken ?? taken;
    const checkNotificationPayload = {
      patientId: notification?.patientId,
      fieldToUpdateId: notification?._id,
      taken: isTaken,
    };
    const checkNotification = await axios.put(
      `${APIEndpoints.Patient}/check?dosereminder=true`,
      checkNotificationPayload
    );
    return Boolean(response.data && checkNotification.data);
  } catch (error) {
    return false;
  }
};

type NotificationItemProps = {
  notification?: SinglePatientNotification;
  userId?: string;
  navigateToRoute?: Router;
  onRemove?: (id: string) => void;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  userId,
  navigateToRoute,
}) => {
  const typeOfNotification = notification?.type;
  const dispatch = useAppDispatch();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({ open: false, severity: "success", message: "" });

  const doseReminder =
    typeOfNotification === "Dose Reminder" && notification
      ? (notification?.notification as DoseReminderNotification)
      : null;

  const doseReminderDetails = doseReminder?.notification;

  const doseStatusUpdatePayload = useMemo(() => {
    if (!doseReminder) return null;
    return {
      prescriptionId: doseReminderDetails?.prescriptionId,
      medicationPrescribedId: doseReminderDetails?.medicationPrescribedId,
      date: doseReminderDetails?.dateToTakeOn,
      scheduleId: doseReminderDetails?.scheduleId,
      doseStatusUpdate: {
        scheduleId: doseReminderDetails?.scheduleId,
        taken: undefined,
        tabletsTaken: undefined,
        actualTimeTaken: undefined,
      },
    };
  }, [doseReminder]);

  const handleDoseMarkTaken = async (status: "Taken" | "Missed") => {
    if (!doseReminder || !doseStatusUpdatePayload) {
      console.error("Dose reminder details or payload are missing.");
      return;
    }

    const doseValue = doseReminderDetails?.doseTablets ?? doseReminderDetails?.doseVolume ?? 0;

    const doseUpdatePayload: DoseUpdatePayload = {};
    if (doseReminderDetails?.doseTablets !== null && doseReminderDetails?.doseTablets !== undefined) {
      doseUpdatePayload.tabletsTaken = doseValue;
    } else if (doseReminderDetails?.doseVolume !== null && doseReminderDetails?.doseVolume !== undefined) {
      doseUpdatePayload.volumeTaken = doseValue;
    }

    const now = new Date();
    const actualTimeTaken = now.toTimeString().slice(0, 5);

    const isTaken =
      status === "Taken" ? true : status === "Missed" ? false : false;

    const finalPayload = {
      ...doseStatusUpdatePayload,
      doseStatusUpdate: {
        ...doseStatusUpdatePayload.doseStatusUpdate,
        taken: isTaken,
        ...doseUpdatePayload,
        actualTimeTaken,
      },
    };

    const success = await setDoseStatus(
      doseReminderDetails ?? {},
      finalPayload,
      isTaken
    );
    dispatch(fetchAllNotifications(userId ?? ""));
    dispatch(removeAppNotification(doseReminderDetails?._id ?? ""));

    if (success) {
      setSnackbar({
        open: true,
        severity: "success",
        message: `Marked as ${status.toLowerCase()} successfully.`,
      });
    } else {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Failed to mark as ${status.toLowerCase()}. Please try again.`,
      });
    }
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

  const raiseRefill =
    typeOfNotification === "Refill Request" && notification
      ? (notification?.notification as RaiseRefillNotifications)
      : null;

  const raiseRefillObject = raiseRefill?.raiseRefill;
  const [medicationPrescribed, setMedicationPrescribed] =
    useState<MedicationPrescribed>({});

  useEffect(() => {
    if (typeOfNotification !== "Refill Request") {
      return;
    }
    const getMedicationPrescribed = async () => {
      try {
        const medicationPrescribed = await axios.get(
          `${APIEndpoints.Patient}/medication-prescribed/${raiseRefillObject?.patientId}?PrescriptionId=${raiseRefillObject?.prescriptionId}&MedicationPrescribedId=${raiseRefillObject?.medicationPrescribedId}`
        );
        if (medicationPrescribed.data) {
          setMedicationPrescribed(medicationPrescribed.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getMedicationPrescribed();
  }, [raiseRefillObject]);

  const handleOrderMedicationRefill = async () => {
    dispatch(
      removePatientRaiseRefillNotificationId()
    );

    const checkNotificationPayload = {
      patientId: raiseRefillObject?.patientId,
      fieldToUpdateId: raiseRefillObject?.raiseRefillId,
    };
    const checkNotification = await axios.put(
      `${APIEndpoints.Patient}/check?refillrequest=true`,
      checkNotificationPayload
    );

    if (!checkNotification.data) {
      return;
    }
    dispatch(
      addPatientRaiseRefillNotificationId(raiseRefillObject?.raiseRefillId)
    );
    dispatch(removeAppNotification(raiseRefillObject?.raiseRefillId ?? ""));
    dispatch(fetchAllNotifications(userId ?? ""));
    navigateToRoute?.navigate("refillRequests");
  };

  const approvedRefill =
    typeOfNotification === "Refill Approved" && notification
      ? (notification?.notification as RefillApprovedNotifications)
      : null;

  const approvedRefillObject = approvedRefill?.approvedRefill;

  const handleMedicationRefillApprovedAcknowledge = async () => {
    dispatch(
      removePatientRaiseRefillNotificationId()
    );

    try {
      const checkNotificationPayload = {
        patientId: approvedRefillObject?.patientId,
        fieldToUpdateId: approvedRefillObject?.raiseRefillId,
      };
      const checkNotification = await axios.put(
        `${APIEndpoints.Patient}/check?approvedrefill=true`,
        checkNotificationPayload
      );
      if (!checkNotification.data) {
        return;
      }
    } catch (error) {
      console.error(error);
    }
    dispatch(
      addPatientRaiseRefillNotificationId(approvedRefillObject?.raiseRefillId)
    );
    dispatch(removeAppNotification(approvedRefillObject?.raiseRefillId ?? ""));
    dispatch(fetchAllNotifications(userId ?? ""));
    // navigateToRoute?.navigate("refillRequests");
  };

  return (
    <>
      <>
        {typeOfNotification === "Dose Reminder" ? (
          <>
            {notification?.checked ? (
              <Box
                key={notification?.id}
                className={`p-4 my-2 rounded-lg shadow-sm bg-beige-200 border-l-4 border-brown-600`}
              >
                <Typography variant="body1" fontWeight="bold">
                  {notification?.type} -{" "}
                  {doseReminder?.taken ? "Taken" : "Missed"}
                </Typography>
                <strong>{doseReminderDetails?.medicationName}</strong>
                <div className="text-sm flex flex-col text-brown-400 space-y-1">
                  <p>📅 Schedule time: {doseReminderDetails?.scheduledTime} </p>
                  <p>
                    💊 Medication:{" "}
                    {doseReminderDetails?.doseTablets !== null &&
                      doseReminderDetails?.doseTablets !== undefined
                      ? `${doseReminderDetails?.doseTablets} Tablet`
                      : `${doseReminderDetails?.doseVolume ?? 0} ml`}
                  </p>
                  <p>{doseReminderDetails?.instruction}</p>
                </div>
                <Typography variant="body2">{notification?.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification?.date ?? ""}
                  {" ,"}
                  {doseReminderDetails?.scheduledTime}
                </Typography>
              </Box>
            ) : (
              <Box
                key={notification?.id}
                className={`p-4 my-2 rounded-lg shadow-sm bg-beige-100 border-l-4 border-brown-600`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-brown-600">
                    Time for your medication
                  </h3>
                  <div className="pulse-dot w-2 h-2 bg-brown-500 rounded-full"></div>
                </div>
                <p className="text-brown-500 mb-2">{notification?.message}</p>
                <strong>{doseReminderDetails?.medicationName}</strong>
                <div className="text-sm flex flex-col text-brown-400 space-y-1">
                  <p>📅 Today, {doseReminderDetails?.scheduledTime} </p>
                  <p>
                    💊 Take{" "}
                    {doseReminderDetails?.doseTablets !== null &&
                      doseReminderDetails?.doseTablets !== undefined
                      ? `${doseReminderDetails?.doseTablets} Tablet`
                      : `${doseReminderDetails?.doseVolume ?? 0} ml`}
                  </p>
                  <p>{doseReminderDetails?.instruction}</p>
                </div>
                <div className="flex gap-4">
                  <Button
                    size="small"
                    sx={{
                      backgroundColor: colors.brown500,
                      color: "white",
                      "&:hover": {
                        backgroundColor: colors.brown600,
                      },
                    }}
                    onClick={() => handleDoseMarkTaken("Taken")}
                  >
                    Mark Taken
                  </Button>
                  <Button
                    color="error"
                    sx={{
                      backgroundColor: "#FDDCDC",
                      color: "red",
                      "&:hover": {
                        border: 1,
                        borderColor: "#red",
                      },
                    }}
                    onClick={() => handleDoseMarkTaken("Missed")}
                  >
                    Mark Missed
                  </Button>
                </div>
              </Box>
            )}
          </>
        ) : typeOfNotification === "Refill Request" ? (
          <>
            {notification?.checked ? (
              <Box
                key={notification?.id}
                className={`p-4 my-2 rounded-lg shadow-sm ${notification?.checked
                  ? "border-l-4 border-brown-500 bg-beige-200"
                  : "bg-beige-100 border-l-4 border-brown-500"
                  }`}
              >
                <Typography variant="body1" fontWeight="bold">
                  {notification?.type}
                </Typography>
                <span>Low Stock</span>
                <Typography variant="body2">
                  Your {raiseRefillObject?.medicationName} is running low
                </Typography>
                <div className="text-sm text-brown-400 space-y-1">
                  <p>
                    📦 Only{" "}
                    {medicationPrescribed?.currentTabletsInHand !== null
                      ? medicationPrescribed?.currentTabletsInHand
                      : medicationPrescribed?.currentVolumeInhand}{" "}
                    doses remaining
                  </p>
                  <p>🏪 {notification?.message} </p>
                </div>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification?.date ?? "").toLocaleString()}
                </Typography>
              </Box>
            ) : (
              <Box
                key={notification?.id}
                className={`p-4 my-2 rounded-lg shadow-sm ${notification?.checked
                  ? "border-l-4 border-brown-500 bg-beige-200"
                  : "bg-beige-100 border-l-4 border-brown-500"
                  }`}
              >
                <Typography variant="body1" fontWeight="bold">
                  {notification?.type}
                </Typography>
                <span>Low Stock</span>
                <Typography variant="body2">
                  Your {raiseRefillObject?.medicationName} is running low
                </Typography>
                <div className="text-sm text-brown-400 space-y-1">
                  <p>
                    📦 Only{" "}
                    {medicationPrescribed?.currentTabletsInHand !== null
                      ? medicationPrescribed?.currentTabletsInHand
                      : medicationPrescribed?.currentVolumeInhand}{" "}
                    doses remaining
                  </p>
                  <p>🏪 {notification?.message} </p>
                </div>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification?.date ?? "").toLocaleString()}
                </Typography>
                <Button
                  size="small"
                  sx={{
                    backgroundColor: colors.brown500,
                    color: "white",
                    "&:hover": {
                      backgroundColor: colors.brown600,
                    },
                  }}
                  onClick={handleOrderMedicationRefill}
                >
                  Request Refill
                </Button>
              </Box>
            )}
          </>
        ) : typeOfNotification === "Refill Approved" ? (
          <>
            {notification?.checked ? (
              <Box
                key={notification?.id}
                className={`p-4 my-2 rounded-lg shadow-sm ${notification?.checked
                  ? "border-l-4 border-brown-500 bg-beige-200"
                  : "bg-beige-100 border-l-4 border-brown-500"
                  }`}
              >
                <Typography variant="body1" fontWeight="bold">
                  {notification?.type}
                </Typography>
                <span>Stock Updated</span>
                <Typography variant="body2">
                  Your {approvedRefillObject?.medicationName} is back in stock
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification?.date ?? "").toLocaleString()}
                </Typography>
              </Box>
            ) : (
              <Box
                key={notification?.id}
                className={`p-4 my-2 rounded-lg shadow-sm ${notification?.checked
                  ? "border-l-4 border-brown-500 bg-beige-200"
                  : "bg-beige-100 border-l-4 border-brown-500"
                  }`}
              >
                <Typography variant="body1" fontWeight="bold">
                  {notification?.type}
                </Typography>
                <span>Stock Updated</span>
                <Typography variant="body2">
                  Your {approvedRefillObject?.medicationName} is back in stock
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification?.date ?? "").toLocaleString()}
                </Typography>
                <Button
                  size="small"
                  sx={{
                    backgroundColor: colors.brown500,
                    color: "white",
                    "&:hover": {
                      backgroundColor: colors.brown600,
                    },
                  }}
                  onClick={handleMedicationRefillApprovedAcknowledge}
                >
                  Acknowledge
                </Button>
              </Box>
            )}
          </>
        ) : null}
      </>
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

export default NotificationItem;
