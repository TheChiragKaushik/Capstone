import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

export const patientRaiseRefillNotificationIdSlice = createSlice({
  name: "patientRaiseRefillNotificationId",
  initialState,
  reducers: {
    addPatientRaiseRefillNotificationId: (state, action) => {
      state.value = action.payload;
    },
    removePatientRaiseRefillNotificationId: (state) => {
      state.value = null;
    },
  },
});

export const {
  addPatientRaiseRefillNotificationId,
  removePatientRaiseRefillNotificationId,
} = patientRaiseRefillNotificationIdSlice.actions;
