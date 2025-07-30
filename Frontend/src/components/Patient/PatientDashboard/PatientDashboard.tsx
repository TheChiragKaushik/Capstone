import type { PatientDashboardPageProps } from "../../../utils/Interfaces";
import DashboardHeading from "./DashboardHeading";
import UpcomingMedicationTable from "./UpcomingMedicationTable";

const PatientDashboard: React.FC<PatientDashboardPageProps> = ({
  userId,
  pathname,
}) => {
  console.log(
    "PatientDashboard rendered with userId:",
    userId,
    "and pathname:",
    pathname
  );
  return (
    <>
      <div className="page w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <DashboardHeading />
        <UpcomingMedicationTable />
      </div>
    </>
  );
};

export default PatientDashboard;
