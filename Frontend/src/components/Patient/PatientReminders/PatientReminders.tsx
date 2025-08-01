import ModifyReminders from "./ModifyReminders";
import CommonHeading from "../../Common/CommonHeading";
import type { CommonRouteProps } from "../../../utils/Interfaces";

const PatientReminders = ({ user }: CommonRouteProps) => {
  console.log(user);
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading={`Medication Reminders`}
        subHeading={`Set up and manage your medication reminders`}
      />
      <ModifyReminders />
    </div>
  );
};

export default PatientReminders;
