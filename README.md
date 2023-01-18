# useCalendar

## Custom Hook for Calendar

This is a custom hook that uses [Temporal](https://tc39.es/proposal-temporal/docs/) to return calendar objects.

> Currently using [polyfill](https://github.com/js-temporal/temporal-polyfill) as Temporal is in stage 3

## API

### Parameters

| Name     | Type               | Default Value                                          |
| -------- | ------------------ | ------------------------------------------------------ |
| value    | Temporal.PlainDate | `Temporal.Now.plainDateIS()`                           |
| calendar | string             | `new Intl.DateTimeFormat().resolvedOptions().calendar` |

### Return

This extends `Temporal.PlainYearMonth`.

| Name      | Type               |
| --------- | ------------------ |
| weeks     | useCalendarDay[][] |
| nextMonth | () => void         |
| prevMonth | () => void         |

## Examples

### Getting Month Year String

```typescript
import { useCalendar } from "@tounsoo/usecalendar";

const cal = useCalendar("2023-01-17");

const monthString = cal.toLocaleString("en-US", {
  month: monthFormat,
});
const yearString = cal.toLocaleString("en-US", {
  year: yearFormat,
});

const Header = `${monthString} ${yearString}`;
// ^ January 2023
```

### Changing Month

```typescript
import { useCalendar } from "@tounsoo/usecalendar";

const cal = useCalendar("2023-01-17");

const monthString = cal.month; // -> 1

cal.nextMonth();

const afterChange = cal.month; // -> 2
```
