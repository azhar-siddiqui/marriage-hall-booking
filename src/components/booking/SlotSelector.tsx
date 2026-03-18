"use client";
import { cn } from "@/lib/utils";
import type { DayStatus, HallSettings } from "@/types";
import { DEFAULT_SETTINGS, formatCurrency } from "@/types";
import { CheckCircle2, Moon, Sun, XCircle } from "lucide-react";

interface Props {
  dayStatus: DayStatus | null;
  morning: boolean;
  evening: boolean;
  onToggleMorning: () => void;
  onToggleEvening: () => void;
  settings?: HallSettings;
  readonly?: boolean;
}

export default function SlotSelector({
  dayStatus,
  morning,
  evening,
  onToggleMorning,
  onToggleEvening,
  settings = DEFAULT_SETTINGS,
  readonly = false,
}: Readonly<Props>) {
  const mBooked = dayStatus?.morningBooked ?? false;
  const eBooked = dayStatus?.eveningBooked ?? false;
  const total =
    morning && evening
      ? settings.bothSlotsPrice
      : (morning ? settings.morningPrice : 0) +
        (evening ? settings.eveningPrice : 0);

  const SlotCard = ({
    type,
    Icon,
    label,
    time,
    price,
    booked,
    selected,
    onToggle,
  }: {
    type: string;
    Icon: typeof Sun;
    label: string;
    time: string;
    price: number;
    booked: boolean;
    selected: boolean;
    onToggle: () => void;
  }) => (
    <div
      onClick={!booked && !readonly ? onToggle : undefined}
      className={cn(
        "flex items-center justify-between rounded-xl border-2 p-4 transition-all",
        booked
          ? "cursor-not-allowed border-red-200 bg-red-50 opacity-70"
          : readonly
            ? "border-border bg-card"
            : selected
              ? "cursor-pointer border-gold-400 bg-gold-50 shadow-sm"
              : "cursor-pointer border-border bg-card hover:bg-accent/50 hover:border-border/80",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            type === "morning"
              ? "bg-blue-100 text-blue-600"
              : "bg-purple-100 text-purple-600",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-sm">{label} Slot</p>
          <p className="text-xs text-muted-foreground">{time}</p>
          {booked && (
            <p className="text-xs text-red-600 mt-0.5">
              Booked —{" "}
              {type === "morning"
                ? dayStatus?.morningBooking?.eventType
                : dayStatus?.eveningBooking?.eventType}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <p className="font-semibold text-gold-700">{formatCurrency(price)}</p>
        {booked ? (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            <XCircle className="h-3 w-3" />
            Booked
          </span>
        ) : selected ? (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-3 w-3" />
            Selected
          </span>
        ) : (
          <span className="rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-xs font-medium text-green-700">
            Available
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <SlotCard
        type="morning"
        Icon={Sun}
        label="Morning"
        time={settings.morningSlotTime}
        price={settings.morningPrice}
        booked={mBooked}
        selected={morning}
        onToggle={onToggleMorning}
      />
      <SlotCard
        type="evening"
        Icon={Moon}
        label="Evening"
        time={settings.eveningSlotTime}
        price={settings.eveningPrice}
        booked={eBooked}
        selected={evening}
        onToggle={onToggleEvening}
      />
      {(morning || evening) && (
        <div className="rounded-lg border border-gold-200 bg-gold-50 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Estimated total</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {morning && evening
                ? "Full day discount applied"
                : morning
                  ? "Morning slot"
                  : "Evening slot"}
            </p>
          </div>
          <p className="text-xl font-bold text-gold-700">
            {formatCurrency(total)}
          </p>
        </div>
      )}
    </div>
  );
}
