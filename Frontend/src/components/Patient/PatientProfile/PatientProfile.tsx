import PatientDetails from "./PatientDetails";
import CommonHeading from "../../Common/CommonHeading";
import type { CommonRouteProps } from "../../../utils/Interfaces";

const PatientProfile = ({ userId }: CommonRouteProps) => {
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading={`Your Profile`}
        subHeading={`Manage your personal information and preferences`}
      />
      <PatientDetails userId={userId} />
    </div>
  );
};

export default PatientProfile;
