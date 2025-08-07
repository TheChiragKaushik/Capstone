import type { CommonRouteProps, PharmacyEO } from "../../../utils/Interfaces";
import CommonHeading from "../../Common/CommonHeading";
import DashboardActions from "./DashboardActions";
import PharmacySelectNotificationSound from "./PharmacySelectNotificationSound";

const PharmacyDashboard = ({ userId, user, navigateToRoute }: CommonRouteProps) => {
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading={`Pharmacy Dashboard`}
        subHeading={`Overview of pharmacy operations`}
      />
      <DashboardActions userId={userId} navigateToRoute={navigateToRoute} />
      {user && (user as PharmacyEO).soundPreference !== undefined && (
        <PharmacySelectNotificationSound user={user as PharmacyEO} />
      )}
    </div>
  );
};

export default PharmacyDashboard;
