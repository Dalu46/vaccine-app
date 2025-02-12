"use client";
import { getAuth, signOut, User } from "firebase/auth";
import { app } from "../../app/firebase/config";
import { useRouter } from "next/navigation";
import { Bell, ChevronsUpDown, LogOut } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@components/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@components/components/ui/sidebar";
import { useToast } from "../hooks/use-toast";
import { useAuthStore } from "app/store/auth-store";

export function NavUser( { user }: { user: User | null | undefined }) {
  const { isMobile } = useSidebar();
  const { toast } = useToast();
  const router = useRouter();
  const userdata = useAuthStore((state) => state.user);
  console.log(userdata)


  const handleSignOut = async () => {
    const auth = getAuth(app);

    signOut(auth)
      .then(() => {
        console.log("Sign-out successful.");
        toast({ title: "Success!", description: "You have been signed out." });
          router.push("/auth/login"); // Or wherever you want to redirect
      })
      .catch((error) => {
        console.log("An error happened.");
        toast({
          title: "Error",
          description: "Sign-out failed: " + error.message,
          variant: "destructive",
        }); // Show an error toast
      });

  };

  const userInitials = (user && user.email) ? `${user.email[0]}${user.email[1]}` : '';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* <AvatarImage src={user?.avatar } alt={user.name} /> */}
                  <AvatarFallback className="rounded-lg">{userInitials.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.displayName}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.displayName}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleSignOut()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
