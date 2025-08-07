import type React from "react";
import type { MedicationPrescribed } from "../../../utils/Interfaces";

type MedicationsPrescribedProps = {
  medicationPrescribed?: MedicationPrescribed[];
};

const PatientMedicationsPrescribed: React.FC<MedicationsPrescribedProps> = ({
  medicationPrescribed,
}) => {
  return (
    <div className="my-6">
      <h4 className="text-md font-medium text-gray-700 mb-4">
        Medications Details
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {medicationPrescribed?.map((medication) => {
          const name = medication.medication?.name || "-";
          const unit = medication.medication?.unitMeasure || "";
          const startDate = medication.startDate
            ? new Date(medication.startDate).toLocaleDateString()
            : "-";
          const endDate = medication.endDate
            ? new Date(medication.endDate).toLocaleDateString()
            : "-";

          const inHand =
            medication.currentTabletsInHand != null
              ? medication.currentTabletsInHand
              : medication.currentVolumeInhand;
          const needed =
            medication.totalTabletToTake != null
              ? medication.totalTabletToTake
              : medication.totalVolumeToTake;
          const took =
            medication.totalTabletsTook != null
              ? medication.totalTabletsTook
              : medication.totalVolumeTook;

          let status = "-";
          const safeNeeded = needed ?? 0;
          const medTook = took ?? 0;

          if (safeNeeded === medTook) {
            status = "Complete";
          } else if (safeNeeded > medTook) {
            status = "In Progress";
          }

          let directions = "-";
          if (
            Array.isArray(medication.schedule) &&
            medication.schedule.length > 0
          ) {
            directions = medication.schedule
              .map((s) => `${s.instruction || ""} (${s.scheduledTime || ""})`)
              .join(", ");
          }

          const remainingQuantity = (inHand || 0) - (took || 0);
          const needsRefill =
            remainingQuantity <= (medication?.refillAlertThreshold ?? 0);
          // const outOfStock = needsRefill;
          const refillAllowed = medication.refillsAllowed;

          return (
            <div
              key={medication.medicationPrescribedId}
              className="bg-gray-50 p-4 rounded-lg mb-4"
            >
              <div className="mb-4">
                <div className="flex p-4 justify-between font-semibold rounded-full bg-brown-200 text-yellow-800">
                  <p className="text-md font-medium text-gray-900">{name}</p>
                  <p className="text-sm text-gray-500">{unit}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-xs text-gray-500">Prescribed Start</p>
                  <p className="text-sm text-gray-900">{startDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Prescribed End</p>
                  <p className="text-sm text-gray-900">{endDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">In hand Quantity</p>
                  <p className="text-sm text-gray-900">{inHand || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Prescribed Quantity</p>
                  <p className="text-sm text-gray-900">{needed || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Quantity Taken</p>
                  <p className="text-sm text-gray-900">{took || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Directions</p>
                  <p className="text-sm text-gray-900">{directions}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Refill Threshold</p>
                  <p className="text-sm text-gray-900">
                    {medication.refillAlertThreshold}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      status === "Complete"
                        ? "bg-green-100 text-green-800"
                        : status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>
              {refillAllowed ? (
                needsRefill && (
                  // <RefillRequestCard
                  //   outOfStock={outOfStock}
                  //   medicationName={name}
                  //   remaining={remainingQuantity > 0 ? remainingQuantity : 0}
                  //   unit={unit}
                  // />
                  <p>Hello</p>
                )
              ) : (
                <p className="flex justify-center items-center my-4 bg-beige-200 p-4 rounded-full">
                  Refill not allowed
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PatientMedicationsPrescribed;
