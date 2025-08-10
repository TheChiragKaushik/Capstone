import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  NotificationsState,
  PatientNotifications,
  SinglePatientNotification,
} from "../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../api/api";

const initialState: NotificationsState = {
  newNotifications: [],
  newNotificationsCount: 0,
  checkedNotifications: [],
  checkedNotificationsCount: 0,
  status: "idle",
  error: null,
};

export const fetchAllNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (userId: string) => {
    const notificationsResponse = await axios.get(
      `${APIEndpoints.Patient}/notifications/${userId}`
    );
    const data: PatientNotifications = notificationsResponse.data;

    const newNotifs: SinglePatientNotification[] = [];
    const checkedNotifs: SinglePatientNotification[] = [];

    if (data?.doseReminderNotifications) {
      data.doseReminderNotifications.forEach((n: any) => {
        const notificationItem: SinglePatientNotification = {
          id: n.doseReminderNotificationId,
          type: "Dose Reminder",
          checked: n.checked,
          message: n?.notification?.message,
          date: n?.notification?.dateToTakeOn,
          notification: n,
        };
        if (n.checked) {
          checkedNotifs.push(notificationItem);
        } else {
          newNotifs.push(notificationItem);
        }
      });
    }

    if (data?.raiseRefillNotifications) {
      data.raiseRefillNotifications.forEach((n: any) => {
        const notificationItem: SinglePatientNotification = {
          id: n.raiseRefillNotificationId,
          type: "Refill Request",
          checked: n.checked,
          message: n.raiseRefill.message,
          date: new Date().toISOString(),
          notification: n,
        };
        if (n.checked) {
          checkedNotifs.push(notificationItem);
        } else {
          newNotifs.push(notificationItem);
        }
      });
    }

    if (data?.refillApprovedNotifications) {
      data.refillApprovedNotifications.forEach((n: any) => {
        const notificationItem: SinglePatientNotification = {
          id: n.refillApproveNotificationId,
          type: "Refill Approved",
          checked: n.checked,
          message: n.approvedRefill.message,
          date: new Date().toISOString(),
          notification: n,
        };
        if (n.checked) {
          checkedNotifs.push(notificationItem);
        } else {
          newNotifs.push(notificationItem);
        }
      });
    }

    return { newNotifs, checkedNotifs };
  }
);

const patientNotificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAllNotifications.fulfilled,
        (
          state,
          action: PayloadAction<{
            newNotifs: SinglePatientNotification[];
            checkedNotifs: SinglePatientNotification[];
          }>
        ) => {
          state.status = "succeeded";
          state.newNotifications = action.payload.newNotifs;
          state.newNotificationsCount = action.payload.newNotifs.length;
          state.checkedNotifications = action.payload.checkedNotifs;
          state.checkedNotificationsCount = action.payload.checkedNotifs.length;
        }
      )
      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch notifications.";
        console.error(action.error);
      });
  },
});

export default patientNotificationsSlice.reducer;
