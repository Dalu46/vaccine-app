"use client";

import * as React from "react";
import {
  Bot,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  Activity,
  Dice2
} from "lucide-react";

import { NavMain } from "@components/components/nav-main";
import { NavUser } from "@components/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@components/components/ui/sidebar";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

// This is sample data.
const data = {
  user: {
    name: "vaxtrack",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "VaxTrack",
      logo: GalleryVerticalEnd,
      plan: "Vaccination",
    },
  ],
  navMain: [
    {
      title: "All Children List",
      url: "/dashboard/children",
      icon: Dice2,
      isActive: true,
    },
    {
      title: "Vaccinated Children",
      url: "/dashboard/overview",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Scheduled",
      url: "/dashboard/scheduled",
      icon: Bot,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: Activity,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        // {
        //   title: "Billing",
        //   url: "#",
        // },
        // {
        //   title: "Limits",
        //   url: "#",
        // },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [user, setUser] = useState<User | null>(null); // Initialize user state

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser); // Update user state when auth changes
    });

    console.log(user)
    return unsubscribe; // Cleanup listener
  }, []);
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <a href="/">
          <div className="flex gap-2">
            <div className="flex size-6 items-center justify-center rounded-sm border bg-black text-white">
              <GalleryVerticalEnd className="size-4 shrink-0" />
            </div>
            <p className="font-semibold">VaxTrack</p>
          </div>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
