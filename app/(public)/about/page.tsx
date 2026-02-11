import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const teamMembers = [
  {
    name: "Chitra Singh",
    role: "Founding Editor & Publisher",
    image: "/CS.jpg.jpeg",
    bio: "Anandda was founded by Chitra Singh, a senior journalist, writer, editor, and seeker with over four decades of experience. An independent, high-impact journalist and womanpreneur, she has worked across mainstream media, corporate communication, and long-form editorial spaces. Her journey blends rigorous research, deadline discipline, and a deep spiritual inquiry into life. Anandda reflects her belief that journalism can inform, inspire, and quietly uplift.",
  },
  {
    name: "Sidheshwar Bhalla (Sid)",
    role: "Honorary Consultant Editor",
    image: "/Updated Pic.jpg.jpeg",
    bio: "Fondly known as Sid, CA Sidheshwar Bhalla brings decades of leadership experience from the financial and governance world, along with a deep grounding in mindfulness and inner inquiry. Having worked at the highest levels of professional responsibility, he understands the mental demands and ethical pressures of decision-making. A Jyotish Acharya whose study of sacred knowledge began early in life, his interests also include NLP and the study of consciousness. At Anandda, he integrates mindful awareness with real-world leadership, inspired by Krishna consciousness as a way of living fully and consciously.",
  },
  {
    name: "Neeraj Singh",
    role: "Creative Director - Design & Advertising",
    image: "/Neeraj.jpg.jpeg",
    bio: "Neeraj Singh brings nearly four decades of cross-industry experience as a mentor, communication trainer, publisher, and designer. He founded and published India's first community yellow pages from New Delhi, reaching close to 70,000 readers monthly for nearly three decades. His deeply loved column Nothing New honours timeless ideas that return to us across cultures and centuries. At Anandda, Neeraj curates reflections that carry warmth, simplicity, and enduring wisdom.",
  },
  {
    name: "Nitya Upadhyay",
    role: "Editor-in-Soul",
    image: "/Karuna.jpg.jpeg",
    bio: "Nitya writes from the quiet clarity of a young voice holding both softness and strength. With a background in marketing and law, she brings a grounded understanding of the professional world, combined with the reflective openness of her generation. Her writing explores authenticity, emotional awareness, and inner truth, offering companionship to readers navigating uncertainty and mindful growth.",
  },
  {
    name: "Pratishtha Bhardwaj",
    role: "Advisor - Pathways & Presence",
    image: "/chandnadixit (1).jpg.jpeg",
    bio: "A New Delhi-based corporate communications and public relations professional, Pratishtha brings experience across media relations, stakeholder engagement, content strategy, and brand positioning. In Anandda, she contributes as a consultant, offering intuitive clarity, structured thinking, and a people-centric approach that balances inner awareness with professional realities.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_5%,theme(colors.primary/15),transparent_35%),radial-gradient(circle_at_80%_10%,theme(colors.accent/20),transparent_28%)]" />

      <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-16 sm:px-6 lg:px-8">
        <Badge className="rounded-full px-4 py-1.5 text-xs">About Anandda</Badge>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">About Anandda</h1>
        <p className="max-w-5xl text-base leading-8 text-muted-foreground sm:text-lg">
          Anandda is a global digital monthly magazine devoted to mindful leadership, well-being, and conscious living.
          It is a space where inner awareness meets lived experience, and where clarity, creativity, and reflection find
          thoughtful expression in the rhythm of everyday life.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <Card className="rounded-3xl py-0">
          <CardContent className="space-y-4 px-6 py-6 text-sm leading-8 text-muted-foreground sm:text-base">
            <p>
              Rooted in the understanding that true well-being arises when body, mind, and soul move in harmony,
              Anandda brings together voices from leadership, spirituality, creativity, science, and lived wisdom.
              Each issue is curated with editorial care and quiet intention, offering readers perspectives that feel
              grounded, relevant, and deeply human.
            </p>
            <p>
              Published digitally and available worldwide on Magzter, Anandda reaches an international readership across
              cultures and professions. Through Magzter&apos;s global platform, which serves over 88 million readers
              across 60+ languages and 40+ categories, Anandda travels far beyond geographical boundaries, finding
              readers in corporate spaces, public institutions, and personal moments of reflection. This global
              presence allows the magazine&apos;s ideas, stories, and insights to engage a wide and diverse audience
              seeking clarity and balance in modern life.
            </p>
          </CardContent>
        </Card>
        <div className="relative min-h-[330px] overflow-hidden rounded-3xl border">
          <Image
            src="/WhatsApp Image 2025-10-11 at 3.03.30 PM.jpg.jpeg"
            alt="Anandda team"
            fill
            className="object-cover"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="rounded-3xl bg-card/70 py-0">
          <CardContent className="space-y-4 px-6 py-6 sm:px-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">Our Editorial Philosophy</h2>
            <p className="text-sm leading-8 text-muted-foreground sm:text-base">
              Anandda believes that leadership is as much an inner practice as an external responsibility. Well-being
              is viewed as a lived experience shaped by awareness, choice, and balance. Conscious living, for us, is
              an everyday orientation rather than an abstract ideal.
            </p>
            <p className="text-sm leading-8 text-muted-foreground sm:text-base">
              The magazine flows across themes of mindful leadership, emotional intelligence, spirituality, creativity,
              nature, relationships, work-life harmony, and inner growth. Articles are crafted to feel reflective yet
              accessible, thoughtful yet practical, allowing readers to pause, reflect, and carry insights gently into
              their own lives.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold sm:text-3xl">The People Behind Anandda</h2>
        <p className="max-w-5xl text-sm leading-8 text-muted-foreground sm:text-base">
          Anandda is shaped by an experienced, values-driven team of professionals drawn from journalism, design,
          leadership, and conscious living. The team brings credibility, depth, and long-term editorial alignment to
          every issue.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {teamMembers.map((member) => (
            <Card key={member.name} className="overflow-hidden rounded-3xl py-0">
              <CardContent className="grid gap-4 p-0 sm:grid-cols-[160px_1fr]">
                <div className="relative h-52 sm:h-full">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <div className="space-y-3 px-5 pb-5 pt-4">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                  <p className="text-sm leading-7 text-muted-foreground">{member.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <Card className="rounded-3xl border-none bg-primary py-0 text-primary-foreground">
          <CardContent className="space-y-4 px-6 py-10 sm:px-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">A Living Platform</h2>
            <p className="max-w-5xl text-sm leading-8 text-primary-foreground/90 sm:text-base">
              Anandda is not designed to instruct or persuade. It exists to accompany. Each issue invites readers
              into a slower, more aware engagement with life, leadership, and self. Through its global digital
              presence and thoughtful editorial curation, Anandda continues to grow as a quiet yet resonant platform
              for conscious living in the modern world.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
