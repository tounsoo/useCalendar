import { useEffect, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

export type useCalendarDay = Temporal.PlainDate & {
  readonly isToday: boolean;
};

type useCalendarReturn = Temporal.PlainYearMonth & {
  weeks: useCalendarDay[][];
  nextMonth: () => void;
  prevMonth: () => void;
};

function getDaysInAMonth(date: Temporal.PlainDate, calendar: string) {
  const firstDay = date.with({ day: 1 });
  const today = Temporal.Now.plainDateISO().withCalendar(calendar);

  let days: useCalendarDay[] = [];
  let currentDay = firstDay;
  while (currentDay.month === firstDay.month) {
    Object.defineProperty(currentDay, "isToday", {
      value: today.day === currentDay.day,
    });
    days.push(currentDay as useCalendarDay);
    currentDay = currentDay.add({ days: 1 });
  }
  const lastDay = firstDay.with({ day: days[days.length - 1]?.day });

  return { firstDay, lastDay, days };
}

function splitIntoChunk(arr: Temporal.PlainDate[], chunk: number) {
  let newArr: useCalendarDay[][] = [];
  for (let i = 0; i < arr.length; i += chunk) {
    let tempArray = [];
    tempArray = arr.slice(i, i + chunk);
    newArr.push(tempArray as useCalendarDay[]);
  }
  return newArr;
}

const Calendar = new Intl.DateTimeFormat().resolvedOptions().calendar;

export const useCalendar = (
  value: Temporal.PlainDate = Temporal.Now.plainDateISO(),
  calendar: string = Calendar
) => {
  const [date, setDate] = useState(value.withCalendar(calendar));
  const today = Temporal.Now.plainDateISO().withCalendar(calendar);

  useEffect(() => {
    setDate(value.withCalendar(calendar));
  }, [value, calendar]);

  const { firstDay, lastDay, days } = getDaysInAMonth(date, calendar);

  const monthObject = Temporal.PlainYearMonth.from(firstDay);

  const prevOverflow = Array.from(Array(firstDay.dayOfWeek - 1).keys()).map(
    (n) => {
      const withIsToday = firstDay;
      Object.defineProperty(withIsToday, "isToday", {
        value: today.day === withIsToday.day,
      });
      return withIsToday.subtract({ days: withIsToday.dayOfWeek - n - 1 });
    }
  );

  const nextOverflow = Array.from(Array(7 - lastDay.dayOfWeek).keys()).map(
    (n) => {
      const withIsToday = lastDay;

      Object.defineProperty(withIsToday, "isToday", {
        value: today.day === withIsToday.day,
      });
      return withIsToday.add({ days: n + 1 });
    }
  );

  const daysInMonthArr = [...prevOverflow, ...days, ...nextOverflow];
  const weeks = splitIntoChunk(daysInMonthArr, firstDay.daysInWeek);

  Object.defineProperties(monthObject, {
    weeks: {
      value: weeks,
    },
    nextMonth: {
      value: () => setDate(date.add({ months: 1 })),
    },
    prevMonth: {
      value: () => setDate(date.subtract({ months: 1 })),
    },
  });

  return monthObject as useCalendarReturn;
};
