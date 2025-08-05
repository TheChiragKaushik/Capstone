import { Avatar, Button, Collapse, CircularProgress } from "@mui/material";
import { colors, stringAvatar } from "../../../utils/Constants";
import CommonTextfield from "../../Common/CommonTextfield";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import React, { useRef, useState } from "react";
import {
  type Allergy,
  type PatientEO,
  type Prescription,
} from "../../../utils/Interfaces";
import PatientMedicalDetailCard, {
  MedicalDetail,
} from "./PatientMedicalDetailCard";
import CommonHeading from "../../Common/CommonHeading";
import PrescriptionTable from "./PrescriptionTable";
import NewPrescriptionForm from "./NewPrescriptionForm";
import { validateEmail } from "../../../utils/Validations";

type PatientDetailsProps = {
  providerId?: string;
};

const PatientDetails: React.FC<PatientDetailsProps> = ({ providerId }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<PatientEO | null>(null);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [addNewPrescription, setAddNewPrescription] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchResultRef = useRef<HTMLDivElement>(null);
  const newPrescriptionFormRef = useRef<HTMLDivElement>(null);

  const handleTogglePrescription = () => {
    setAddNewPrescription((prev) => !prev);
    setTimeout(() => {
      if (newPrescriptionFormRef.current) {
        newPrescriptionFormRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 200);
  };

  const fetchPatientDetails = async (patientEmail: string) => {
    setSearchError("");
    setIsLoading(true);
    setUserDetails(null);
    setAllergies([]);

    try {
      const patientResponse = await axios.get(
        `${APIEndpoints.UserProfile}/email?PatientEmail=${patientEmail}`
      );

      if (!patientResponse.data) {
        setSearchError("No patient found with this email.");
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
      setSearchError("Failed to fetch patient details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const error = validateEmail(email ?? "", "Patient");
    setEmailError(error);

    if (!error && email) {
      fetchPatientDetails(email);
      setTimeout(() => {
        if (searchResultRef.current) {
          searchResultRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 200);
    } else {
      setUserDetails(null);
      setAllergies([]);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
        <div className="flex flex-col items-start justify-center md:col-span-2">
          <CommonHeading subHeading="Search Patient" />
          <CommonTextfield
            type="search"
            fullWidth
            label="Patient Email"
            value={email}
            onChange={(e) => {
              const newEmail = e.target.value;
              setEmail(newEmail);
              if (emailError) {
                setEmailError("");
              }
              if (searchError) {
                setSearchError("");
              }
            }}
            sx={{
              width: {
                sm: "75%",
                md: "100%",
              },
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            error={!!emailError}
            helperText={emailError || searchError}
          />
        </div>
        <div className="flex flex-col mt-4 md:mt-0 justify-between items-center gap-6">
          <Button
            className="md:order-last"
            sx={{
              backgroundColor: colors.brown600,
              color: "white",
              p: 1,
              width: 150,
              "&:hover": {
                backgroundColor: colors.brown700,
              },
            }}
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Search"
            )}
          </Button>
          <Button
            sx={{
              backgroundColor: colors.beige300,
              color: colors.brown600,
              order: 1,
              p: 1,
              width: 150,
              "&:hover": {
                backgroundColor: colors.beige400,
              },
            }}
            className="bg-beige-100 hover:bg-beige-200 text-brown-600 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
            onClick={() => {
              setUserDetails(null);
              setAllergies([]);
              setEmailError("");
              setSearchError("");
              setAddNewPrescription(false);
              setEmail("");
            }}
          >
            <i className="fas fa-exchange-alt mr-2"></i>
            Change Patient
          </Button>
        </div>
      </div>
      {!userDetails && searchError && (
        <div className="text-red-500 text-center mb-4">{searchError}</div>
      )}
      {userDetails && (
        <div
          ref={searchResultRef}
          className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8"
        >
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
            <PatientMedicalDetailCard
              className="md:col-start-2"
              heading="Allergies"
            >
              {allergies.map((allergy: Allergy, index: number) => (
                <MedicalDetail
                  className="bg-yellow-400"
                  key={index}
                  name={allergy.name}
                />
              ))}
            </PatientMedicalDetailCard>
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
          </div>
          <div>
            <CommonHeading subHeading="Prescriptions History" />
            <PrescriptionTable user={userDetails} />
            <div className="flex justify-end items-center mt-10">
              <Button
                onClick={handleTogglePrescription}
                sx={{
                  backgroundColor: colors.brown600,
                  visibility: addNewPrescription ? "hidden" : "visible",
                  color: "white",
                  "&:hover": {
                    backgroundColor: colors.brown700,
                  },
                }}
              >
                {addNewPrescription ? null : "Add New Prescription"}
              </Button>
            </div>
          </div>
        </div>
      )}
      <Collapse in={addNewPrescription} ref={newPrescriptionFormRef}>
        <NewPrescriptionForm
          setAddNewPrescription={setAddNewPrescription}
          providerId={providerId}
          patientId={userDetails?._id}
          onSubmitRefresh={handleSearch}
        />
      </Collapse>
    </>
  );
};

export default PatientDetails;
