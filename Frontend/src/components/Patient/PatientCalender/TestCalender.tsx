import React, { useState, useEffect } from "react";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isBefore,
  isAfter,
} from "date-fns";
import CommonTextfield from "../../Common/CommonTextfield";
import { IndicatorLegend } from "../../../utils/Constants";
import { MenuItem } from "@mui/material";

const colorLegend: any = {
  taken: "bg-green-200",
  missed: "bg-red-300",
  "yet-to-take": "bg-yellow-200",
};

const TestCalender = ({ prescriptionData }: { prescriptionData: any }) => {
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    console.log("----------data check");
    console.log(prescriptionData);
    if (prescriptionData?.medicationsPrescribed) {
      console.log("----------data found");

      setSelectedMedication(
        prescriptionData.medicationsPrescribed[0].medicationPrescribedId
      );
      const firstMedicationStartDate = new Date(
        prescriptionData.medicationsPrescribed[0].startDate
      );
      setCurrentDate(firstMedicationStartDate);
    }
  }, [prescriptionData]);

  const handleMedicationChange = (event: any) => {
    const medicationId = event.target.value;
    setSelectedMedication(medicationId);
    const medication = prescriptionData.medicationsPrescribed.find(
      (med: any) => med.medicationPrescribedId === medicationId
    );
    if (medication) {
      setCurrentDate(new Date(medication.startDate));
    }
  };

  const prevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    const selectedMed = prescriptionData.medicationsPrescribed.find(
      (med: any) => med.medicationPrescribedId === selectedMedication
    );
    if (selectedMed && isBefore(newDate, new Date(selectedMed.startDate))) {
      return;
    }
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    const selectedMed = prescriptionData.medicationsPrescribed.find(
      (med: any) => med.medicationPrescribedId === selectedMedication
    );
    if (selectedMed && isAfter(newDate, new Date(selectedMed.endDate))) {
      return;
    }
    setCurrentDate(newDate);
  };

  if (!prescriptionData || !prescriptionData.medicationsPrescribed) {
    return null; // or a loading spinner, or some placeholder UI
  }

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const weekStart = startOfWeek(monthStart);
  const weekEnd = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = weekStart;

  const medicationOptions =
    prescriptionData?.medicationsPrescribed?.map((med: any) => ({
      value: med.medicationPrescribedId,
      label: med.medication.name,
    })) || [];

  const getEventStatus = (date: any) => {
    if (!selectedMedication) return [];

    const medicationTracking = prescriptionData.medicationTracking.find(
      (tracking: any) => tracking.medicationPrescribedId === selectedMedication
    );

    if (!medicationTracking) return [];

    const dayTracker = medicationTracking.tracker.find(
      (track: any) => track.date === format(date, "yyyy-MM-dd")
    );

    if (!dayTracker) {
      return isBefore(date, new Date()) ? ["missed"] : ["yet-to-take"];
    }

    const statuses = dayTracker.doses.map((dose: any) =>
      dose.taken
        ? "taken"
        : isBefore(date, new Date())
          ? "missed"
          : "yet-to-take"
    );
    return statuses;
  };

  while (day <= weekEnd) {
    for (let i = 0; i < 7; i++) {
      //   const dayKey = format(day, "yyyy-MM-dd");
      const dayEvents = getEventStatus(day);
      const isWithinRange =
        selectedMedication &&
        isSameMonth(day, monthStart) &&
        isAfter(
          day,
          new Date(
            prescriptionData.medicationsPrescribed.find(
              (m: any) => m.medicationPrescribedId === selectedMedication
            )?.startDate
          )
        ) &&
        isBefore(
          day,
          new Date(
            prescriptionData.medicationsPrescribed.find(
              (m: any) => m.medicationPrescribedId === selectedMedication
            )?.endDate
          )
        );

      days.push(
        <div
          key={day.toISOString()}
          className={`calendar-day h-24 border border-beige-100 rounded-lg p-1 
            ${isSameMonth(day, monthStart) ? "bg-white hover:shadow-md" : "bg-beige-50 opacity-50"}
            ${isSameDay(day, new Date()) ? "bg-brown-50 font-medium text-brown-600" : ""}
            ${!isWithinRange ? "pointer-events-none" : ""}
          `}
        >
          <div
            className={`text-right text-sm ${isSameMonth(day, monthStart) ? "text-brown-400" : "text-brown-400 opacity-50"}`}
          >
            {format(day, dateFormat)}
          </div>
          <div className="mt-1">
            {dayEvents.map((type: any, idx: any) => (
              <div
                key={idx}
                className={`${colorLegend[type]} rounded-full w-3 h-3 mb-1`}
              ></div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(<React.Fragment key={day.toISOString()}>{days}</React.Fragment>);
    days = [];
  }

  const selectedMedicationObj = prescriptionData.medicationsPrescribed.find(
    (med: any) => med.medicationPrescribedId === selectedMedication
  );

  const isPrevMonthDisabled =
    selectedMedicationObj &&
    isBefore(
      startOfMonth(subMonths(currentDate, 1)),
      new Date(selectedMedicationObj.startDate)
    );

  const isNextMonthDisabled =
    selectedMedicationObj &&
    isAfter(
      startOfMonth(addMonths(currentDate, 1)),
      new Date(selectedMedicationObj.endDate)
    );

  return (
    <>
      <div className="flex justify-center items-center mb-10">
        <CommonTextfield
          label="Medication"
          sx={{
            width: {
              xs: "75%",
              sm: "65%",
              md: "45%",
            },
          }}
          isSelect
          value={selectedMedication}
          onChange={handleMedicationChange}
        >
          {prescriptionData?.medicationsPrescribed?.map((med: any) => (
            <MenuItem
              value={med.medicationPrescribedId}
              key={med.medicationPrescribedId}
            >
              {med.medication.name}
            </MenuItem>
          ))}
        </CommonTextfield>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={prevMonth}
            disabled={isPrevMonthDisabled}
            className={`text-brown-500 hover:text-brown-700 ${isPrevMonthDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <h3 className="text-lg font-medium text-brown-700">
            {format(currentDate, "MMMM yyyy")}
          </h3>
          <button
            onClick={nextMonth}
            disabled={isNextMonthDisabled}
            className={`text-brown-500 hover:text-brown-700 ${isNextMonthDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-center text-sm font-medium text-brown-500 py-2"
            >
              {d}
            </div>
          ))}
          {rows}
        </div>

        <div className="mt-6 flex items-center justify-center space-x-6">
          <IndicatorLegend
            indicatorStyle={colorLegend.taken}
            heading={`Taken`}
          />
          <IndicatorLegend
            indicatorStyle={colorLegend.missed}
            heading={`Missed`}
          />
          <IndicatorLegend
            indicatorStyle={colorLegend["yet-to-take"]}
            heading={`Yet to take`}
          />
        </div>
      </div>
    </>
  );
};

export default TestCalender;
