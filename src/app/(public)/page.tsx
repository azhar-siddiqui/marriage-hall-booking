import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_SETTINGS, formatCurrency } from "@/types";
import {
  Building2,
  CalendarCheck,
  Mail,
  MapPin,
  Moon,
  Phone,
  Search,
  Sun,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const s = DEFAULT_SETTINGS;
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-linear-to-br from-stone-900 via-amber-950 to-stone-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs text-gold-300 mb-6">
              <Building2 className="h-3.5 w-3.5" />
              Premium Wedding Venue
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Your Perfect Celebration Starts Here
            </h1>
            <p className="text-lg text-stone-300 mb-8">{s.hallName}</p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold-500 hover:bg-gold-600 text-white"
              >
                <Link href="/booking">Book Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/availability">Check Availability</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Time Slots & Pricing</h2>
          <p className="text-muted-foreground">
            Choose the slot that works best for your event
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            {
              icon: Sun,
              label: "Morning Slot",
              time: s.morningSlotTime,
              price: s.morningPrice,
              highlight: false,
            },
            {
              icon: Building2,
              label: "Full Day",
              time: "Morning + Evening",
              price: s.bothSlotsPrice,
              highlight: true,
            },
            {
              icon: Moon,
              label: "Evening Slot",
              time: s.eveningSlotTime,
              price: s.eveningPrice,
              highlight: false,
            },
          ].map(({ icon: Icon, label, time, price, highlight }) => (
            <Card
              key={label}
              className={highlight ? "border-2 border-gold-400 shadow-lg" : ""}
            >
              <CardContent className="pt-6 pb-5 text-center">
                {highlight && (
                  <div className="text-xs font-semibold text-gold-700 bg-gold-100 rounded-full px-3 py-1 inline-block mb-3">
                    Best Value
                  </div>
                )}
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-100 text-gold-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-base mb-1">{label}</h3>
                <p className="text-sm text-muted-foreground mb-3">{time}</p>
                <p className="text-2xl font-bold text-gold-700">
                  {formatCurrency(price)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How to book */}
      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">How to Book</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                icon: CalendarCheck,
                step: "01",
                title: "Check Availability",
                desc: "Browse the calendar to find open dates and slots.",
              },
              {
                icon: Building2,
                step: "02",
                title: "Submit Request",
                desc: "Fill in your event details and submit the form.",
              },
              {
                icon: Search,
                step: "03",
                title: "Get Confirmed",
                desc: "Pay offline and receive confirmation from the owner.",
              },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-100">
                  <Icon className="h-6 w-6 text-gold-700" />
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                    {step}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              asChild
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-white"
            >
              <Link href="/booking">Book Your Date</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
          <div className="grid gap-3">
            {[
              { icon: Phone, text: s.contactPhone },
              { icon: Mail, text: s.contactEmail },
              { icon: MapPin, text: s.address },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <Icon className="h-4 w-4 text-gold-600" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
