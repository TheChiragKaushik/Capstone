import React, { useEffect, useState } from "react";
import type {
  Allergy,
  PatientEO,
  Prescription,
} from "../../../utils/Interfaces";
import CommonHeading from "../../Common/CommonHeading";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import { Avatar } from "@mui/material";
import { stringAvatar } from "../../../utils/Constants";
import PatientMedicalDetailCard, {
  MedicalDetail,
} from "./PatientPrescriptions/PatientMedicalDetailCard";
import PrescriptionTable from "./PatientPrescriptions/PrescriptionTable";

type PatientPrescriptionsProps = {
  patientId?: string;
};
const PatientPrescriptions: React.FC<PatientPrescriptionsProps> = ({
  patientId,
}) => {
  const [userDetails, setUserDetails] = useState<PatientEO | null>(null);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPatientDetails = async () => {
    setIsLoading(true);
    setUserDetails(null);
    setAllergies([]);

    try {
      const patientResponse = await axios.get(
        `${APIEndpoints.UserProfile}?PatientId=${patientId}`
      );

      if (!patientResponse.data) {
        setIsLoading(false);
        return;
      }

      const patientData = patientResponse.data;

      if (patientData.allergyIds && patientData.allergyIds.length > 0) {
        const allergyPromises = patientData.allergyIds.map(
          (allergyId: string) =>
            axios.get(`${APIEndpoints.Admin}/allergies?AllergyId=${allergyId}`)
        );
        const allergyResponses = await Promise.all(allergyPromises);
        const allergyData = allergyResponses.map((r) => r.data);
        setAllergies(allergyData);
      }

      if (
        patientData.prescriptions &&
        Array.isArray(patientData.prescriptions)
      ) {
        const prescriptionsWithDetails = await Promise.all(
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

      setUserDetails(patientData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);
  return (
    <>
      {isLoading ? (
        <div>Loading..</div>
      ) : (
        userDetails && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-beige-200 flex items-center justify-center text-brown-600 mr-4">
                    <span>
                      <Avatar
                        {...stringAvatar(
                          `${userDetails?.firstName ?? ""} ${userDetails?.lastName ?? ""}`
                        )}
                      />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-700">
                      {userDetails?.firstName} {userDetails?.lastName}
                    </h3>
                    <p className="text-sm text-brown-500">
                      ID: {userDetails?._id} • DOB: {userDetails?.dateOfBirth}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {userDetails?.address && (
                <PatientMedicalDetailCard heading="Address">
                  <MedicalDetail
                    className="bg-green-400"
                    name={`Street: ` + userDetails.address?.street}
                  />
                  <MedicalDetail
                    className="bg-green-400"
                    name={`City: ` + userDetails.address?.city}
                  />
                  <MedicalDetail
                    className="bg-green-400"
                    name={`State: ` + userDetails.address?.state}
                  />
                  <MedicalDetail
                    className="bg-green-400"
                    name={`Zipcode: ` + userDetails.address?.zipCode}
                  />
                </PatientMedicalDetailCard>
              )}
              {allergies && allergies.length > 0 && (
                <PatientMedicalDetailCard heading="Allergies">
                  {allergies.map((allergy: Allergy, index: number) => (
                    <MedicalDetail
                      className="bg-yellow-400"
                      key={index}
                      name={allergy.name}
                    />
                  ))}
                </PatientMedicalDetailCard>
              )}
              {userDetails?.existingConditions &&
                userDetails?.existingConditions.length > 0 && (
                  <PatientMedicalDetailCard heading="Conditions">
                    {userDetails?.existingConditions?.map(
                      (condition, index: number) => (
                        <MedicalDetail
                          className="bg-red-600"
                          key={index}
                          name={condition}
                        />
                      )
                    )}
                  </PatientMedicalDetailCard>
                )}
              {userDetails.emergencyContact && (
                <PatientMedicalDetailCard heading="Emergency Contact">
                  <MedicalDetail
                    className="bg-orange-400"
                    name={`Name: ` + userDetails.emergencyContact?.name}
                  />
                  <MedicalDetail
                    className="bg-orange-400"
                    name={
                      `Relationship: ` +
                      userDetails.emergencyContact?.relationship
                    }
                  />
                  <MedicalDetail
                    className="bg-orange-400"
                    name={
                      `Phone Number: ` + userDetails.emergencyContact?.phone
                    }
                  />
                </PatientMedicalDetailCard>
              )}
            </div>

            {userDetails?.prescriptions &&
            userDetails?.prescriptions.length > 0 ? (
              <div>
                <CommonHeading subHeading="Prescriptions History" />
                <PrescriptionTable user={userDetails} />
              </div>
            ) : null}
          </div>
        )
      )}
    </>
  );
};

export default PatientPrescriptions;
