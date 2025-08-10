import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  InventoryRestockReminderNotification,
  PatientNotificationsRequest,
  RaiseRefillEO,
} from "../../utils/Interfaces";

type AppNotificationItem =
  | PatientNotificationsRequest
  | RaiseRefillEO
  | InventoryRestockReminderNotification;

interface AppNotificationState {
  notifications: AppNotificationItem[];
}

const initialState: AppNotificationState = {
  notifications: [],
};

const appNotificationSlice = createSlice({
  name: "appNotification",
  initialState,
  reducers: {
    addAppNotification: (state, action: PayloadAction<AppNotificationItem>) => {
      state.notifications.push(action.payload);
    },
    removeAppNotification: (state, action: PayloadAction<string>) => {
      const idToRemove = action.payload;

      state.notifications = state.notifications.filter((notification) => {
        if ("_id" in notification) {
          return notification._id !== idToRemove;
        }
        if ("raiseRefillId" in notification) {
          return notification.raiseRefillId !== idToRemove;
        }
        if ("inventoryRestockReminderNotificationId" in notification) {
          return (
            notification.inventoryRestockReminderNotificationId !== idToRemove
          );
        }
        return true;
      });
    },
  },
});

export const { addAppNotification, removeAppNotification } =
  appNotificationSlice.actions;
export default appNotificationSlice.reducer;
