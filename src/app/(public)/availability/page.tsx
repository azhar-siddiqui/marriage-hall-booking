"use client";
import SlotSelector from "@/components/booking/SlotSelector";
import AvailabilityCalendar from "@/components/calendar/AvailabilityCalendar";
import { Button } from "@/components/ui/button";
import type { DayStatus } from "@/types";
import { formatDate } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AvailabilityPage() {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<DayStatus | null>(null);
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hall Availability</h1>
        <p className="text-muted-foreground mt-1">
          Select a date to check available time slots
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <AvailabilityCalendar
          onDateSelect={(d, s) => {
            setDate(d);
            setStatus(s);
          }}
          selectedDate={date}
          mode="view"
        />
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          {date ? (
            <>
              <div>
                <h2 className="font-semibold text-base">{formatDate(date)}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Slot availability
                </p>
              </div>
              <SlotSelector
                dayStatus={status}
                morning={false}
                evening={false}
                onToggleMorning={() => {}}
                onToggleEvening={() => {}}
                readonly
              />
              {status?.morningBooked && status?.eveningBooked ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Both slots are booked. Choose another date.
                </p>
              ) : (
                <Button
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white"
                  onClick={() => router.push(`/booking?date=${date}`)}
                >
                  Book This Date
                </Button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground gap-3">
              <div className="text-4xl">📅</div>
              <p className="text-sm">Click on any date to see slot details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
