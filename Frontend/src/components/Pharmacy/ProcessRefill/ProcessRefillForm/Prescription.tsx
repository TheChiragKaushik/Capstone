import type React from "react";

type PrescriptionProps = {
  medicationName?: string;
  medicationUnit?: string;
  prescriberName?: string;
  prescribedDate?: string;
  inHandQuantity?: string;
  quantityNeeded?: string;
  directions?: string;
  lastRefillDate?: string;
};

const Prescription: React.FC<PrescriptionProps> = ({
  medicationName = "Something",
  medicationUnit = "50mg",
  prescriberName = "Dr. Sarah Cena",
  prescribedDate = "2025-11-12",
  inHandQuantity = "50",
  quantityNeeded = "20",
  directions = "Take 1 tablet by mouth once daily",
  lastRefillDate = "May 16, 2023",
}) => {
  return (
    <div>
      <h4 className="text-md font-medium text-gray-700 mb-4">
        Prescription Details
      </h4>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="mb-4">
          <div className="flex p-4 justify-between font-semibold rounded-full bg-brown-200 text-yellow-800">
            <p className="text-md font-medium text-gray-900">
              {medicationName}
            </p>
            <p className="text-sm text-gray-500">{medicationUnit}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Prescriber</p>
            <p className="text-sm text-gray-900">{prescriberName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Prescribed Date</p>
            <p className="text-sm text-gray-900">{prescribedDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">In hand Quantity</p>
            <p className="text-sm text-gray-900">{inHandQuantity} tablets</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Quantity Needed</p>
            <p className="text-sm text-gray-900">{quantityNeeded} tablets</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Directions</p>
            <p className="text-sm text-gray-900">{directions}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Last Filled</p>
            <p className="text-sm text-gray-900">{lastRefillDate} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescription;
