import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};
export const pharmacyProcessRefillNotificationIdSlice = createSlice({
  name: "pharmacyProcessRefillNotificationId",
  initialState,
  reducers: {
    addPharmacyProcessRefillNotificationId: (state, action) => {
      state.value = action.payload;
    },
    removePharmacyProcessRefillNotificationId: (state) => {
      state.value = null;
    },
  },
});

export const {
  addPharmacyProcessRefillNotificationId,
  removePharmacyProcessRefillNotificationId,
} = pharmacyProcessRefillNotificationIdSlice.actions;
