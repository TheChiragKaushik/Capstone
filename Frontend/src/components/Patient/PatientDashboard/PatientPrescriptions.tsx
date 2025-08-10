import React, { useEffect } from "react";
import type { Allergy } from "../../../utils/Interfaces";
import CommonHeading from "../../Common/CommonHeading";
import { Avatar } from "@mui/material";
import { stringAvatar } from "../../../utils/Constants";
import PatientMedicalDetailCard, {
  MedicalDetail,
} from "./PatientPrescriptions/PatientMedicalDetailCard";
import PrescriptionTable from "./PatientPrescriptions/PrescriptionTable";
import { fetchPatientDetails } from "../../../redux/features/patientDetailsSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

type PatientPrescriptionsProps = {
  patientId?: string;
};
const PatientPrescriptions: React.FC<PatientPrescriptionsProps> = ({
  patientId,
}) => {
  const dispatch = useAppDispatch();
  const { userDetails, allergies, isLoading, error } = useAppSelector(
    (state) => state.patientDetails
  );

  const newNotifications = useAppSelector(
    (state) => state.patientNotifications.newNotificationsCount
  );

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientDetails(patientId));
    }
  }, [patientId, newNotifications, dispatch]);

  return (
    <>
      {isLoading ? (
        <div>Loading..</div>
      ) : error ? (
        <div>Error: {error}</div>
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
