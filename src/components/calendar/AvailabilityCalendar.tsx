"use client";
import { Button } from "@/components/ui/button";
import { getMonthDayStatuses } from "@/lib/bookingService";
import { cn } from "@/lib/utils";
import type { DayStatus } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  onDateSelect?: (date: string, status: DayStatus | null) => void;
  selectedDate?: string;
  mode?: "view" | "select";
}

export default function AvailabilityCalendar({
  onDateSelect,
  selectedDate,
  mode = "view",
}: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [statuses, setStatuses] = useState<Record<string, DayStatus>>({});
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (y: number, m: number) => {
    setLoading(true);
    try {
      setStatuses(await getMonthDayStatuses(y, m + 1));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(year, month);
  }, [year, month, load]);

  const prev = () =>
    month === 0
      ? (setMonth(11), setYear((y) => y - 1))
      : setMonth((m) => m - 1);
  const next = () =>
    month === 11
      ? (setMonth(0), setYear((y) => y + 1))
      : setMonth((m) => m + 1);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayClass = (dateStr: string, isPast: boolean) => {
    if (isPast) return "opacity-40 cursor-not-allowed bg-muted/40";
    const s = statuses[dateStr];
    if (!s)
      return "hover:bg-accent cursor-pointer border border-transparent hover:border-border transition-colors";
    if (s.morningBooked && s.eveningBooked)
      return mode === "select" ? "cal-full" : "cal-full cursor-pointer";
    if (s.morningBooked || s.eveningBooked) return "cal-partial cursor-pointer";
    return "cal-available cursor-pointer";
  };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={prev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">
          {MONTHS[month]} {year}
        </h3>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={next}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-muted-foreground py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={cn("grid grid-cols-7 gap-1", loading && "opacity-60")}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const dt = new Date(year, month, d);
          const isPast = dt < today;
          const s = statuses[dateStr];
          const isToday = dt.getTime() === today.getTime();

          return (
            <div
              key={d}
              onClick={() => {
                if (isPast) return;
                if (mode === "select" && s?.morningBooked && s?.eveningBooked)
                  return;
                onDateSelect?.(dateStr, s ?? null);
              }}
              className={cn(
                "relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm",
                dayClass(dateStr, isPast),
                selectedDate === dateStr &&
                  "!border-2 !border-gold-500 !bg-gold-50 !text-gold-800 font-semibold",
                isToday &&
                  selectedDate !== dateStr &&
                  "font-bold underline underline-offset-2",
              )}
            >
              <span>{d}</span>
              {s && (
                <div className="flex gap-0.5 mt-0.5">
                  {s.morningBooked && (
                    <div className="h-1 w-1 rounded-full bg-blue-500" />
                  )}
                  {s.eveningBooked && (
                    <div className="h-1 w-1 rounded-full bg-purple-500" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {[
          { cls: "bg-green-100 border border-green-300", label: "Available" },
          {
            cls: "bg-amber-100 border border-amber-300",
            label: "Partially booked",
          },
          { cls: "bg-red-100   border border-red-300", label: "Fully booked" },
        ].map(({ cls, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <div className={cn("h-3 w-3 rounded-sm", cls)} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
