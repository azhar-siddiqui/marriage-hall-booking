import type {
  Booking,
  BookingFormData,
  DayStatus,
  HallSettings,
} from "@/types";
import { DEFAULT_SETTINGS, calculateAmount } from "@/types";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

const COL = "bookings";

export async function createBooking(
  data: BookingFormData,
  settings: HallSettings = DEFAULT_SETTINGS,
): Promise<string> {
  const conflict = await checkSlotConflict(
    data.date,
    data.slotMorning,
    data.slotEvening,
  );
  if (conflict) throw new Error(conflict);
  const ref = await addDoc(collection(db, COL), {
    customerName: data.customerName.trim(),
    phoneNumber: data.phoneNumber.trim(),
    eventType: data.eventType,
    date: data.date,
    slotMorning: data.slotMorning,
    slotEvening: data.slotEvening,
    status: "pending",
    totalAmount: calculateAmount(data.slotMorning, data.slotEvening, settings),
    notes: data.notes?.trim() || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getAllBookings(): Promise<Booking[]> {
  const snap = await getDocs(
    query(collection(db, COL), orderBy("createdAt", "desc")),
  );
  return snap.docs.map((d) => toBooking(d.id, d.data()));
}

export async function getBookingsByPhone(phone: string): Promise<Booking[]> {
  const snap = await getDocs(
    query(
      collection(db, COL),
      where("phoneNumber", "==", phone.trim()),
      orderBy("createdAt", "desc"),
    ),
  );
  return snap.docs.map((d) => toBooking(d.id, d.data()));
}

export async function getBookingsByDate(date: string): Promise<Booking[]> {
  const snap = await getDocs(
    query(collection(db, COL), where("date", "==", date)),
  );
  return snap.docs.map((d) => toBooking(d.id, d.data()));
}

export async function getBookingsByMonth(
  year: number,
  month: number,
): Promise<Booking[]> {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = `${year}-${String(month).padStart(2, "0")}-31`;
  const snap = await getDocs(
    query(
      collection(db, COL),
      where("date", ">=", start),
      where("date", "<=", end),
      orderBy("date"),
    ),
  );
  return snap.docs.map((d) => toBooking(d.id, d.data()));
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"],
): Promise<void> {
  await updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() });
}

export async function updateBooking(
  id: string,
  data: Partial<Booking>,
): Promise<void> {
  const updates: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };
  delete updates.id;
  delete updates.createdAt;
  await updateDoc(doc(db, COL, id), updates);
}

export async function deleteBooking(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function checkSlotConflict(
  date: string,
  morning: boolean,
  evening: boolean,
  excludeId?: string,
): Promise<string | null> {
  const active = (await getBookingsByDate(date)).filter(
    (b) => b.status !== "cancelled" && b.id !== excludeId,
  );
  if (morning && active.some((b) => b.slotMorning))
    return "Morning slot is already booked for this date.";
  if (evening && active.some((b) => b.slotEvening))
    return "Evening slot is already booked for this date.";
  return null;
}

export async function getDayStatus(date: string): Promise<DayStatus> {
  const active = (await getBookingsByDate(date)).filter(
    (b) => b.status !== "cancelled",
  );
  return {
    date,
    morningBooked: active.some((b) => b.slotMorning),
    eveningBooked: active.some((b) => b.slotEvening),
    morningBooking: active.find((b) => b.slotMorning),
    eveningBooking: active.find((b) => b.slotEvening),
  };
}

export async function getMonthDayStatuses(
  year: number,
  month: number,
): Promise<Record<string, DayStatus>> {
  const active = (await getBookingsByMonth(year, month)).filter(
    (b) => b.status !== "cancelled",
  );
  const map: Record<string, DayStatus> = {};
  for (const b of active) {
    if (!map[b.date])
      map[b.date] = {
        date: b.date,
        morningBooked: false,
        eveningBooked: false,
      };
    if (b.slotMorning) {
      map[b.date].morningBooked = true;
      map[b.date].morningBooking = b;
    }
    if (b.slotEvening) {
      map[b.date].eveningBooked = true;
      map[b.date].eveningBooking = b;
    }
  }
  return map;
}

export function subscribeToBookings(
  cb: (bookings: Booking[]) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, COL), orderBy("createdAt", "desc")),
    (snap) => cb(snap.docs.map((d) => toBooking(d.id, d.data()))),
  );
}

function toBooking(id: string, data: Record<string, unknown>): Booking {
  const iso = (v: unknown) =>
    v instanceof Timestamp
      ? v.toDate().toISOString()
      : new Date().toISOString();
  return {
    id,
    customerName: String(data.customerName ?? ""),
    phoneNumber: String(data.phoneNumber ?? ""),
    eventType: String(data.eventType ?? ""),
    date: String(data.date ?? ""),
    slotMorning: Boolean(data.slotMorning),
    slotEvening: Boolean(data.slotEvening),
    status: (data.status as Booking["status"]) ?? "pending",
    totalAmount: Number(data.totalAmount ?? 0),
    notes: String(data.notes ?? ""),
    createdAt: iso(data.createdAt),
    updatedAt: iso(data.updatedAt),
  };
}
