import RefillHistory from "./RefillHistory";
import CommonHeading from "../../Common/CommonHeading";
import type { CommonRouteProps } from "../../../utils/Interfaces";

const PatientRefillRequests = ({ userId }: CommonRouteProps) => {
  return (
    <div className="w-full  mx-auto py-6 px-4">
      <CommonHeading
        heading={`Refill Requests`}
        subHeading={`Request and track your medication refills`}
      />
      <RefillHistory patientId={userId} />
    </div>
  );
};

export default PatientRefillRequests;
