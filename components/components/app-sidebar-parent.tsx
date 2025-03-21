// Import necessary components
'use client'
import * as React from "react";
import {
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
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
import { app } from "../../app/firebase/config";
import { useState, useEffect } from "react";

// This is the nav sidebar data.
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
      title: "Overview",
      url: "/parent-dashboard/overview",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "WHO Analytics",
      url: "/parent-dashboard/analytics",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/parent-dashboard/settings/general",
        },
        {
          title: "Notification",
          url: "/parent-dashboard/settings/notification",
        },
      ],
    },
  ],
};

export function AppSidebarParent({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        {/* Pass the user data to the NavUser component */}
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}