import PatientDetails from "./PatientDetails";
import CommonHeading from "../../Common/CommonHeading";
import type { CommonRouteProps } from "../../../utils/Interfaces";

const PatientProfile = ({ userId, user }: CommonRouteProps) => {
  console.log(userId);
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading={`Your Profile`}
        subHeading={`Manage your personal information and preferences`}
      />
      <PatientDetails user={user} />
    </div>
  );
};

export default PatientProfile;
