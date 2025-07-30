import type { PatientDashboardPageProps } from "../../../utils/Interfaces";
import DashboardHeading from "./DashboardHeading";
import Providers from "./Providers";
import RefillStatus from "./RefillStatus";
import UpcomingMedicationTable from "./UpcomingMedicationTable";

const PatientDashboard: React.FC<PatientDashboardPageProps> = ({
  user,
  userId,
  pathname,
}) => {
  console.log(user);
  console.log(
    "PatientDashboard rendered with userId:",
    userId,
    "and pathname:",
    pathname
  );
  return (
    <>
      <div className="page w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <DashboardHeading
          name={
            user && "firstName" in user && "lastName" in user
              ? `${user.firstName} ${user.lastName}`
              : "Unknown User"
          }
        />
        <UpcomingMedicationTable user={user} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <RefillStatus />
          <Providers />
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;
