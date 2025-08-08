import type React from "react";
import { type ReactNode } from "react";

type MedicalDetailProps = {
  name?: string;
  className?: string;
};
export const MedicalDetail: React.FC<MedicalDetailProps> = ({
  name,
  className,
}) => {
  return (
    <div className="flex items-center">
      <span className={`h-2 w-2 rounded-full mr-2 ${className}`}></span>
      <span className="text-sm text-brown-700">{name}</span>
    </div>
  );
};

type PatientMedicalDetailCardprops = {
  heading?: string;
  children?: ReactNode;
  className?: string;
};

const PatientMedicalDetailCard: React.FC<PatientMedicalDetailCardprops> = ({
  heading,
  children,
  className,
}) => {
  return (
    <div className={`bg-beige-200 p-4 rounded-lg ${className}`}>
      <h4 className="text-sm font-medium text-brown-600 mb-2">{heading}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
};

export default PatientMedicalDetailCard;
