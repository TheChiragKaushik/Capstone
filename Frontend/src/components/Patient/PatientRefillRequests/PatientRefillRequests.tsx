import type React from "react";
import type { PatientRefillRequestsPageProps } from "../../../utils/Interfaces";
import RefillRequestHeading from "./RefillRequestHeading";
import RefillRequest from "./RefillRequest";
import RefillHistory from "./RefillHistory";

const PatientRefillRequests: React.FC<PatientRefillRequestsPageProps> = () => {
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <RefillRequestHeading />
      <RefillRequest />
      <RefillHistory />
    </div>
  );
};

export default PatientRefillRequests;
