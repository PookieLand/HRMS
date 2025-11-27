"use client";

import * as React from "react";
import { useAsgardeo } from "@asgardeo/react";
import {
  BookOpen,
  Bot,
  Building2,
  LifeBuoy,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAsgardeo();

  // Handle Asgardeo user object where name can be an object with familyName and givenName
  const getUserDisplayName = () => {
    if (user?.username) return user.username;
    if (user?.name) {
      if (typeof user.name === "string") return user.name;
      if (typeof user.name === "object" && user.name !== null) {
        const nameObj = user.name as {
          givenName?: string;
          familyName?: string;
        };
        return (
          `${nameObj.givenName || ""} ${nameObj.familyName || ""}`.trim() ||
          "User"
        );
      }
    }
    return "User";
  };

  const userData = {
    name: getUserDisplayName(),
    email: user?.email || "user@example.com",
    avatar: user?.profilePicture || user?.picture || "",
  };

  const data = {
    navMain: [
      {
        title: "Employees",
        url: "/employees",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Employee List",
            url: "/employees",
          },
        ],
      },
      {
        title: "Attendance",
        url: "/attendance/dashboard",
        icon: Bot,
        items: [
          {
            title: "Dashboard",
            url: "/attendance/dashboard",
          },
        ],
      },
      {
        title: "Leave Management",
        url: "/leaves/apply",
        icon: BookOpen,
        items: [
          {
            title: "Apply for Leave",
            url: "/leaves/apply",
          },
        ],
      },
      {
        title: "Users",
        url: "/users",
        icon: Settings2,
        items: [
          {
            title: "User List",
            url: "/users",
          },
        ],
      },
      {
        title: "Audit & Compliance",
        url: "/audit/logs",
        icon: PieChart,
        items: [
          {
            title: "Audit Logs",
            url: "/audit/logs",
          },
        ],
      },
      {
        title: "Notifications",
        url: "/notifications",
        icon: Send,
        items: [
          {
            title: "All Notifications",
            url: "/notifications",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      // {
      //   title: "Feedback",
      //   url: "#",
      //   icon: Send,
      // },
    ],
    projects: [
      // Commented out - not needed for HRMS
      // {
      //   name: "Design Engineering",
      //   url: "#",
      //   icon: Frame,
      // },
      // {
      //   name: "Sales & Marketing",
      //   url: "#",
      //   icon: PieChart,
      // },
      // {
      //   name: "Travel",
      //   url: "#",
      //   icon: Map,
      // },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">HRMS</span>
                  <span className="truncate text-xs">
                    Human Resource Management
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
