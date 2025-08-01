import CalendarNavigation from "./CalendarNavigation";
import SelectedDayDetails from "./SelectedDayDetails";
import CommonHeading from "../../Common/CommonHeading";
import type { CommonRouteProps } from "../../../utils/Interfaces";

const PatientCalender = ({ userId }: CommonRouteProps) => {
  console.log(userId);
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading={`Medication Calendar`}
        subHeading={`Track your medication intake over time`}
      />
      <CalendarNavigation />
      <SelectedDayDetails />
    </div>
  );
};

export default PatientCalender;
