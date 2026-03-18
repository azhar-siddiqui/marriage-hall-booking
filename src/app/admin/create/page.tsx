import AdminCreateBooking from "@/components/admin/AdminCreateBooking";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminCreatePage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center px-6">
          <div>
            <h1 className="text-lg font-semibold">Create Booking</h1>
            <p className="text-xs text-muted-foreground">
              Book on behalf of a customer
            </p>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <AdminCreateBooking />
        </main>
      </div>
    </div>
  );
}
