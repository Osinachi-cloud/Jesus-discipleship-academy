"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Input, Card, CardContent, Alert } from "@/components/ui";
import { Shield } from "lucide-react";

export default function SetupSecurityPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      checkSecurityStatus();
    }
  }, [status, router]);

  const checkSecurityStatus = async () => {
    try {
      const res = await fetch("/api/auth/setup-security");
      const data = await res.json();
      if (data.hasSecurityQuestions) {
        router.push("/admin");
      }
    } catch (err) {
      console.error("Error checking security status:", err);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/setup-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer1, answer2 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to set up security questions");
      } else {
        setSuccess("Security questions set up successfully!");
        setTimeout(() => router.push("/admin"), 1500);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-800">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-800 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500 mb-4">
              <Shield className="h-8 w-8 text-navy-800" />
            </div>
            <h1 className="text-2xl font-bold text-navy-800">Security Setup</h1>
            <p className="text-charcoal-600 mt-1">
              Set up your security questions for password recovery
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-6">
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                What is the name of your primary school?
              </label>
              <Input
                id="answer1"
                type="text"
                placeholder="Enter your answer"
                value={answer1}
                onChange={(e) => setAnswer1(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">What is your favorite color?</label>
              <Input
                id="answer2"
                type="text"
                placeholder="Enter your answer"
                value={answer2}
                onChange={(e) => setAnswer2(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Save Security Answers
            </Button>
          </form>

          <p className="text-center text-sm text-charcoal-500 mt-6">
            These answers will be used to verify your identity if you forget
            your password.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
