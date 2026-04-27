"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card, CardContent, Alert } from "@/components/ui";
import { KeyRound, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 1, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to verify email");
      } else {
        setStep(2);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 2, email, answer1, answer2 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to verify security answers");
      } else {
        setStep(3);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 3, email, answer1, answer2, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => router.push("/admin/login"), 2000);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-800 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500 mb-4">
              <KeyRound className="h-8 w-8 text-navy-800" />
            </div>
            <h1 className="text-2xl font-bold text-navy-800">Reset Password</h1>
            <p className="text-charcoal-600 mt-1">
              {step === 1 && "Enter your email to get started"}
              {step === 2 && "Answer your security questions"}
              {step === 3 && "Create a new password"}
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

          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Continue
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
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
                Verify Answers
              </Button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-charcoal-600 hover:text-gold-600"
              >
                Back to email
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleStep3} className="space-y-4">
              <Input
                id="newPassword"
                type="password"
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Reset Password
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center text-sm text-charcoal-600 hover:text-gold-600"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
