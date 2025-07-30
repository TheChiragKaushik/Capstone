import type React from "react";
import type { PatientProfileRequestPageProps } from "../../../utils/Interfaces";
import ProfileHeading from "./ProfileHeading";
import PatientDetails from "./PatientDetails";

const PatientProfile: React.FC<PatientProfileRequestPageProps> = () => {
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <ProfileHeading />
      <PatientDetails />
    </div>
  );
};

export default PatientProfile;
