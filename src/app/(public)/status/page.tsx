"use client";
import BookingStatusCard from "@/components/booking/BookingStatusCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBookingsByPhone } from "@/lib/bookingService";
import type { Booking } from "@/types";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

export default function StatusPage() {
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    setResults(null);
    setLoading(true);
    try {
      setResults(await getBookingsByPhone(phone));
    } catch {
      setError("Failed to fetch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Track Booking Status</h1>
        <p className="text-muted-foreground mt-1">
          Enter your registered phone number to view your bookings
        </p>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="tel"
            className="pl-9"
            placeholder="Enter 10-digit phone number"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
        </div>
        <Button
          className="bg-gold-500 hover:bg-gold-600 text-white"
          onClick={search}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {results !== null &&
        (results.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">🔍</p>
            <p>No bookings found for this phone number.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {results.length} booking(s) found
            </p>
            {results.map((b) => (
              <BookingStatusCard key={b.id} booking={b} />
            ))}
          </div>
        ))}
    </div>
  );
}
