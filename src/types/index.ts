export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  customerName: string;
  phoneNumber: string;
  eventType: string;
  date: string;
  slotMorning: boolean;
  slotEvening: boolean;
  status: BookingStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  customerName: string;
  phoneNumber: string;
  eventType: string;
  date: string;
  slotMorning: boolean;
  slotEvening: boolean;
  notes?: string;
}

export interface DayStatus {
  date: string;
  morningBooked: boolean;
  eveningBooked: boolean;
  morningBooking?: Booking;
  eveningBooking?: Booking;
}

export interface HallSettings {
  hallName: string;
  morningSlotTime: string;
  eveningSlotTime: string;
  morningPrice: number;
  eveningPrice: number;
  bothSlotsPrice: number;
  contactPhone: string;
  contactEmail: string;
  address: string;
}

export const DEFAULT_SETTINGS: HallSettings = {
  hallName: "Shubh Vivah Marriage Hall",
  morningSlotTime: "6:00 AM – 3:00 PM",
  eveningSlotTime: "4:00 PM – 11:00 PM",
  morningPrice: 45000,
  eveningPrice: 55000,
  bothSlotsPrice: 90000,
  contactPhone: "+91 98765 43210",
  contactEmail: "info@shubhvivah.com",
  address: "123, Main Road, City – 440001",
};

export const EVENT_TYPES = [
  "Marriage",
  "Reception",
  "Engagement",
  "Birthday",
  "Anniversary",
  "Corporate Event",
  "Baby Shower",
  "Pooja / Religious Event",
  "Other",
] as const;

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getSlotLabel = (morning: boolean, evening: boolean) => {
  if (morning && evening) return "Full Day (Morning + Evening)";
  if (morning) return "Morning Only";
  if (evening) return "Evening Only";
  return "None";
};

export const calculateAmount = (
  morning: boolean,
  evening: boolean,
  settings: HallSettings,
) => {
  if (morning && evening) return settings.bothSlotsPrice;
  if (morning) return settings.morningPrice;
  if (evening) return settings.eveningPrice;
  return 0;
};
