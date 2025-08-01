import CommonHeading from "../../Common/CommonHeading";
import type { CommonRouteProps } from "../../../utils/Interfaces";
import ProviderDetails from "./PatientDetails";

const ProviderProfile = ({ userId, user }: CommonRouteProps) => {
  console.log(userId);
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading={`Your Profile`}
        subHeading={`Manage your personal information and preferences`}
      />
      <ProviderDetails user={user} />
    </div>
  );
};

export default ProviderProfile;
