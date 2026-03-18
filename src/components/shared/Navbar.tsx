"use client";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Building2,
  Calendar,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", icon: Building2 },
  { href: "/availability", label: "Availability", icon: Calendar },
  { href: "/booking", label: "Book Now", icon: BookOpen },
  { href: "/status", label: "My Booking", icon: Search },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-none">Shubh Vivah</p>
            <p className="text-xs text-muted-foreground">Marriage Hall</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname.startsWith("/admin")
              ? "bg-gold-500 text-white"
              : "border border-gold-300 text-gold-700 hover:bg-gold-50",
          )}
        >
          <ShieldCheck className="h-4 w-4" />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex border-t">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 px-2 py-2 text-xs font-medium transition-colors",
              pathname === href
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
