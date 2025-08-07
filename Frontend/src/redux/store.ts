import { configureStore } from "@reduxjs/toolkit";
import { patientRaiseRefillNotificationIdSlice } from "./features/patientRaiseRefillNotificationId";
import { pharmacyProcessRefillNotificationIdSlice } from "./features/pharmacyProcessRefillNotificationIdSlice";
import { pharmacyUpdateInventoryNotificationIdSlice } from "./features/pharmacyUpdateInventoryNotificationIdSlice";

export const capstoneStore = configureStore({
  reducer: {
    patientRaiseRefillNotification:
      patientRaiseRefillNotificationIdSlice.reducer,
    pharmacyProcessRefillNotification:
      pharmacyProcessRefillNotificationIdSlice.reducer,
    pharmacyUpdateInventoryNotification:
      pharmacyUpdateInventoryNotificationIdSlice.reducer,
  },
});

export type RootState = ReturnType<typeof capstoneStore.getState>;
export type AppDispatch = typeof capstoneStore.dispatch;
