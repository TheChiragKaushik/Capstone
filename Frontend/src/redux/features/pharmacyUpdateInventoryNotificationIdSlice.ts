import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};
export const pharmacyUpdateInventoryNotificationIdSlice = createSlice({
  name: "pharmacyUpdateInventoryNotificationId",
  initialState,
  reducers: {
    addPharmacyUpdateInventoryNotificationId: (state, action) => {
      state.value = action.payload;
    },
    removePharmacyUpdateInventoryNotificationId: (state) => {
      state.value = null;
    },
  },
});

export const {
  addPharmacyUpdateInventoryNotificationId,
  removePharmacyUpdateInventoryNotificationId,
} = pharmacyUpdateInventoryNotificationIdSlice.actions;
