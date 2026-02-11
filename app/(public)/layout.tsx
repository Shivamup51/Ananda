import { PublicNavbar } from "./_components/public-navbar";
import { SiteFooter } from "./_components/site-footer";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,theme(colors.background),theme(colors.background),theme(colors.muted/18))]">
      <PublicNavbar />
      <main className="pt-[72px]">{children}</main>
      <SiteFooter />
    </div>
  );
}
