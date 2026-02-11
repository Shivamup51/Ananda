import {
  CheckCircle2,
  Compass,
  Layers,
  Lightbulb,
  Mail,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "../_components/section-header";

const offerings = [
  {
    title: "Editorial Strategy",
    desc: "Content planning across blogs, articles, and magazines with clear cadence.",
    icon: Compass,
  },
  {
    title: "Design System",
    desc: "Unified card, typography, spacing, and layout patterns for every page.",
    icon: Layers,
  },
  {
    title: "Publishing Workflow",
    desc: "Admin-managed publishing with discoverable, reader-friendly public surfaces.",
    icon: Lightbulb,
  },
];

export default function OfferingsPage() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Offerings"
        title="Services and Content Programs"
        description="A premium publishing stack built for consistency, readability, and audience trust."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {offerings.map((item) => (
          <Card key={item.title} className="rounded-2xl py-0 shadow-sm">
            <CardHeader className="px-5 pt-5">
              <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-accent">
                <item.icon className="size-5 text-primary" />
              </div>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-sm leading-7 text-muted-foreground">
                {item.desc}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-primary" />
                Available for ongoing programs
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div id="about" className="space-y-3 rounded-3xl border bg-card p-6">
        <h2 className="text-2xl font-semibold">About Us</h2>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          We build intentional digital publishing experiences with strong
          content hierarchy, high-quality typography, and calm interaction
          design.
        </p>
      </div>

      <div id="contact" className="space-y-3 rounded-3xl border bg-card p-6">
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Mail className="size-4" />
            hello@Annanda-editorial.com
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-4" />
            +1 (000) 000-0000
          </p>
        </div>
      </div>
    </section>
  );
}
