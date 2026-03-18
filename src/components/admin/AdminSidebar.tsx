"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  List,
  LogOut,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "All Bookings", icon: List },
  { href: "/admin/calendar", label: "Calendar View", icon: CalendarDays },
  { href: "/admin/create", label: "Create Booking", icon: PlusCircle },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="flex flex-col w-60 min-h-screen border-r bg-card shrink-0">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500 text-white shrink-0">
          <Building2 className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">Shubh Vivah</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active(href, exact)
                ? "bg-gold-500 text-white shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={async () => {
            await logout();
            router.replace("/admin/login");
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
