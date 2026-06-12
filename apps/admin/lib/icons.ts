import {
  BarChart3,
  Bell,
  Command,
  FileText,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Mail,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the `icon` string field on `NavItem` to an actual Lucide component.
 * Adding a new icon: import it above, add it to the map.
 */
export const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  ListChecks,
  Wrench,
  Users,
  Settings,
  Sparkles,
  ShieldCheck,
  User,
  FileText,
  Search,
  Command,
  Bell,
  LogOut,
  Mail,
};

export function getIcon(name: string | undefined): LucideIcon | null {
  if (!name) return null;
  return iconMap[name] ?? null;
}
