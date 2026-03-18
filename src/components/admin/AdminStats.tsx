"use client";
import { subscribeToBookings } from "@/lib/bookingService";
import type { Booking } from "@/types";
import { formatCurrency } from "@/types";
import {
  CheckCircle,
  Clock,
  IndianRupee,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminStats() {
  const [s, setS] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    revenue: 0,
  });

  useEffect(
    () =>
      subscribeToBookings((b: Booking[]) =>
        setS({
          total: b.length,
          pending: b.filter((x) => x.status === "pending").length,
          confirmed: b.filter((x) => x.status === "confirmed").length,
          cancelled: b.filter((x) => x.status === "cancelled").length,
          revenue: b
            .filter((x) => x.status === "confirmed")
            .reduce((acc, x) => acc + x.totalAmount, 0),
        }),
      ),
    [],
  );

  const cards = [
    {
      label: "Total Bookings",
      val: s.total,
      icon: TrendingUp,
      cls: "bg-blue-100 text-blue-600",
    },
    {
      label: "Pending",
      val: s.pending,
      icon: Clock,
      cls: "bg-amber-100 text-amber-600",
    },
    {
      label: "Confirmed",
      val: s.confirmed,
      icon: CheckCircle,
      cls: "bg-green-100 text-green-600",
    },
    {
      label: "Cancelled",
      val: s.cancelled,
      icon: XCircle,
      cls: "bg-red-100 text-red-600",
    },
    {
      label: "Revenue",
      val: formatCurrency(s.revenue),
      icon: IndianRupee,
      cls: "bg-gold-100 text-gold-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map(({ label, val, icon: Icon, cls }) => (
        <div key={label} className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${cls}`}
            >
              <Icon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight">{val}</p>
        </div>
      ))}
    </div>
  );
}
