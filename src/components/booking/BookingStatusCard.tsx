import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Booking } from "@/types";
import { formatCurrency, formatDate, getSlotLabel } from "@/types";
import { CalendarDays, Clock, IndianRupee, Phone, User } from "lucide-react";

export default function BookingStatusCard({ booking }: { booking: Booking }) {
  const stripe =
    booking.status === "confirmed"
      ? "bg-green-400"
      : booking.status === "cancelled"
        ? "bg-red-400"
        : "bg-amber-400";

  const badge =
    booking.status === "confirmed"
      ? "bg-green-100 text-green-800 border-green-200"
      : booking.status === "cancelled"
        ? "bg-red-100 text-red-800 border-red-200"
        : "bg-amber-100 text-amber-800 border-amber-200";

  return (
    <Card className="overflow-hidden">
      <div className={`h-1.5 ${stripe}`} />
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-base">{booking.eventType}</p>
            <p className="text-xs text-muted-foreground font-mono">
              {booking.id}
            </p>
          </div>
          <Badge className={badge}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { icon: CalendarDays, text: formatDate(booking.date) },
            {
              icon: Clock,
              text: getSlotLabel(booking.slotMorning, booking.slotEvening),
            },
            { icon: User, text: booking.customerName },
            { icon: Phone, text: booking.phoneNumber },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-sm text-muted-foreground">Total Amount</span>
          <span className="font-bold text-gold-700 flex items-center gap-1">
            <IndianRupee className="h-4 w-4" />
            {formatCurrency(booking.totalAmount).replace("₹", "")}
          </span>
        </div>
        {booking.status === "pending" && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
            Awaiting admin confirmation after offline payment.
          </div>
        )}
        {booking.status === "confirmed" && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-xs text-green-800">
            Your booking is confirmed. See you on the big day!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
