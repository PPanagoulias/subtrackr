"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { apiRequest, saveToken } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      saveToken(data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
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
            <h1 className="text-3xl font-bold">SubTrackr</h1>
            <p className="mt-2 text-sm text-muted">
              Login to manage your subscriptions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={function (event) {
                    setPassword(event.target.value);
                  }}
                  className="form-input pr-12"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={function () {
                    setShowPassword(function (currentValue) {
                      return !currentValue;
                    });
                  }}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md hover:bg-muted-background"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <img
                    src={
                      showPassword
                        ? "/icons/hide-password.png"
                        : "/icons/show-password.png"
                    }
                    alt={showPassword ? "Hide password" : "Show password"}
                    className="h-5 w-5 object-contain opacity-80 dark:invert dark:opacity-90"
                  />
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-danger-background px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            No account?{" "}
            <Link
              href="/register"
              className="cursor-pointer font-semibold text-primary hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
