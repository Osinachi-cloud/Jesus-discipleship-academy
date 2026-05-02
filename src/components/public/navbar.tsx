"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Series", href: "/series" },
  { name: "Posts", href: "/posts" },
  { name: "Books", href: "/media/books" },
  { name: "Videos", href: "/media/videos" },
  { name: "Gallery", href: "/media/images" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-800 border-b border-navy-700">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold-500">
              <BookOpen className="h-5 w-5 text-navy-800" />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif font-bold text-lg text-cream-100">
                Jesus Discipleship
              </span>
              <span className="block text-xs text-gold-500">Academy</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-navy-700 text-gold-500"
                    : "text-cream-200 hover:text-gold-500 hover:bg-navy-700"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-cream-200 hover:bg-navy-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-navy-700 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-navy-700 text-gold-500"
                      : "text-cream-200 hover:text-gold-500 hover:bg-navy-700"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-cream-200 hover:text-gold-500 hover:bg-navy-700"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
