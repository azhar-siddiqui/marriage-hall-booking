"use client";
import SlotSelector from "@/components/booking/SlotSelector";
import AvailabilityCalendar from "@/components/calendar/AvailabilityCalendar";
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
import { createBooking } from "@/lib/bookingService";
import type { DayStatus } from "@/types";
import {
  DEFAULT_SETTINGS,
  EVENT_TYPES,
  formatCurrency,
  formatDate,
  getSlotLabel,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  eventType: z.string().min(1, "Please select an event type"),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const STEPS = ["Date & Slot", "Your Details", "Review & Confirm"];

export default function BookingForm() {
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [dayStatus, setDayStatus] = useState<DayStatus | null>(null);
  const [morning, setMorning] = useState(false);
  const [evening, setEvening] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const vals = watch();

  const total =
    morning && evening
      ? DEFAULT_SETTINGS.bothSlotsPrice
      : (morning ? DEFAULT_SETTINGS.morningPrice : 0) +
        (evening ? DEFAULT_SETTINGS.eveningPrice : 0);

  const onSubmit = async (data: FormData) => {
    setError("");
    setSubmitting(true);
    try {
      const id = await createBooking({
        ...data,
        date: selectedDate,
        slotMorning: morning,
        slotEvening: evening,
      });
      setBookingId(id);
      setStep(3);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to submit. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 3)
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Booking Request Submitted!</h2>
        <p className="text-muted-foreground max-w-md">
          Your request has been received. The hall owner will confirm after
          offline payment.
        </p>
        <div className="rounded-xl border bg-card p-6 text-left w-full max-w-md shadow-sm divide-y">
          {[
            { label: "Booking ID", value: bookingId },
            { label: "Date", value: formatDate(selectedDate) },
            { label: "Slot", value: getSlotLabel(morning, evening) },
            { label: "Amount", value: formatCurrency(total) },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2.5 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
        <Alert className="max-w-md text-left border-blue-200 bg-blue-50 text-blue-800">
          <AlertDescription>
            Save your Booking ID: <strong>{bookingId}</strong>
          </AlertDescription>
        </Alert>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/status")}
          >
            Track Status
          </Button>
          <Button
            className="bg-gold-500 hover:bg-gold-600 text-white"
            onClick={() => window.location.reload()}
          >
            New Booking
          </Button>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                i < step
                  ? "bg-green-500 text-white"
                  : i === step
                    ? "bg-gold-500 text-white"
                    : "bg-muted text-muted-foreground",
              ].join(" ")}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={[
                "text-sm font-medium hidden sm:block",
                i === step ? "text-foreground" : "text-muted-foreground",
              ].join(" ")}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 */}
      {step === 0 && (
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <AvailabilityCalendar
            onDateSelect={(d, s) => {
              setSelectedDate(d);
              setDayStatus(s);
              setMorning(false);
              setEvening(false);
            }}
            selectedDate={selectedDate}
            mode="select"
          />
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="font-semibold mb-1">
                {selectedDate ? formatDate(selectedDate) : "Select a date"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedDate
                  ? "Choose your preferred slot(s)"
                  : "Click a date on the calendar"}
              </p>
              {selectedDate ? (
                <SlotSelector
                  dayStatus={dayStatus}
                  morning={morning}
                  evening={evening}
                  onToggleMorning={() => setMorning((v) => !v)}
                  onToggleEvening={() => setEvening((v) => !v)}
                />
              ) : (
                <div className="rounded-lg border-2 border-dashed p-8 text-center text-sm text-muted-foreground">
                  No date selected
                </div>
              )}
            </div>
            <Button
              className="w-full bg-gold-500 hover:bg-gold-600 text-white"
              disabled={!selectedDate || (!morning && !evening)}
              onClick={() => setStep(1)}
            >
              Continue to Details <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="max-w-lg space-y-5">
          <div className="rounded-lg border bg-accent/40 px-4 py-3 text-sm">
            <span className="font-medium">{formatDate(selectedDate)}</span>
            {" · "}
            <span className="text-muted-foreground">
              {getSlotLabel(morning, evening)}
            </span>
            {" · "}
            <span className="font-semibold text-gold-700">
              {formatCurrency(total)}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input
                placeholder="Your full name"
                {...register("customerName")}
              />
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
                placeholder="10-digit number"
                maxLength={10}
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-destructive">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Event Type *</Label>
            <Select onValueChange={(v) => setValue("eventType", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
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
            <Label>
              Notes <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              placeholder="Any special requirements…"
              {...register("notes")}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(0)}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <Button
              className="flex-1 bg-gold-500 hover:bg-gold-600 text-white"
              onClick={handleSubmit(() => setStep(2))}
            >
              Review Booking <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="max-w-lg space-y-4">
          <div className="rounded-xl border bg-card shadow-sm divide-y">
            {[
              { label: "Full Name", value: vals.customerName },
              { label: "Phone", value: vals.phoneNumber },
              { label: "Event Type", value: vals.eventType },
              { label: "Date", value: formatDate(selectedDate) },
              { label: "Slot", value: getSlotLabel(morning, evening) },
              { label: "Notes", value: vals.notes || "—" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between px-5 py-3 text-sm"
              >
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-4 bg-gold-50 rounded-b-xl">
              <span className="font-semibold">Total (offline payment)</span>
              <span className="text-xl font-bold text-gold-700">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
          <Alert className="border-blue-200 bg-blue-50 text-blue-800">
            <AlertDescription>
              Payment is collected offline. Admin confirms after payment.
            </AlertDescription>
          </Alert>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <Button
              className="flex-1 bg-gold-500 hover:bg-gold-600 text-white"
              onClick={handleSubmit(onSubmit)}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Booking Request"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
