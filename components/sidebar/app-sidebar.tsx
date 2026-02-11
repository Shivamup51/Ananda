"use client";

import * as React from "react";
import {
  LayoutDashboard,
  BookOpen,
  Book,
  FileText,
  CalendarDays,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Articles",
      url: "/admin/articles",
      icon: FileText,
    },

    {
      title: "Magzine",
      url: "/admin/magazine",
      icon: Book,
    },

    {
      title: "Events",
      url: "/admin/events",
      icon: CalendarDays,
    },
    {
      title: "Press",
      url: "/admin/press",
      icon: Newspaper,
    },
    {
      title: "Blogs",
      url: "/admin/blogs",
      icon: BookOpen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = authClient.useSession();
  const user = session.data?.user;

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-3">
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-accent"
        >
          <Image
            src="/logo.png"
            alt="Anandda"
            width={32}
            height={32}
            className="h-8 w-8 rounded-md object-cover"
          />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold">Anandda</p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              Admin Studio
            </p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.name || "User",
              email: user.email || "",
              avatar: user.image || "",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
