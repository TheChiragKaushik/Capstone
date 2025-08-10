import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  PharmacyNotifications,
  PharmacyNotificationsState,
  SinglePharmacyNotification,
} from "../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../api/api";

const initialState: PharmacyNotificationsState = {
  newNotifications: [],
  newNotificationsCount: 0,
  checkedNotifications: [],
  checkedNotificationsCount: 0,
  status: "idle",
  error: null,
};

export const fetchAllPharmacyNotifications = createAsyncThunk(
  "pharmacy-notifications/fetchAll",
  async (userId: string) => {
    const notificationsResponse = await axios.get(
      `${APIEndpoints.Pharmacy}/notifications/${userId}`
    );

    const data: PharmacyNotifications = notificationsResponse?.data;

    const newNotifs: SinglePharmacyNotification[] = [];
    const checkedNotifs: SinglePharmacyNotification[] = [];

    if (data.refillRequestsNotifications) {
      data.refillRequestsNotifications.forEach((n: any) => {
        const notificationItem: SinglePharmacyNotification = {
          id: n.pharmacyRefillRequestId,
          type: "Refill Request",
          checked: n.checked,
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

    if (data.inventoryRestockReminderNotifications) {
      data.inventoryRestockReminderNotifications.forEach((n: any) => {
        const notificationItem: SinglePharmacyNotification = {
          id: n.inventoryRestockReminderNotificationId,
          type: "Inventory Update",
          checked: n.checked,
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

const pharmacyNotificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPharmacyNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAllPharmacyNotifications.fulfilled,
        (
          state,
          action: PayloadAction<{
            newNotifs: SinglePharmacyNotification[];
            checkedNotifs: SinglePharmacyNotification[];
          }>
        ) => {
          state.status = "succeeded";
          state.newNotifications = action.payload.newNotifs;
          state.newNotificationsCount = action.payload.newNotifs.length;
          state.checkedNotifications = action.payload.checkedNotifs;
          state.checkedNotificationsCount = action.payload.checkedNotifs.length;
        }
      )
      .addCase(fetchAllPharmacyNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch notifications.";
        console.error(action.error);
      });
  },
});

export default pharmacyNotificationsSlice.reducer;
