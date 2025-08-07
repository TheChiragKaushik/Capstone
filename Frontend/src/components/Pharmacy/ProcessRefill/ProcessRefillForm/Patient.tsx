import type React from "react";
import { useEffect, useState } from "react";
import { type AllergyEO, type PatientEO } from "../../../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../../../api/api";
import { fetchAllAllergies } from "../../../../utils/Constants";
import { Avatar } from "@mui/material";

type PatientProps = {
  patientId?: string;
};

const Patient: React.FC<PatientProps> = ({ patientId }) => {
  const [patientDetails, setPatientDetails] = useState<PatientEO>({});
  const [allAllergies, setAllAllergies] = useState<AllergyEO[]>();

  const getAllergies = async () => {
    const allergies = await fetchAllAllergies();
    if (allergies) {
      setAllAllergies(allergies);
    }
  };
  const fetchPatientDetails = async () => {
    try {
      const patient = await axios.get(
        `${APIEndpoints.UserProfile}?PatientId=${patientId}`
      );
      if (patient.data) {
        setPatientDetails(patient.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
    getAllergies();
  }, []);
  return (
    <div>
      <h4 className="text-md font-medium text-gray-700 mb-4">
        Patient Information
      </h4>
      <div className="bg-gray-50 flex flex-col items-center justify-center p-4 rounded-lg">
        <div className="flex items-center mb-10">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-beige-300 flex items-center justify-center text-brown-800">
            <Avatar />
          </div>
          <div className="ml-4">
            <div className="text-md font-medium text-gray-900">
              {patientDetails.firstName}&nbsp;{patientDetails.lastName}
            </div>
            <div className="text-sm text-gray-500">
              ID: {patientDetails._id} • DOB: {patientDetails.dateOfBirth}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm text-gray-900">
              {patientDetails.contact?.phone}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm text-gray-900">
              {patientDetails.contact?.email}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Existing Conditions</p>
            <p className="flex flex-wrap items-center justify-center text-sm gap-1 text-gray-900">
              {patientDetails?.existingConditions?.map((condition, index) => (
                <span key={index}>
                  {condition}
                  {index < (patientDetails?.existingConditions?.length ?? 0) - 1
                    ? ","
                    : ""}
                </span>
              ))}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Allergies</p>
            <p className="flex flex-wrap items-center justify-center text-sm gap-1 text-gray-900">
              {patientDetails?.allergyIds?.map((allergyId, index) => {
                const matchedAllergy = allAllergies?.find(
                  (a) => a._id === allergyId || a._id === allergyId
                );

                if (!matchedAllergy) return null;

                return (
                  <span key={allergyId}>
                    {matchedAllergy.name}
                    {index < (patientDetails?.allergyIds?.length ?? 0) - 1
                      ? ", "
                      : ""}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;
