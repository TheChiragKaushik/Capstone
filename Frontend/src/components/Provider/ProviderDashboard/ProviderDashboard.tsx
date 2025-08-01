import { Button } from "@mui/material";
import PatientSearchList from "./PatientSearchList";
import type { CommonRouteProps } from "../../../utils/Interfaces";
import CommonHeading from "../../Common/CommonHeading";

const ProviderDashboard = ({ navigateToRoute }: CommonRouteProps) => {
  const handleRouting = () => {
    navigateToRoute?.navigate("prescribeMedication");
    localStorage.setItem("patientId", "12345");
    console.log("----click");
  };
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Button onClick={handleRouting}>prescribeMedication</Button>
      <CommonHeading
        heading={`My Patients`}
        subHeading={`Select a patient to prescribe medication or view records`}
      />
      <PatientSearchList />
    </div>
  );
};

export default ProviderDashboard;
