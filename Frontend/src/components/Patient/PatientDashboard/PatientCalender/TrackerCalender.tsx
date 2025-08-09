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
  startOfDay,
} from "date-fns";
import { IndicatorLegend } from "../../../../utils/Constants";
import CommonTextfield from "../../../Common/CommonTextfield";
import type {
  MedicationPrescribed,
  MedicationTracking,
  Prescription,
  Schedule,
  Tracker,
} from "../../../../utils/Interfaces";
import { Collapse, MenuItem } from "@mui/material";

const colorLegend: Record<string, string> = {
  taken: "bg-green-600",
  delayed: "bg-yellow-400",
  missed: "bg-red-600",
  scheduled: "bg-beige-400",
};

type DoseStatus = {
  status: string;
  time: string;
  delay?: number;
};

type TrackerCalenderProps = {
  prescription?: Prescription;
};

const TrackerCalender: React.FC<TrackerCalenderProps> = ({ prescription }) => {
  const [selectedmedicationData, setSelectedmedicationData] =
    useState<MedicationPrescribed>({});

  const [medicationTracking, setMedicationTracking] =
    useState<MedicationTracking>();

  const handleMedicationSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const medicationId = e.target.value;
    try {
      const medicationPrescribed = prescription?.medicationsPrescribed?.find(
        (medication) => medication.medicationPrescribedId === medicationId
      );
      setSelectedmedicationData(medicationPrescribed ?? {});
      setMedicationTracking(
        prescription?.medicationTracking?.find(
          (tracking) => tracking.medicationPrescribedId === medicationId
        )
      );
      if (medicationPrescribed?.startDate) {
        setCurrentDate(new Date(medicationPrescribed.startDate));
      } else {
        setCurrentDate(new Date());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [currentDate, setCurrentDate] = useState(
    selectedmedicationData.startDate
      ? new Date(selectedmedicationData.startDate)
      : new Date()
  );

  useEffect(() => {
    if (selectedmedicationData.startDate) {
      setCurrentDate(new Date(selectedmedicationData.startDate));
    }
  }, [selectedmedicationData.startDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const weekStart = startOfWeek(monthStart);
  const weekEnd = endOfWeek(monthEnd);
  const dateFormat = "d";

  const startDate = selectedmedicationData.startDate
    ? startOfDay(new Date(selectedmedicationData.startDate))
    : null;
  const endDate = selectedmedicationData.endDate
    ? startOfDay(new Date(selectedmedicationData.endDate))
    : null;

  const canGoPrev = startDate
    ? subMonths(monthStart, 1) >= startOfMonth(startDate)
    : true;
  const canGoNext = endDate
    ? addMonths(monthStart, 1) <= endOfMonth(endDate)
    : true;

  const prevMonth = () => {
    if (!startDate) return;
    const prev = subMonths(currentDate, 1);
    if (prev >= startOfMonth(startDate)) setCurrentDate(prev);
  };

  const nextMonth = () => {
    if (!endDate) return;
    const next = addMonths(currentDate, 1);
    if (next <= endOfMonth(endDate)) setCurrentDate(next);
  };

  function getDoseStatus(
    dateStr: string,
    schedule: Schedule[],
    trackerEntry: Tracker | undefined
  ): DoseStatus[] {
    if (!schedule) return [];

    const statuses: DoseStatus[] = [];
    const now = new Date();

    const trackerDoses = trackerEntry?.doses ?? [];

    schedule.forEach((sch) => {
      const doseTracking = trackerDoses.find(
        (d) => d.scheduleId === sch.scheduleId
      );

      const scheduledDateTime = new Date(`${dateStr}T${sch.scheduledTime}:00`);

      if (doseTracking) {
        if (doseTracking.taken) {
          if (doseTracking.actualTimeTaken) {
            const actualTime = new Date(
              dateStr + "T" + doseTracking.actualTimeTaken
            );
            const diffMin =
              (actualTime.getTime() - scheduledDateTime.getTime()) /
              (1000 * 60);
            if (diffMin > 5) {
              statuses.push({
                status: "delayed",
                time: sch.scheduledTime ?? "",
                delay: diffMin,
              });
            } else {
              statuses.push({ status: "taken", time: sch.scheduledTime ?? "" });
            }
          } else {
            statuses.push({ status: "taken", time: sch.scheduledTime ?? "" });
          }
        } else {
          if (scheduledDateTime < now) {
            statuses.push({ status: "missed", time: sch.scheduledTime ?? "" });
          } else {
            statuses.push({
              status: "scheduled",
              time: sch.scheduledTime ?? "",
            });
          }
        }
      } else {
        if (scheduledDateTime > now) {
          statuses.push({ status: "scheduled", time: sch.scheduledTime ?? "" });
        } else {
          statuses.push({ status: "missed", time: sch.scheduledTime ?? "" });
        }
      }
    });

    return statuses;
  }

  const rows: React.ReactNode[] = [];
  let days: React.ReactNode[] = [];
  let day = weekStart;

  while (day <= weekEnd) {
    for (let i = 0; i < 7; i++) {
      const dayKey = format(day, "yyyy-MM-dd");

      const isWithinPrescription =
        (!startDate || day >= startDate) && (!endDate || day <= endDate);

      const dayTracker = medicationTracking?.tracker?.find(
        (t) => t.date === dayKey
      );

      const statuses = isWithinPrescription
        ? getDoseStatus(
            dayKey,
            selectedmedicationData.schedule ?? [],
            dayTracker
          )
        : [];

      days.push(
        <div
          key={day.toISOString()}
          className={`calendar-day h-24 border border-beige-100 rounded-lg p-1
    ${
      isWithinPrescription
        ? isSameMonth(day, monthStart)
          ? "bg-white hover:shadow-md"
          : "bg-beige-50 opacity-50"
        : "bg-gray-100 opacity-30 pointer-events-none"
    }
    ${isSameDay(day, new Date()) ? "bg-brown-50 font-medium text-brown-600" : ""}
    `}
        >
          <div
            className={`text-right text-sm ${
              isSameMonth(day, monthStart)
                ? "text-brown-400"
                : "text-brown-400 opacity-50"
            }`}
          >
            {format(day, dateFormat)}
          </div>
          <div className="mt-1 flex flex-wrap space-x-1">
            {statuses.map((dose, idx) => (
              <div key={idx} className="flex items-center space-x-1">
                <div
                  className={`${colorLegend[dose.status]} rounded-full w-3 h-3 mb-1`}
                  title={dose.status}
                />
                <div className="text-xs text-brown-600">
                  {dose.time}
                  {dose.status === "delayed" && (
                    <span className="text-red-500 ml-1">
                      ({dose.delay} min delay)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(<React.Fragment key={day.toISOString()}>{days}</React.Fragment>);
    days = [];
  }

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
          value={selectedmedicationData.medicationPrescribedId || ""}
          onChange={handleMedicationSelect}
        >
          {prescription?.medicationsPrescribed?.map((medication) => (
            <MenuItem
              value={medication.medicationPrescribedId}
              key={medication.medicationPrescribedId}
            >
              {medication.medication?.name}
            </MenuItem>
          ))}
        </CommonTextfield>
      </div>

      <Collapse in={!!selectedmedicationData.medicationPrescribedId}>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={prevMonth}
              disabled={!canGoPrev}
              className={`text-brown-500 hover:text-brown-700 ${
                !canGoPrev ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Previous Month"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <h3 className="text-lg font-medium text-brown-700">
              {format(currentDate, "MMMM yyyy")}
            </h3>
            <button
              onClick={nextMonth}
              disabled={!canGoNext}
              className={`text-brown-500 hover:text-brown-700 ${
                !canGoNext ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Next Month"
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
              indicatorStyle={colorLegend.delayed}
              heading={`Delayed`}
            />
            <IndicatorLegend
              indicatorStyle={colorLegend.missed}
              heading={`Missed`}
            />
            <IndicatorLegend
              indicatorStyle={colorLegend.scheduled}
              heading={`Scheduled`}
            />
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default TrackerCalender;
