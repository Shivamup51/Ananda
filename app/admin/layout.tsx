import { GalleryVerticalEnd } from "lucide-react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />

        <SidebarInset className="flex flex-1 flex-col">
          {/* HEADER */}
          <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="shrink-0" />
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </header>

          {/* CONTENT AREA */}
          <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
