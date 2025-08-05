import type { CommonRouteProps } from "../../../utils/Interfaces";
import CommonHeading from "../../Common/CommonHeading";
import PatientDetails from "./PatientDetails";

const NewPrescription = ({ userId: providerId }: CommonRouteProps) => {
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading="New Prescription"
        subHeading="Add new patient prescription "
      />
      <PatientDetails providerId={providerId} />
    </div>
  );
};

export default NewPrescription;
