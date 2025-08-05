import {
  Alert,
  Button,
  Checkbox,
  Collapse,
  MenuItem,
  Snackbar,
  Typography,
  type AlertColor,
} from "@mui/material";
import {
  colors,
  MedicationForTypes,
  MedicationPeriod,
  validatePrescriptionSubmitForm,
} from "../../../utils/Constants";
import CommonTextfield from "../../Common/CommonTextfield";
import React, { useState } from "react";
import {
  type Prescription,
  type Medication,
  type MedicationPrescribed,
} from "../../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import { TransitionGroup } from "react-transition-group";

type NewPrescriptionFormProps = {
  setAddNewPrescription?: React.Dispatch<React.SetStateAction<boolean>>;
  patientId?: string;
  providerId?: string;
  onSubmitRefresh?: () => void;
};
const NewPrescriptionForm: React.FC<NewPrescriptionFormProps> = ({
  setAddNewPrescription,
  patientId,
  providerId,
  onSubmitRefresh,
}) => {
  const [medicationType, setMedicationType] = useState<string>("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newPrescription, setNewPrescription] = useState<Prescription>(
    {} as Prescription
  );
  const [medicationsPrescribed, setMedicationsPrescribed] = useState<
    MedicationPrescribed[]
  >([]);

  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTypeSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value;
    setMedicationType(type);
    setMedications([]);
    setMedicationsPrescribed([]);
    setError(null);

    try {
      const response = await axios.get(
        `${APIEndpoints.Admin}/medications?type=${type}`
      );
      if (response.data) {
        setMedications(response.data);
      }
    } catch (err) {
      console.error("Error fetching medications:", err);
      setError("Failed to fetch medications. Please try again.");
      setSnackbar({
        open: true,
        message: "Failed to fetch medications. Please try again.",
        severity: "error",
      });
    }
  };

  const addMedication = () => {
    if (medicationsPrescribed.length < medications.length) {
      setMedicationsPrescribed((prev) => [
        ...prev,
        {
          medicationId: "",
          totalTabletToTake: undefined,
          currentTabletsInHand: undefined,
          totalVolumeToTake: undefined,
          currentVolumeInhand: undefined,
          refillAlertThreshold: undefined,
          startDate: "",
          endDate: "",
          refillsAllowed: false,
          schedule: [],
        },
      ]);
    }
  };

  const removeMedication = (index: number) => {
    setMedicationsPrescribed((prev) => prev.filter((_, i) => i !== index));
  };

  const addSchedule = (medicationIndex: number) => {
    setMedicationsPrescribed((prev) =>
      prev.map((medication, i) =>
        i === medicationIndex
          ? {
              ...medication,
              schedule: [
                ...(medication?.schedule ?? []),
                {
                  period: "",
                  instruction: "",
                  scheduledTime: "",
                  doseTablets: undefined,
                  doseQuantity: undefined,
                },
              ],
            }
          : medication
      )
    );
  };

  const removeSchedule = (medicationIndex: number, scheduleIndex: number) => {
    setMedicationsPrescribed((prev) =>
      prev.map((medication, i) =>
        i === medicationIndex
          ? {
              ...medication,
              schedule: medication?.schedule?.filter(
                (_, j) => j !== scheduleIndex
              ),
            }
          : medication
      )
    );
  };

  const handleMedicationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const currentMedicationId = e.target.value;
    const selectedMedication = medications.find(
      (med) => med._id === currentMedicationId
    );

    setMedicationsPrescribed((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              medicationId: currentMedicationId,
              medication: selectedMedication,
            }
          : item
      )
    );
  };

  const handleMedicationDetailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;

    setMedicationsPrescribed((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [name]: value,
            }
          : item
      )
    );
  };

  const handleScheduleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    medicationIndex: number,
    scheduleIndex: number
  ) => {
    const { name, value } = e.target;
    console.log(name === "doseTablets" ? value : null);

    setMedicationsPrescribed((prev) =>
      prev.map((medication, i) =>
        i === medicationIndex
          ? {
              ...medication,
              schedule: medication.schedule?.map((scheduleItem, j) =>
                j === scheduleIndex
                  ? { ...scheduleItem, [name]: value }
                  : scheduleItem
              ),
            }
          : medication
      )
    );
  };

  const handlePrescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPrescription((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const prescription: Prescription = {
      ...newPrescription,
      providerId: providerId,
      medicationsPrescribed: medicationsPrescribed,
    };

    const validationError = validatePrescriptionSubmitForm(
      medicationsPrescribed,
      prescription
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await axios.put(
        `${APIEndpoints.Notifications}/prescriptions/${patientId}`,
        prescription
      );
      if (response.data) {
        console.log("Prescription saved successfully!");
        setMedicationType("");
        setMedications([]);
        setMedicationsPrescribed([]);
        setNewPrescription({} as Prescription);
        setError(null);
        onSubmitRefresh && onSubmitRefresh();
        setSnackbar({
          open: true,
          message: "Prescription saved successfully!",
          severity: "success",
        });
      }
    } catch (err) {
      console.error("Error saving prescription:", err);
      setError("Failed to save prescription. Please try again.");
      setSnackbar({
        open: true,
        message: "Failed to save prescription. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100">
        <h3 className="text-lg font-medium text-brown-700 mb-6">
          New Prescription
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <CommonTextfield
            variant="outlined"
            isSelect
            size="small"
            label="Medication Type"
            onChange={handleTypeSelect}
            value={medicationType}
          >
            {MedicationForTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </CommonTextfield>
        </div>
        <div>
          <div className="space-y-6">
            <TransitionGroup>
              {medicationsPrescribed.map((medication, index) => (
                <Collapse key={index}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-beige-100 p-4 rounded-lg my-6">
                    <CommonTextfield
                      variant="outlined"
                      isSelect
                      size="small"
                      label={
                        medications.length > 0
                          ? "Medication"
                          : "No new Medication available"
                      }
                      onChange={(e) => handleMedicationChange(e, index)}
                      value={medication.medicationId || ""}
                      disabled={medications.length === 0}
                    >
                      {medications.length > 0
                        ? medications
                            .filter((newMedication) => {
                              return !medicationsPrescribed.some(
                                (existingMedication, existingIndex) =>
                                  existingMedication.medicationId ===
                                    newMedication._id && existingIndex !== index
                              );
                            })
                            .map((med) => (
                              <MenuItem key={med._id} value={med._id}>
                                {med.name}
                              </MenuItem>
                            ))
                        : null}
                    </CommonTextfield>
                    <div className="flex justify-end items-center">
                      <Button
                        size="small"
                        color="error"
                        sx={{
                          backgroundColor: "#FDDCDC",
                          color: "red",
                          "&:hover": {
                            border: 1,
                            borderColor: "#red",
                          },
                        }}
                        onClick={() => removeMedication(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <Collapse
                      in={Boolean(medication?.medicationId)}
                      className="col-span-2"
                    >
                      {medication.medication?.oneTablet ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <CommonTextfield
                            label="Total Tablets to take"
                            size="small"
                            name="totalTabletToTake"
                            value={medication.totalTabletToTake || ""}
                            onChange={(e) =>
                              handleMedicationDetailChange(e, index)
                            }
                            type="number"
                          />
                          <CommonTextfield
                            label="Tablets Providing"
                            name="currentTabletsInHand"
                            size="small"
                            value={medication.currentTabletsInHand || ""}
                            onChange={(e) =>
                              handleMedicationDetailChange(e, index)
                            }
                            type="number"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <CommonTextfield
                            label="Total Volume to take"
                            name="totalVolumeToTake"
                            size="small"
                            value={medication.totalVolumeToTake || ""}
                            onChange={(e) =>
                              handleMedicationDetailChange(e, index)
                            }
                            type="number"
                          />
                          <CommonTextfield
                            label="Volume Providing"
                            name="currentVolumeInhand"
                            size="small"
                            value={medication.currentVolumeInhand || ""}
                            onChange={(e) =>
                              handleMedicationDetailChange(e, index)
                            }
                            type="number"
                          />
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 place-items-center mt-6 gap-6">
                        <Typography
                          sx={{
                            marginTop: 1,
                          }}
                          className="w-full bg-beige-50 flex items-center rounded-lg border border-brown-300 h-3/4 md:h-[60%]"
                        >
                          <Checkbox
                            checked={!!medication.refillsAllowed}
                            onChange={(e) => {
                              setMedicationsPrescribed((prev) =>
                                prev.map((item, i) =>
                                  i === index
                                    ? {
                                        ...item,
                                        refillsAllowed: e.target.checked,
                                        ...(e.target.checked
                                          ? {}
                                          : {
                                              refillAlertThreshold: undefined,
                                            }),
                                      }
                                    : item
                                )
                              );
                            }}
                            name="refillsAllowed"
                          />
                          Refill Allowed
                        </Typography>
                        <CommonTextfield
                          label="Refill Alert Threshold"
                          name="refillAlertThreshold"
                          size="small"
                          value={medication.refillAlertThreshold || ""}
                          onChange={(e) =>
                            handleMedicationDetailChange(e, index)
                          }
                          type="number"
                          disabled={!medication.refillsAllowed}
                        />
                        <CommonTextfield
                          label="Start Date"
                          name="startDate"
                          type="date"
                          size="small"
                          value={medication.startDate || ""}
                          onChange={(e) =>
                            handleMedicationDetailChange(e, index)
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                        <CommonTextfield
                          label="End Date"
                          name="endDate"
                          size="small"
                          type="date"
                          value={medication.endDate || ""}
                          onChange={(e) =>
                            handleMedicationDetailChange(e, index)
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </div>

                      <TransitionGroup>
                        {(medication?.schedule ?? []).length > 0 &&
                          medication.schedule?.map(
                            (scheduleItem, scheduleIndex) => (
                              <Collapse key={scheduleIndex}>
                                <div
                                  key={scheduleIndex}
                                  className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 bg-beige-50 p-4 rounded-lg gap-6 my-6"
                                >
                                  <CommonTextfield
                                    variant="outlined"
                                    isSelect
                                    size="small"
                                    label="Period"
                                    name="period"
                                    value={scheduleItem.period}
                                    onChange={(e) =>
                                      handleScheduleChange(
                                        e,
                                        index,
                                        scheduleIndex
                                      )
                                    }
                                  >
                                    {MedicationPeriod.map((period) => (
                                      <MenuItem
                                        key={period.id}
                                        value={period.id}
                                      >
                                        {period.label}
                                      </MenuItem>
                                    ))}
                                  </CommonTextfield>

                                  <div className="flex justify-end items-center">
                                    <Button
                                      size="small"
                                      color="error"
                                      sx={{
                                        backgroundColor: "#FDDCDC",
                                        color: "red",
                                        "&:hover": {
                                          border: 1,
                                          borderColor: "#red",
                                        },
                                      }}
                                      onClick={() =>
                                        removeSchedule(index, scheduleIndex)
                                      }
                                    >
                                      Remove
                                    </Button>
                                  </div>

                                  <CommonTextfield
                                    label="Instructions"
                                    name="instruction"
                                    size="small"
                                    value={scheduleItem.instruction || ""}
                                    onChange={(e) =>
                                      handleScheduleChange(
                                        e,
                                        index,
                                        scheduleIndex
                                      )
                                    }
                                  />
                                  <CommonTextfield
                                    label="Time"
                                    name="scheduledTime"
                                    size="small"
                                    value={scheduleItem.scheduledTime || ""}
                                    onChange={(e) =>
                                      handleScheduleChange(
                                        e,
                                        index,
                                        scheduleIndex
                                      )
                                    }
                                    type="time"
                                    InputLabelProps={{ shrink: true }}
                                  />
                                  {medication.medication?.oneTablet ? (
                                    <>
                                      <CommonTextfield
                                        label="Dose Tablets"
                                        name="doseTablets"
                                        size="small"
                                        value={scheduleItem.doseTablets || ""}
                                        onChange={(e) =>
                                          handleScheduleChange(
                                            e,
                                            index,
                                            scheduleIndex
                                          )
                                        }
                                        type="number"
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <CommonTextfield
                                        label="Dose Volume"
                                        name="doseVolume"
                                        size="small"
                                        value={scheduleItem.doseVolume || ""}
                                        onChange={(e) =>
                                          handleScheduleChange(
                                            e,
                                            index,
                                            scheduleIndex
                                          )
                                        }
                                        type="number"
                                      />
                                    </>
                                  )}
                                </div>
                              </Collapse>
                            )
                          )}
                      </TransitionGroup>
                      <div className="flex justify-start items-center col-span-2 my-4">
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            backgroundColor: colors.brown600,
                            width: {
                              sc: "25%",
                              md: "15%",
                            },
                            color: "white",
                            "&:hover": {
                              backgroundColor: colors.brown700,
                            },
                          }}
                          onClick={() => addSchedule(index)}
                        >
                          Add Schedule
                        </Button>
                      </div>
                    </Collapse>
                  </div>
                </Collapse>
              ))}
            </TransitionGroup>
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          <div className="my-4">
            <Button
              variant="outlined"
              onClick={addMedication}
              disabled={!medicationType || medications.length === 0}
              sx={{
                backgroundColor: colors.brown600,
                color: "white",
                "&:hover": {
                  backgroundColor: colors.brown700,
                },
              }}
            >
              Add Medication
            </Button>
          </div>

          <CommonTextfield
            label="Prescription For Description"
            name="prescriptionForDescription"
            type="text"
            disabled={medicationsPrescribed.length === 0}
            className="my-8"
            onChange={(e) => handlePrescriptionChange(e)}
            value={newPrescription.prescriptionForDescription ?? ""}
          />
        </div>

        <div className="mt-8 flex gap-4 justify-end">
          <Button
            type="button"
            onClick={() =>
              setAddNewPrescription && setAddNewPrescription((prev) => !prev)
            }
            sx={{
              backgroundColor: colors.beige200,
              color: colors.brown600,
              "&:hover": {
                backgroundColor: colors.beige300,
              },
            }}
            className="mr-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "green",
              color: "white",
              "&:hover": {
                backgroundColor: "darkgreen",
              },
            }}
            className="ml-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
          >
            Submit Prescription
          </Button>
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewPrescriptionForm;
