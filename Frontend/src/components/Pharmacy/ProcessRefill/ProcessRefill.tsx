import type { CommonRouteProps } from "../../../utils/Interfaces";
import CommonHeading from "../../Common/CommonHeading";
import RefillQueue from "./RefillQueue";

const ProcessRefill = ({ userId }: CommonRouteProps) => {
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading="Process Refill"
        subHeading="Review and process pending prescription refills"
      />
      <RefillQueue pharmacyId={userId} />
    </div>
  );
};

export default ProcessRefill;
