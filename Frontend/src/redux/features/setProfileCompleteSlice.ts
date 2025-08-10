import { createSlice } from "@reduxjs/toolkit";

const setProfileCompleteSlice = createSlice({
  name: "profile",
  initialState: {
    isProfileComplete: false,
  },
  reducers: {
    setProfileStatus: (state, action) => {
      state.isProfileComplete = action.payload;
    },
    resetProfileComplete: (state) => {
      state.isProfileComplete = false;
    },
  },
});

export const { setProfileStatus, resetProfileComplete } =
  setProfileCompleteSlice.actions;

export default setProfileCompleteSlice.reducer;
