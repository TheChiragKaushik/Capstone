import type React from "react";
import type { PatientCalenderRequestPageProps } from "../../../utils/Interfaces";
import CalenderHeading from "./CalenderHeading";
import CalendarNavigation from "./CalendarNavigation";
import SelectedDayDetails from "./SelectedDayDetails";

const PatientCalender: React.FC<PatientCalenderRequestPageProps> = () => {
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CalenderHeading />
      <CalendarNavigation />
      <SelectedDayDetails />
    </div>
  );
};

export default PatientCalender;
