"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-cream-300">404</h1>
        <h2 className="text-2xl font-serif font-bold text-navy-800 mt-4 mb-2">
          Page Not Found
        </h2>
        <p className="text-charcoal-600 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button>
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
