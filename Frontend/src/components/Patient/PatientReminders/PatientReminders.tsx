import type React from "react";
import RemindersHeading from "./RemindersHeading";
import type { PatientRemindersPageProps } from "../../../utils/Interfaces";
import ModifyReminders from "./ModifyReminders";

const PatientReminders: React.FC<PatientRemindersPageProps> = () => {
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <RemindersHeading />
      <ModifyReminders />
    </div>
  );
};

export default PatientReminders;
