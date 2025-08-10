import type { Router } from "@toolpad/core/AppProvider";
import type {
  InventoryRestockReminderNotifications,
  MedicationPrescribed,
  PharmacyRefillRequest,
  SinglePharmacyNotification,
} from "../../../../utils/Interfaces";
import type React from "react";
import { Button } from "@mui/material";
import { colors } from "../../../../utils/Constants";
import { APIEndpoints } from "../../../../api/api";
import { addPharmacyProcessRefillNotificationId } from "../../../../redux/features/pharmacyProcessRefillNotificationIdSlice";
import { useAppDispatch } from "../../../../redux/hooks";
import axios from "axios";
import { useEffect, useState } from "react";
import { addPharmacyUpdateInventoryNotificationId } from "../../../../redux/features/pharmacyUpdateInventoryNotificationIdSlice";

type PharmacyNotificationItemProps = {
  notification?: SinglePharmacyNotification;
  userId?: string;
  navigateToRoute?: Router;
  onRemove?: (id: string) => void;
};

const PharmacyNotificationItem: React.FC<PharmacyNotificationItemProps> = ({
  notification,
  userId,
  navigateToRoute,
  onRemove,
}) => {
  const typeOfNotification = notification?.type;
  const dispatch = useAppDispatch();

  const refillRequest =
    typeOfNotification === "Refill Request" && notification
      ? (notification?.notification as PharmacyRefillRequest)
      : null;

  const refillRequestObject = refillRequest?.refillRequest;
  const [medicationPrescribed, setMedicationPrescribed] =
    useState<MedicationPrescribed>({});

  useEffect(() => {
    if (typeOfNotification !== "Refill Request") {
      return;
    }
    const getMedicationPrescribed = async () => {
      try {
        const medicationPrescribed = await axios.get(
          `${APIEndpoints.Patient}/medication-prescribed/${refillRequestObject?.patientId}?PrescriptionId=${refillRequestObject?.prescriptionId}&MedicationPrescribedId=${refillRequestObject?.medicationPrescribedId}`
        );
        if (medicationPrescribed.data) {
          setMedicationPrescribed(medicationPrescribed.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getMedicationPrescribed();
  }, [notification]);
  const handleRefillRequest = async () => {
    dispatch(
      addPharmacyProcessRefillNotificationId(refillRequestObject?.raiseRefillId)
    );
    try {
      const checkNotificationPayload = {
        pharmacyId: refillRequestObject?.pharmacyId,
        fieldToUpdateId: refillRequestObject?.raiseRefillId,
      };
      const checkNotification = await axios.put(
        `${APIEndpoints.Pharmacy}/check?refillrequest=true`,
        checkNotificationPayload
      );
      if (!checkNotification.data) {
        return;
      }
    } catch (error) {
      console.error(error);
    }
    if (onRemove) {
      onRemove(refillRequestObject?.raiseRefillId ?? "");
    }
    navigateToRoute?.navigate("processRefill");
  };

  const inventoryUpdateObject =
    typeOfNotification === "Inventory Update" && notification
      ? (notification.notification as InventoryRestockReminderNotifications)
      : null;

  const handleInventory = async () => {
    if (!inventoryUpdateObject?.inventoryId) {
      return;
    }
    dispatch(
      addPharmacyUpdateInventoryNotificationId(
        inventoryUpdateObject?.inventoryId
      )
    );
    try {
      const checkNotificationPayload = {
        pharmacyId: userId,
        fieldToUpdateId:
          inventoryUpdateObject?.inventoryRestockReminderNotificationId,
      };
      const checkNotification = await axios.put(
        `${APIEndpoints.Pharmacy}/check?inventory=true`,
        checkNotificationPayload
      );
      if (!checkNotification.data) {
        return;
      }
    } catch (error) {
      console.error(error);
    }
    if (onRemove) {
      onRemove(
        inventoryUpdateObject?.inventoryRestockReminderNotificationId ?? ""
      );
    }
    navigateToRoute?.navigate("inventoryUpdate");
  };

  return (
    <>
      {typeOfNotification === "Refill Request" ? (
        <>
          {notification?.checked ? (
            <div className="bg-beige-100 rounded-xl p-6 border-l-4 my-6 border-brown-400">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-brown-100 p-3 rounded-full">
                    <i
                      className="fa-solid fa-pills fa-lg"
                      style={{ color: colors.brown500 }}
                    ></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-brown-600">
                        Refill Request Reminder
                      </h3>
                      <span className="bg-brown-100 text-brown-600 text-xs text-center px-2 py-1 rounded-full font-medium">
                        Low Stock
                      </span>
                    </div>
                    <p className="text-brown-500 mb-2">
                      Patient's{" "}
                      <strong> {refillRequestObject?.medicationName} </strong>{" "}
                      medication is running low
                    </p>
                    <div className="text-sm text-brown-400 space-y-1">
                      <p>
                        📦 Only{" "}
                        {medicationPrescribed?.currentTabletsInHand !== null
                          ? medicationPrescribed?.currentTabletsInHand
                          : medicationPrescribed?.currentVolumeInhand}{" "}
                        doses remaining
                      </p>
                      <p>🏪 Please provide refill ASAP! </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-beige-100 my-6 rounded-xl p-6 border-l-4 border-brown-400">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-brown-100 p-3 rounded-full">
                    <i
                      className="fa-solid fa-pills fa-lg"
                      style={{ color: colors.brown500 }}
                    ></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-brown-600">
                        Refill Request Reminder
                      </h3>
                      <span className="bg-brown-100 text-brown-600 text-xs text-center px-2 py-1 rounded-full font-medium">
                        Low Stock
                      </span>
                    </div>
                    <p className="text-brown-500 mb-2">
                      Patient's{" "}
                      <strong> {refillRequestObject?.medicationName} </strong>{" "}
                      medication is running low
                    </p>
                    <div className="text-sm text-brown-400 space-y-1">
                      <p>
                        📦 Only{" "}
                        {medicationPrescribed?.currentTabletsInHand !== null
                          ? medicationPrescribed?.currentTabletsInHand
                          : medicationPrescribed?.currentVolumeInhand}{" "}
                        doses remaining
                      </p>
                      <p>🏪 Please provide refill ASAP! </p>
                    </div>
                    <div className="flex items-center space-x-3 mt-4">
                      <Button
                        onClick={handleRefillRequest}
                        sx={{
                          backgroundColor: colors.brown500,
                          color: "white",
                          "&:hover": {
                            backgroundColor: colors.brown600,
                          },
                        }}
                        className="rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brown-400"
                      >
                        Refill Medication
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : typeOfNotification === "Inventory Update" ? (
        <>
          {notification?.checked ? (
            <div className="bg-beige-100 my-6 rounded-xl p-6 border-l-4 border-brown-500">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-brown-100 p-3 rounded-full">
                    <i
                      className="fa-solid fa-clock fa-lg"
                      style={{ color: colors.brown500 }}
                    ></i>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-brown-600">
                        Medication out of Stock!
                      </h3>
                      <div className="pulse-dot w-2 h-2 bg-brown-500 rounded-full"></div>
                    </div>
                    <strong>{inventoryUpdateObject?.medicationName}</strong>
                    <p className="text-brown-500 mb-2">
                      {inventoryUpdateObject?.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-beige-100 my-6 rounded-xl p-6 border-l-4 border-brown-500">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-brown-100 p-3 rounded-full">
                    <i
                      className="fa-solid fa-clock fa-lg"
                      style={{ color: colors.brown500 }}
                    ></i>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-brown-600">
                        Medication out of Stock!
                      </h3>
                      <div className="pulse-dot w-2 h-2 bg-brown-500 rounded-full"></div>
                    </div>
                    <strong>{inventoryUpdateObject?.medicationName}</strong>
                    <p className="text-brown-500 mb-2">
                      {inventoryUpdateObject?.message}
                    </p>
                    <div className="flex items-center space-x-3 mt-10">
                      <Button
                        onClick={handleInventory}
                        sx={{
                          backgroundColor: colors.brown600,
                          color: "white",
                          "&:hover": {
                            backgroundColor: colors.brown700,
                          },
                        }}
                        className="rounded-lg text-sm font-medium hover:bg-brown-600 focus:outline-none focus:ring-2 focus:ring-brown-400"
                      >
                        Update Inventory
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </>
  );
};

export default PharmacyNotificationItem;
