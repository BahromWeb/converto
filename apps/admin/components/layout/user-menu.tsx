"use client";

import { useEffect, useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@converto/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@converto/ui/components/dropdown-menu";
import { apiGet, clearSession } from "@/lib/api";

interface Me {
  id: string;
  name: string;
  email: string;
  role: string;
}

function initialsOf(name: string, email: string) {
  const src = name?.trim() || email?.split("@")[0] || "A";
  const parts = src.split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "A";
}

export function UserMenu() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    apiGet<Me>("/me")
      .then(setMe)
      .catch(() => {});
  }, []);

  function logout() {
    clearSession();
    window.location.href = "/login";
  }

  const name = me?.name?.trim() || me?.email?.split("@")[0] || "Admin";
  const email = me?.email ?? "";
  const role = me?.role ?? "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 rounded-full p-1 transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="hidden text-right md:block">
          <div className="text-sm font-medium leading-tight">
            {me ? name : <Loader2 className="size-3.5 animate-spin" />}
          </div>
          <div className="text-[11px] capitalize text-muted-foreground">{role}</div>
        </div>
        <Avatar className="h-9 w-9 ring-2 ring-background">
          <AvatarImage src="" alt={name} />
          <AvatarFallback>{initialsOf(name, email)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate text-sm font-medium">{name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
