import RefillRequest from "./RefillRequest";
import RefillHistory from "./RefillHistory";
import CommonHeading from "../../Common/CommonHeading";
import type { CommonRouteProps } from "../../../utils/Interfaces";

const PatientRefillRequests = ({ userId }: CommonRouteProps) => {
  console.log(userId);
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading={`Refill Requests`}
        subHeading={`Request and track your medication refills`}
      />
      <RefillRequest />
      <RefillHistory />
    </div>
  );
};

export default PatientRefillRequests;
