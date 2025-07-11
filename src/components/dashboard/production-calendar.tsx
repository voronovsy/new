
"use client"

import * as React from "react"
import { format } from "date-fns"
import { ru } from 'date-fns/locale'
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import type { Holiday } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

type ProductionCalendarProps = {
  holidays: Holiday[]
  className?: string
}

export default function ProductionCalendar({ holidays, className }: ProductionCalendarProps) {
  const [month, setMonth] = React.useState<Date>(new Date());
  
  const holidayDates = React.useMemo(() => holidays.map(h => {
    const date = new Date(h.date);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset);
  }), [holidays]);
  
  const holidaysByMonth = React.useMemo(() => {
    return holidays.filter(h => {
        const holidayDate = new Date(h.date);
        const userTimezoneOffset = holidayDate.getTimezoneOffset() * 60000;
        const adjustedHolidayDate = new Date(holidayDate.getTime() + userTimezoneOffset);
        return adjustedHolidayDate.getMonth() === month.getMonth() && adjustedHolidayDate.getFullYear() === month.getFullYear();
    });
  }, [holidays, month]);

  const footer = (
    <div className="mt-4 px-1">
      <h4 className="text-sm font-medium mb-2 px-3">Праздники в {format(month, 'LLLL yyyy', { locale: ru })}</h4>
      <ScrollArea className="h-24">
        <div className="space-y-2 px-3">
          {holidaysByMonth.length > 0 ? holidaysByMonth.map(holiday => (
            <div key={holiday.date} className="text-xs text-muted-foreground flex items-center gap-2">
               <Badge variant="secondary" className="font-mono text-center min-w-[30px]">{format(new Date(holiday.date), 'd')}</Badge>
               <span>{holiday.name}</span>
            </div>
          )) : (
            <p className="text-xs text-muted-foreground">В этом месяце нет государственных праздников.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Производственный календарь</CardTitle>
        <CardDescription>Государственные праздники РФ</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-0">
        <DayPicker
          mode="single"
          month={month}
          onMonthChange={setMonth}
          locale={ru}
          modifiers={{ holiday: holidayDates }}
          modifiersClassNames={{
            holiday: 'rdp-day_holiday'
          }}
          footer={footer}
          showOutsideDays
          fixedWeeks
          className="p-3"
          classNames={{
            head_cell: 'w-10',
            cell: 'w-10'
          }}
        />
      </CardContent>
    </Card>
  )
}
