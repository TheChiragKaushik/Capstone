import type { CommonRouteProps } from "../../../utils/Interfaces";
import CommonHeading from "../../Common/CommonHeading";
import PatientSelectNotificationSound from "./PatientSelectNotificationSound";
import UpcomingMedicationTable from "./UpcomingMedicationTable";

const PatientDashboard = ({ user }: CommonRouteProps) => {
  return (
    <>
      <div className="page w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <CommonHeading
          heading={`Welcome back, ${
            user && "firstName" in user && "lastName" in user
              ? `${user.firstName} ${user.lastName}`
              : "Unknown User"
          }`}
          subHeading={`Here's your medication overview for today`}
        />
        <UpcomingMedicationTable user={user} />

        <PatientSelectNotificationSound user={user} />
      </div>
    </>
  );
};

export default PatientDashboard;
