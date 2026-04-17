"use client";

import { useSession } from "next-auth/react";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui";

interface AdminHeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {session?.user?.name?.charAt(0) || "A"}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
