import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { APIEndpoints } from "../../api/api";
import type { PatientEO, ProviderEO, PharmacyEO } from "../../utils/Interfaces";

interface UserState {
  user: PatientEO | ProviderEO | PharmacyEO | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
};

export const fetchAppUserDetails = createAsyncThunk(
  "user/fetchUserData",
  async ({ role, userId }: { role: string; userId: string }) => {
    const response = await axios.get(
      `${APIEndpoints.UserProfile}?${role}Id=${userId}`
    );
    return response.data;
  }
);

const appUserDetailsSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAppUserDetails: (
      state,
      action: PayloadAction<PatientEO | ProviderEO | PharmacyEO>
    ) => {
      state.user = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    clearAppUserDetails: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppUserDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAppUserDetails.fulfilled,
        (state, action: PayloadAction<PatientEO | ProviderEO | PharmacyEO>) => {
          state.status = "succeeded";
          state.user = action.payload;
        }
      )
      .addCase(fetchAppUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch user data";
      });
  },
});

export const { setAppUserDetails, clearAppUserDetails } = appUserDetailsSlice.actions;

export default appUserDetailsSlice.reducer;
