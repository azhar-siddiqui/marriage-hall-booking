"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteBooking,
  subscribeToBookings,
  updateBooking,
  updateBookingStatus,
} from "@/lib/bookingService";
import type { Booking, BookingStatus } from "@/types";
import { EVENT_TYPES, formatCurrency, formatDate } from "@/types";
import {
  Check,
  Filter,
  Loader2,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminBookingTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [slotF, setSlotF] = useState("all");
  const [dateF, setDateF] = useState("");
  const [editing, setEditing] = useState<Booking | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [eName, setEName] = useState("");
  const [ePhone, setEPhone] = useState("");
  const [eEvent, setEEvent] = useState("");
  const [eStatus, setEStatus] = useState<BookingStatus>("pending");
  const [eNotes, setENotes] = useState("");

  useEffect(
    () =>
      subscribeToBookings((b) => {
        setBookings(b);
        setLoading(false);
      }),
    [],
  );

  const filtered = bookings.filter((b) => {
    if (statusF !== "all" && b.status !== statusF) return false;
    if (dateF && b.date !== dateF) return false;
    if (slotF === "morning" && !b.slotMorning) return false;
    if (slotF === "evening" && !b.slotEvening) return false;
    if (slotF === "both" && (!b.slotMorning || !b.slotEvening)) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        b.customerName.toLowerCase().includes(s) ||
        b.phoneNumber.includes(s) ||
        b.id.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const act = async (id: string, status: BookingStatus) => {
    setBusy(id + status);
    try {
      await updateBookingStatus(id, status);
    } catch {
      setError("Action failed.");
    } finally {
      setBusy(null);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this booking permanently?")) return;
    setBusy(id + "del");
    try {
      await deleteBooking(id);
    } catch {
      setError("Delete failed.");
    } finally {
      setBusy(null);
    }
  };

  const openEdit = (b: Booking) => {
    setEditing(b);
    setEName(b.customerName);
    setEPhone(b.phoneNumber);
    setEEvent(b.eventType);
    setEStatus(b.status);
    setENotes(b.notes ?? "");
    setError("");
  };

  const saveEdit = async () => {
    if (!editing) return;
    setBusy("edit");
    try {
      await updateBooking(editing.id, {
        customerName: eName,
        phoneNumber: ePhone,
        eventType: eEvent,
        status: eStatus,
        notes: eNotes,
      });
      setEditing(null);
    } catch {
      setError("Update failed.");
    } finally {
      setBusy(null);
    }
  };

  const badgeCls = (s: BookingStatus) => {
    let cls;
    if (s === "confirmed") {
      cls = "bg-green-100 text-green-800 border-green-200";
    } else if (s === "cancelled") {
      cls = "bg-red-100 text-red-800 border-red-200";
    } else {
      cls = "bg-amber-100 text-amber-800 border-amber-200";
    }
    return cls;
  };

  const slotCls = (b: Booking) => {
    if (b.slotMorning && b.slotEvening) {
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    } else if (b.slotMorning) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    } else {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name, phone, ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Input
          type="date"
          className="w-44"
          value={dateF}
          onChange={(e) => setDateF(e.target.value)}
        />
        <Select value={statusF} onValueChange={setStatusF}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["all", "pending", "confirmed", "cancelled"].map((v) => (
              <SelectItem key={v} value={v}>
                {v === "all"
                  ? "All Status"
                  : v.charAt(0).toUpperCase() + v.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={slotF} onValueChange={setSlotF}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[
              ["all", "All Slots"],
              ["morning", "Morning"],
              ["evening", "Evening"],
              ["both", "Both"],
            ].map(([v, l]) => (
              <SelectItem key={v} value={v}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearch("");
            setStatusF("all");
            setSlotF("all");
            setDateF("");
          }}
        >
          <Filter className="h-3.5 w-3.5 mr-1.5" />
          Clear
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead className="hidden md:table-cell">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-muted-foreground"
                >
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <p className="font-medium text-sm">{b.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.phoneNumber}
                    </p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">
                    {b.eventType}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(b.date)}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      let slotLabel = "";
                      if (b.slotMorning && b.slotEvening) {
                        slotLabel = "Both";
                      } else if (b.slotMorning) {
                        slotLabel = "Morning";
                      } else {
                        slotLabel = "Evening";
                      }
                      return (
                        <Badge className={slotCls(b)}>
                          {slotLabel}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm font-medium">
                    {formatCurrency(b.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge className={badgeCls(b.status)}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {b.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-green-700 border-green-200 hover:bg-green-50"
                          disabled={!!busy}
                          onClick={() => act(b.id, "confirmed")}
                        >
                          {busy === b.id + "confirmed" ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      )}
                      {b.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-red-700 border-red-200 hover:bg-red-50"
                          disabled={!!busy}
                          onClick={() => act(b.id, "cancelled")}
                        >
                          {busy === b.id + "cancelled" ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2"
                        onClick={() => openEdit(b)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-red-600 hover:bg-red-50"
                        disabled={!!busy}
                        onClick={() => del(b.id)}
                      >
                        {busy === b.id + "del" ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        {filtered.length} of {bookings.length} bookings
      </p>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={eName}
                  onChange={(e) => setEName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={ePhone}
                  onChange={(e) => setEPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Event Type</Label>
              <Select value={eEvent} onValueChange={setEEvent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={eStatus}
                onValueChange={(v) => setEStatus(v as BookingStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={eNotes}
                onChange={(e) => setENotes(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              className="bg-gold-500 hover:bg-gold-600 text-white"
              onClick={saveEdit}
              disabled={busy === "edit"}
            >
              {busy === "edit" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
