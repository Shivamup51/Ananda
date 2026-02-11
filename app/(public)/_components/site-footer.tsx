import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Magazines", href: "/magazines" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Anandda"
              width={48}
              height={48}
              className="size-12 rounded-lg border object-cover"
            />
            <div>
              <p className="text-lg font-semibold">Anandda</p>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Global Digital Monthly Magazine
              </p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Mindful leadership, well-being, and conscious living for modern readers.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-wide">Quick Links</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-wide">Connect</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <MapPin className="size-4" />
              New Delhi, India.
            </p>
            <Link href="tel:+919205933455" className="flex items-center gap-2 transition hover:text-foreground">
              <Phone className="size-4" />
              +91-9205933455
            </Link>
            <Link
              href="mailto:ananddaofficial@gmail.com"
              className="flex items-center gap-2 transition hover:text-foreground"
            >
              <Mail className="size-4" />
              ananddaofficial@gmail.com
            </Link>
          </div>
          <div className="flex items-center gap-3 pt-1 text-muted-foreground">
            <Link
              href="https://instagram.com/ananddaofficial"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-md border p-2 transition hover:border-primary/40 hover:text-foreground"
            >
              <Instagram className="size-4" />
            </Link>
            <Link
              href="https://linkedin.com/company/anandda-bliss"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="rounded-md border p-2 transition hover:border-primary/40 hover:text-foreground"
            >
              <Linkedin className="size-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs tracking-wide text-muted-foreground sm:px-6 lg:px-8">
        Copyright {new Date().getFullYear()} Anandda. All rights reserved.
      </div>
    </footer>
  );
}
