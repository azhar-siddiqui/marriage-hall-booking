"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SlotSelector from "@/components/booking/SlotSelector";
import AvailabilityCalendar from "@/components/calendar/AvailabilityCalendar";
import type { DayStatus } from "@/types";
import { formatDate } from "@/types";
import { useState } from "react";

export default function AdminCalendarPage() {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<DayStatus | null>(null);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center px-6">
          <div>
            <h1 className="text-lg font-semibold">Calendar View</h1>
            <p className="text-xs text-muted-foreground">
              Visual overview of hall occupancy
            </p>
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="grid lg:grid-cols-2 gap-6 items-start max-w-4xl">
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
                    <h2 className="font-semibold">{formatDate(date)}</h2>
                    <p className="text-sm text-muted-foreground">Slot status</p>
                  </div>
                  <SlotSelector
                    dayStatus={status}
                    morning={false}
                    evening={false}
                    onToggleMorning={() => {}}
                    onToggleEvening={() => {}}
                    readonly
                  />
                  {status?.morningBooking && (
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm">
                      <p className="font-medium text-blue-800 mb-1">
                        Morning Booking
                      </p>
                      <p className="text-blue-700">
                        {status.morningBooking.customerName}
                      </p>
                      <p className="text-xs text-blue-600">
                        {status.morningBooking.eventType} ·{" "}
                        {status.morningBooking.phoneNumber}
                      </p>
                    </div>
                  )}
                  {status?.eveningBooking && (
                    <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 text-sm">
                      <p className="font-medium text-purple-800 mb-1">
                        Evening Booking
                      </p>
                      <p className="text-purple-700">
                        {status.eveningBooking.customerName}
                      </p>
                      <p className="text-xs text-purple-600">
                        {status.eveningBooking.eventType} ·{" "}
                        {status.eveningBooking.phoneNumber}
                      </p>
                    </div>
                  )}
                  {!status?.morningBooking && !status?.eveningBooking && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Both slots available on this date.
                    </p>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground gap-3">
                  <div className="text-4xl">📅</div>
                  <p className="text-sm">Click a date to see booking details</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
