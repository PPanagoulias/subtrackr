"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="mt-2 text-muted">
              Manage supporting data and preferences for your account.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />

            <Link
              href="/dashboard"
              className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          <SettingsCard
            title="Categories"
            description="Create and manage categories used to organize your subscriptions."
            href="/categories"
            buttonText="Manage Categories"
          />

          <SettingsCard
            title="Payment Methods"
            description="Manage cards, PayPal, bank accounts and other payment labels."
            href="/payment-methods"
            buttonText="Manage Payment Methods"
          />

          <SettingsCard
            title="Account"
            description="View your account details and current login session."
            href="/account"
            buttonText="Manage Account"
          />

          <SettingsCard
            title="Budget"
            description="Set a monthly spending limit and track how much of it is used by your subscriptions."
            href="/budget"
            buttonText="Manage Budget"
          />
        </section>
      </div>
    </main>
  );
}

function SettingsCard({
  title,
  description,
  href,
  buttonText,
  disabled = false,
}: {
  title: string;
  description: string;
  href: string;
  buttonText: string;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>

      {disabled ? (
        <button
          type="button"
          disabled
          className="mt-6 w-full cursor-not-allowed rounded-lg border border-border bg-muted-background px-4 py-3 font-semibold text-muted opacity-70"
        >
          {buttonText}
        </button>
      ) : (
        <Link
          href={href}
          className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}
