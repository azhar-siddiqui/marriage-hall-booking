"use client";
import SlotSelector from "@/components/booking/SlotSelector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createBooking,
  getDayStatus,
  updateBookingStatus,
} from "@/lib/bookingService";
import type { DayStatus } from "@/types";
import {
  DEFAULT_SETTINGS,
  EVENT_TYPES,
  formatCurrency,
  formatDate,
  getSlotLabel,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  customerName: z.string().min(2, "Name required"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Enter valid 10-digit phone"),
  eventType: z.string().min(1, "Select event type"),
  date: z.string().min(1, "Select a date"),
  notes: z.string().optional(),
  status: z.enum(["pending", "confirmed"]),
});
type FD = z.infer<typeof schema>;

export default function AdminCreateBooking() {
  const [morning, setMorning] = useState(false);
  const [evening, setEvening] = useState(false);
  const [status, setDayS] = useState<DayStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loadSlot, setLoadSlot] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: { status: "confirmed" },
  });
  const dateVal = watch("date");

  const total =
    morning && evening
      ? DEFAULT_SETTINGS.bothSlotsPrice
      : (morning ? DEFAULT_SETTINGS.morningPrice : 0) +
        (evening ? DEFAULT_SETTINGS.eveningPrice : 0);

  const onDateChange = async (d: string) => {
    setValue("date", d);
    setMorning(false);
    setEvening(false);
    setDayS(null);
    if (!d) return;
    setLoadSlot(true);
    try {
      setDayS(await getDayStatus(d));
    } finally {
      setLoadSlot(false);
    }
  };

  const onSubmit = async (data: FD) => {
    if (!morning && !evening) {
      setError("Select at least one slot.");
      return;
    }
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const id = await createBooking({
        ...data,
        slotMorning: morning,
        slotEvening: evening,
      });
      if (data.status === "confirmed")
        await updateBookingStatus(id, "confirmed");
      setSuccess(`Booking ${id} created!`);
      reset();
      setMorning(false);
      setEvening(false);
      setDayS(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create booking.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Customer Name *</Label>
            <Input placeholder="Full name" {...register("customerName")} />
            {errors.customerName && (
              <p className="text-xs text-destructive">
                {errors.customerName.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Phone Number *</Label>
            <Input
              type="tel"
              maxLength={10}
              placeholder="10-digit number"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-xs text-destructive">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Event Type *</Label>
            <Select onValueChange={(v) => setValue("eventType", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.eventType && (
              <p className="text-xs text-destructive">
                {errors.eventType.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Date *</Label>
            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              {...register("date")}
              onChange={(e) => onDateChange(e.target.value)}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Slot Selection *</Label>
          {loadSlot ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking availability…
            </div>
          ) : (
            <SlotSelector
              dayStatus={status}
              morning={morning}
              evening={evening}
              onToggleMorning={() => setMorning((v) => !v)}
              onToggleEvening={() => setEvening((v) => !v)}
            />
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Initial Status</Label>
          <Select
            defaultValue="confirmed"
            onValueChange={(v) =>
              setValue("status", v as "pending" | "confirmed")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>
            Notes <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea placeholder="Additional notes…" {...register("notes")} />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          className="w-full bg-gold-500 hover:bg-gold-600 text-white"
          disabled={busy}
        >
          {busy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating…
            </>
          ) : (
            "Create Booking"
          )}
        </Button>
      </form>

      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4 sticky top-20">
        <h3 className="font-semibold">Booking Summary</h3>
        {dateVal || morning || evening ? (
          <div className="divide-y text-sm">
            {[
              { label: "Date", value: dateVal ? formatDate(dateVal) : "—" },
              {
                label: "Slot",
                value:
                  morning || evening ? getSlotLabel(morning, evening) : "—",
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
            {(morning || evening) && (
              <div className="flex justify-between py-3">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg text-gold-700">
                  {formatCurrency(total)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Fill in the form to see a summary
          </p>
        )}
      </div>
    </div>
  );
}
