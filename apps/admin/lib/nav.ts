import type { NavSection } from "@converto/types";

/**
 * Sidebar navigation. `icon` is a Lucide icon name resolved at render time —
 * keeps this file plain TS so it can be imported anywhere without pulling in
 * React.
 */
export const adminNav: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
      { label: "Analytics", href: "/analytics", icon: "BarChart3" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Jobs", href: "/jobs", icon: "ListChecks", badge: "live" },
      { label: "Tools", href: "/tools", icon: "Wrench" },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Users", href: "/users", icon: "Users" },
      { label: "Contacts", href: "/contacts", icon: "Mail" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/settings", icon: "Settings" },
    ],
  },
];

export const adminUser = {
  name: "Bahrom Hasanov",
  email: "bahromhasanov0202@gmail.com",
  role: "owner" as const,
  initials: "BH",
};
