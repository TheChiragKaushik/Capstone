import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Allergy, PatientEO, Prescription } from "../../utils/Interfaces";
import { APIEndpoints } from "../../api/api";

type PatientState = {
  userDetails: PatientEO | null;
  allergies: Allergy[];
  isLoading: boolean;
  error: string | null;
};

const initialState: PatientState = {
  userDetails: null,
  allergies: [],
  isLoading: false,
  error: null,
};

export const fetchPatientDetails = createAsyncThunk(
  "patient/fetchPatientDetails",
  async (patientId: string | undefined, { rejectWithValue }) => {
    if (!patientId) {
      return rejectWithValue("Patient ID is required.");
    }

    try {
      const patientResponse = await axios.get(
        `${APIEndpoints.UserProfile}?PatientId=${patientId}`
      );
      const patientData = patientResponse.data;

      let allergyData: Allergy[] = [];
      if (patientData.allergyIds && patientData.allergyIds.length > 0) {
        const allergyPromises = patientData.allergyIds.map(
          (allergyId: string) =>
            axios.get(`${APIEndpoints.Admin}/allergies?AllergyId=${allergyId}`)
        );
        const allergyResponses = await Promise.all(allergyPromises);
        allergyData = allergyResponses.map((r) => r.data);
      }

      let prescriptionsWithDetails: Prescription[] = [];
      if (
        patientData.prescriptions &&
        Array.isArray(patientData.prescriptions)
      ) {
        prescriptionsWithDetails = await Promise.all(
          patientData.prescriptions.map(async (prescription: Prescription) => {
            const providerResponse = await axios.get(
              `${APIEndpoints.UserProfile}?ProviderId=${prescription.providerId}`
            );
            const providedBy = providerResponse.data;

            const medsWithDetails = await Promise.all(
              (prescription.medicationsPrescribed || []).map(async (med) => {
                const medResponse = await axios.get(
                  `${APIEndpoints.Admin}/medications?MedicationId=${med.medicationId}`
                );
                return {
                  ...med,
                  medication: medResponse.data,
                };
              })
            );
            return {
              ...prescription,
              prescribedBy: providedBy,
              medicationsPrescribed: medsWithDetails,
            };
          })
        );
        patientData.prescriptions = prescriptionsWithDetails;
      }

      return { userDetails: patientData, allergies: allergyData };
    } catch (error) {
      return rejectWithValue("Failed to fetch patient data.");
    }
  }
);

const patientDetailsSlice = createSlice({
  name: "patientDetails",
  initialState,
  reducers: {
    clearPatientData: (state) => {
      state.userDetails = null;
      state.allergies = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload.userDetails;
        state.allergies = action.payload.allergies;
      })
      .addCase(fetchPatientDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPatientData } = patientDetailsSlice.actions;

export default patientDetailsSlice.reducer;
