"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AdminSidebar } from "@/components/admin";
import { ScriptureTooltip } from "@/components/public";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [securityChecked, setSecurityChecked] = useState(false);

  const isLoginPage = pathname === "/admin/login";
  const isForgotPasswordPage = pathname === "/admin/forgot-password";
  const isSecuritySetupPage = pathname === "/admin/setup-security";

  useEffect(() => {
    if (status === "authenticated" && !isLoginPage && !isForgotPasswordPage && !isSecuritySetupPage) {
      checkSecurityQuestions();
    } else {
      setSecurityChecked(true);
    }
  }, [status, pathname]);

  const checkSecurityQuestions = async () => {
    try {
      const res = await fetch("/api/auth/setup-security");
      const data = await res.json();
      if (!data.hasSecurityQuestions) {
        router.push("/admin/setup-security");
      }
    } catch (err) {
      console.error("Error checking security status:", err);
    } finally {
      setSecurityChecked(true);
    }
  };

  if (isLoginPage || isForgotPasswordPage || isSecuritySetupPage) {
    return <>{children}</>;
  }

  if (!securityChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:pl-64">
        <div className="min-h-screen">{children}</div>
      </main>
      <ScriptureTooltip />
    </div>
  );
}
