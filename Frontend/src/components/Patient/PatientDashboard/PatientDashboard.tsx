import type { CommonRouteProps, PatientEO } from "../../../utils/Interfaces";
import CommonHeading from "../../Common/CommonHeading";
import PatientPrescriptions from "./PatientPrescriptions";
import PatientSelectNotificationSound from "./PatientSelectNotificationSound";

const PatientDashboard = ({ user, userId }: CommonRouteProps) => {
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
        <PatientPrescriptions patientId={userId} />

        <PatientSelectNotificationSound user={user as PatientEO} />
      </div>
    </>
  );
};

export default PatientDashboard;
