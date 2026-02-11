import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const contactItems = [
  {
    label: "Address",
    value: "New Delhi, India.",
    href: "",
    icon: MapPin,
  },
  {
    label: "Phone",
    value: "+91-9205933455",
    href: "tel:+919205933455",
    icon: Phone,
  },
  {
    label: "Phone",
    value: "+91-9205933455",
    href: "tel:+919205933455",
    icon: Phone,
  },
  {
    label: "Email",
    value: "ananddaofficial@gmail.com",
    href: "mailto:ananddaofficial@gmail.com",
    icon: Mail,
  },
  {
    label: "Instagram",
    value: "ananddaofficial",
    href: "https://instagram.com/ananddaofficial",
    icon: Instagram,
  },
  {
    label: "LinkedIn",
    value: "anandda-bliss",
    href: "https://linkedin.com/company/anandda-bliss",
    icon: Linkedin,
  },
];

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_6%,theme(colors.primary/14),transparent_34%),radial-gradient(circle_at_88%_8%,theme(colors.accent/18),transparent_28%)]" />

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Badge className="rounded-full px-4 py-1.5 text-xs">Contact</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Contact Anandda
        </h1>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="relative min-h-[420px] overflow-hidden rounded-3xl border">
          <Image
            src="/logo.png"
            alt="Contact Anandda"
            fill
            className="object-cover"
          />
        </div>

        <Card className="rounded-3xl py-0">
          <CardContent className="space-y-4 px-6 py-6">
            {contactItems.map((item, idx) => (
              <div
                key={`${item.label}-${idx}`}
                className="rounded-xl border px-4 py-3"
              >
                <div className="mb-1 flex items-center gap-2 text-primary">
                  <item.icon className="size-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                    {item.label}
                  </p>
                </div>
                {item.href ? (
                  <Link
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http") ? "noreferrer" : undefined
                    }
                    className="text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    {item.value}
                  </Link>
                ) : (
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
