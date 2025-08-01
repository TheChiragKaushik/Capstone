import React, { useState } from "react";
// You can also use dayjs or Luxon; date-fns is similar.
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
} from "date-fns";
import CommonTextfield from "../../Common/CommonTextfield";
import { IndicatorLegend } from "../../../utils/Constants";

const colorLegend: Record<string, string> = {
  taken: "bg-green-200",
  delayed: "bg-yellow-200",
  missed: "bg-red-300",
  scheduled: "bg-beige-200",
};
const eventData: Record<string, string[]> = {
  "2023-06-01": ["taken", "taken", "taken", "missed"],
  "2023-06-02": ["taken", "missed", "delayed"],
};

const CalendarNavigation = () => {
  const [currentDate, setCurrentDate] = useState(new Date("2023-06-01"));

  const prevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const nextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const weekStart = startOfWeek(monthStart);
  const weekEnd = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = weekStart;

  while (day <= weekEnd) {
    for (let i = 0; i < 7; i++) {
      const dayKey = format(day, "yyyy-MM-dd");
      days.push(
        <div
          key={day.toISOString()}
          className={`calendar-day h-24 border border-beige-100 rounded-lg p-1 
            ${isSameMonth(day, monthStart) ? "bg-white hover:shadow-md" : "bg-beige-50 opacity-50"}
            ${isSameDay(day, new Date()) ? "bg-brown-50 font-medium text-brown-600" : ""}
          `}
        >
          <div
            className={`text-right text-sm ${isSameMonth(day, monthStart) ? "text-brown-400" : "text-brown-400 opacity-50"}`}
          >
            {format(day, dateFormat)}
          </div>
          <div className="mt-1">
            {(eventData[dayKey] || []).map((type, idx) => (
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
        />
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={prevMonth}
            className="text-brown-500 hover:text-brown-700"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <h3 className="text-lg font-medium text-brown-700">
            {format(currentDate, "MMMM yyyy")}
          </h3>
          <button
            onClick={nextMonth}
            className="text-brown-500 hover:text-brown-700"
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
    </>
  );
};

export default CalendarNavigation;
