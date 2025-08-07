import CommonHeading from "../../Common/CommonHeading";
import type { CommonRouteProps, PharmacyEO } from "../../../utils/Interfaces";
import PharmacyDetails from "./PharmacyDetails";

const PharmacyProfile = ({ userId, user }: CommonRouteProps) => {
  console.log(userId);
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading={`Your Profile`}
        subHeading={`Manage your personal information and preferences`}
      />
      <PharmacyDetails user={user as PharmacyEO} />
    </div>
  );
};

export default PharmacyProfile;
