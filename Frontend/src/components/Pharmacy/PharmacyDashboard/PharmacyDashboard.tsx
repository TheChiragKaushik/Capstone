import type { CommonRouteProps } from "../../../utils/Interfaces";
import CommonHeading from "../../Common/CommonHeading";
import DashboardActions from "./DashboardActions";

const PharmacyDashboard = ({}: CommonRouteProps) => {
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading={`Pharmacy Dashboard`}
        subHeading={`Overview of pharmacy operations`}
      />
      <DashboardActions />
    </div>
  );
};

export default PharmacyDashboard;
