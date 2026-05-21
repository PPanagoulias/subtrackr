"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }),
      });

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(function () {
        window.location.href = "/login";
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Register failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Create account</h1>
            <p className="mt-2 text-sm text-muted">
              Start tracking your recurring payments.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted">
                  First name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={function (event) {
                    setFirstName(event.target.value);
                  }}
                  className="form-input"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-muted">
                  Last name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={function (event) {
                    setLastName(event.target.value);
                  }}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={function (event) {
                  setEmail(event.target.value);
                }}
                className="form-input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={function (event) {
                  setPassword(event.target.value);
                }}
                className="form-input"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-danger-background px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700 dark:bg-green-900/40 dark:text-green-300">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="cursor-pointer font-semibold text-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
