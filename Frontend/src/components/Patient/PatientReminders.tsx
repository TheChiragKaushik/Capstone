import type React from "react";
import type { PatientRemindersPageProps } from "../../utils/Interfaces";

const PatientReminders: React.FC<PatientRemindersPageProps> = ({
  userId,
  pathname,
}) => {
  console.log(
    "PatientReminders rendered with userId:",
    userId,
    "and pathname:",
    pathname
  );
  return <div>PatientReminders</div>;
};

export default PatientReminders;
