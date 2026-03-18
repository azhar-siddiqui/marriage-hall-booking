import BookingForm from "@/components/booking/BookingForm";

export default function BookingPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Book the Hall</h1>
        <p className="text-muted-foreground mt-1">
          Select your date, choose a slot, and submit your request
        </p>
      </div>
      <BookingForm />
    </div>
  );
}
