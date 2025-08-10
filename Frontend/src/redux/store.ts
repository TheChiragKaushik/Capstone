import { configureStore } from "@reduxjs/toolkit";
import { patientRaiseRefillNotificationIdSlice } from "./features/patientRaiseRefillNotificationId";
import { pharmacyProcessRefillNotificationIdSlice } from "./features/pharmacyProcessRefillNotificationIdSlice";
import { pharmacyUpdateInventoryNotificationIdSlice } from "./features/pharmacyUpdateInventoryNotificationIdSlice";
import patientNotificationsSlice from "./features/patientNotificationsSlice";
import pharmacyNotificationsSlice from "./features/pharmacyNotificationsSlice";

export const capstoneStore = configureStore({
  reducer: {
    patientNotifications: patientNotificationsSlice,
    patientRaiseRefillNotification:
      patientRaiseRefillNotificationIdSlice.reducer,
    pharmacyNotifications: pharmacyNotificationsSlice,
    pharmacyProcessRefillNotification:
      pharmacyProcessRefillNotificationIdSlice.reducer,
    pharmacyUpdateInventoryNotification:
      pharmacyUpdateInventoryNotificationIdSlice.reducer,
  },
});

export type RootState = ReturnType<typeof capstoneStore.getState>;
export type AppDispatch = typeof capstoneStore.dispatch;
