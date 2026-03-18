import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminBookingTable from "@/components/admin/BookingTable";

export default function AdminBookingsPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center px-6">
          <div>
            <h1 className="text-lg font-semibold">All Bookings</h1>
            <p className="text-xs text-muted-foreground">
              Manage, confirm, and update bookings
            </p>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <AdminBookingTable />
        </main>
      </div>
    </div>
  );
}
