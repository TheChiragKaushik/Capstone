import type React from "react";
import type { ExistingCondition } from "../../../../utils/Interfaces";

type PatientProps = {
  patientName?: string;
  patientId?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  existingCondition?: ExistingCondition[];
  allergies?: string[];
};

const Patient: React.FC<PatientProps> = ({
  patientName = "Robert Johnson",
  patientId = "P-34567890",
  dateOfBirth = "11/04/1962 (61 years)",
  phone = "(555) 123-4567",
  email = "robert.johnson@example.com",
  existingCondition = [{ name: "Diabetes" }, { name: "Headache" }],
  allergies = ["Penicillin", "Sulfa"],
}) => {
  return (
    <div>
      <h4 className="text-md font-medium text-gray-700 mb-4">
        Patient Information
      </h4>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-beige-300 flex items-center justify-center text-brown-800">
            <span>RJ</span>
          </div>
          <div className="ml-4">
            <div className="text-md font-medium text-gray-900">
              {patientName}
            </div>
            <div className="text-sm text-gray-500">
              ID: {patientId} • DOB: {dateOfBirth}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm text-gray-900">{phone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm text-gray-900">{email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Existing Conditions</p>
            <p className="flex flex-wrap text-sm gap-1 text-gray-900">
              {existingCondition.map((condition, index) => (
                <span key={index}>
                  {condition?.name}
                  {index < existingCondition.length - 1 ? "," : ""}
                </span>
              ))}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Allergies</p>
            <p className="flex flex-wrap text-sm gap-1 text-gray-900">
              {allergies.map((allergy, index) => (
                <span key={index}>
                  {allergy}
                  {index < allergies.length - 1 ? "," : ""}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;
