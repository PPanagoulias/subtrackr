"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { apiRequest, removeToken } from "@/lib/api";

type TokenPayload = {
  userId?: number;
  email?: string;
  iat?: number;
  exp?: number;
};

function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const decodedPayload = JSON.parse(atob(payload));

    return decodedPayload;
  } catch {
    return null;
  }
}

function formatTokenDate(timestamp?: number) {
  if (!timestamp) {
    return "-";
  }

  return new Date(timestamp * 1000).toLocaleString();
}

export default function AccountPage() {
  const [account, setAccount] = useState<TokenPayload | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(function () {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const decodedToken = decodeToken(token);

    if (!decodedToken) {
      removeToken();
      window.location.href = "/login";
      return;
    }

    setAccount(decodedToken);
  }, []);

  function handleLogout() {
    removeToken();
    window.location.href = "/login";
  }

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setSaving(true);

    try {
      await apiRequest("/account/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setPasswordSuccess("Password changed successfully.");
    } catch (err) {
      if (err instanceof Error) {
        setPasswordError(err.message);
      } else {
        setPasswordError("Failed to change password.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (!account) {
    return (
      <main className="min-h-screen bg-background p-8 text-foreground">
        Loading account...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Account</h1>
            <p className="mt-2 text-muted">
              View your account, session and security settings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />

            <Link
              href="/settings"
              className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Back
            </Link>
          </div>
        </header>

        <section className="grid gap-6">
          <form
            onSubmit={handleChangePassword}
            className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl"
          >
            <h2 className="text-xl font-bold">Change Password</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Update your password by entering your current password and a new
              one.
            </p>

            {passwordError && (
              <div className="mt-5 rounded-xl bg-danger-background p-4 text-danger">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mt-5 rounded-xl bg-blue-100 p-4 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {passwordSuccess}
              </div>
            )}

            <div className="mt-6 grid gap-5">
              <PasswordField
                label="Current password"
                value={currentPassword}
                showPassword={showCurrentPassword}
                placeholder="Enter current password"
                onChange={setCurrentPassword}
                onToggle={function () {
                  setShowCurrentPassword(function (currentValue) {
                    return !currentValue;
                  });
                }}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <PasswordField
                  label="New password"
                  value={newPassword}
                  showPassword={showNewPassword}
                  placeholder="Enter new password"
                  onChange={setNewPassword}
                  onToggle={function () {
                    setShowNewPassword(function (currentValue) {
                      return !currentValue;
                    });
                  }}
                />

                <PasswordField
                  label="Confirm new password"
                  value={confirmPassword}
                  showPassword={showConfirmPassword}
                  placeholder="Confirm new password"
                  onChange={setConfirmPassword}
                  onToggle={function () {
                    setShowConfirmPassword(function (currentValue) {
                      return !currentValue;
                    });
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full cursor-pointer rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving ? "Saving..." : "Change Password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  value,
  showPassword,
  placeholder,
  onChange,
  onToggle,
}: {
  label: string;
  value: string;
  showPassword: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-muted">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={function (event) {
            onChange(event.target.value);
          }}
          className="form-input pr-12"
          placeholder={placeholder}
          required
        />

        <button
          type="button"
          onClick={onToggle}
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
  );
}

function AccountInfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted-background p-4">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 break-words font-semibold text-card-foreground">
        {value}
      </p>
    </div>
  );
}
