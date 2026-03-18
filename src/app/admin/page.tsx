import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminStats from "@/components/admin/AdminStats";
import AdminBookingTable from "@/components/admin/BookingTable";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center px-6">
          <div>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              Overview of all bookings
            </p>
          </div>
        </header>
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <AdminStats />
          <div>
            <h2 className="text-base font-semibold mb-3">Recent Bookings</h2>
            <AdminBookingTable />
          </div>
        </main>
      </div>
    </div>
  );
}
