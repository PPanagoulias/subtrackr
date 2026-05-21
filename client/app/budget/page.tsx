"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

type Budget = {
  id: number;
  userId: number;
  monthlyLimit: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

type DashboardResponse = {
  summary: {
    monthlyCost: number;
    yearlyCost: number;
    activeSubscriptions: number;
    totalSubscriptions: number;
    upcomingRenewalsCount: number;
  };
};

export default function BudgetPage() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [monthlyCost, setMonthlyCost] = useState(0);

  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [currency, setCurrency] = useState("EUR");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(function () {
    async function fetchData() {
      try {
        const dashboardResponse: DashboardResponse = await apiRequest(
          "/dashboard/summary"
        );

        setMonthlyCost(dashboardResponse.summary.monthlyCost || 0);

        const budgetResponse = await apiRequest("/budgets");

        if (budgetResponse.budget) {
          setBudget(budgetResponse.budget);
          setMonthlyLimit(String(budgetResponse.budget.monthlyLimit));
          setCurrency(budgetResponse.budget.currency || "EUR");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load budget");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      if (budget) {
        const response = await apiRequest(`/budgets/${budget.id}`, {
          method: "PUT",
          body: JSON.stringify({
            monthlyLimit: monthlyLimit,
            currency: currency,
          }),
        });

        setBudget(response.budget);
      } else {
        const response = await apiRequest("/budgets", {
          method: "POST",
          body: JSON.stringify({
            monthlyLimit: monthlyLimit,
            currency: currency,
          }),
        });

        setBudget(response.budget);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save budget");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-8 text-foreground">
        Loading budget...
      </main>
    );
  }

  const limitNumber = Number(monthlyLimit || 0);
  const remaining = limitNumber - monthlyCost;
  const usagePercentage =
    limitNumber > 0 ? Math.min((monthlyCost / limitNumber) * 100, 100) : 0;

  const isOverBudget = limitNumber > 0 && monthlyCost > limitNumber;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Budget</h1>
            <p className="mt-2 text-muted">
              Set a monthly spending limit for your subscriptions.
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

        {error && (
          <div className="mb-6 rounded-xl bg-danger-background p-4 text-danger">
            {error}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl"
          >
            <h2 className="text-xl font-bold">
              {budget ? "Edit Budget" : "Create Budget"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Define your maximum monthly subscription cost.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted">
                  Monthly limit
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={monthlyLimit}
                  onChange={function (event) {
                    setMonthlyLimit(event.target.value);
                  }}
                  className="form-input"
                  placeholder="50.00"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-muted">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={function (event) {
                    setCurrency(event.target.value);
                  }}
                  className="form-input"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full cursor-pointer rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : budget
                  ? "Update Budget"
                  : "Save Budget"}
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
            <h2 className="text-xl font-bold">Monthly Budget Overview</h2>
            <p className="mt-1 text-sm text-muted">
              Compare your current monthly subscription cost with your budget.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <BudgetStat
                label="Monthly cost"
                value={`${monthlyCost.toFixed(2)} ${currency}`}
              />
              <BudgetStat
                label="Budget limit"
                value={
                  limitNumber > 0
                    ? `${limitNumber.toFixed(2)} ${currency}`
                    : "-"
                }
              />
              <BudgetStat
                label={isOverBudget ? "Over budget" : "Remaining"}
                value={`${Math.abs(remaining).toFixed(2)} ${currency}`}
                danger={isOverBudget}
              />
            </div>

            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted">Budget usage</span>
                <span className="font-semibold text-card-foreground">
                  {limitNumber > 0 ? `${usagePercentage.toFixed(0)}%` : "-"}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-muted-background">
                <div
                  className={`h-full rounded-full ${
                    isOverBudget ? "bg-slate-700" : "bg-primary"
                  }`}
                  style={{
                    width: `${usagePercentage}%`,
                  }}
                />
              </div>

              {limitNumber === 0 && (
                <p className="mt-3 text-sm text-muted">
                  Add a monthly budget to start tracking usage.
                </p>
              )}

              {isOverBudget && (
                <p className="mt-3 text-sm font-semibold text-danger">
                  You are over your monthly budget.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function BudgetStat({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted-background p-4">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p
        className={`mt-2 text-xl font-bold ${
          danger ? "text-danger" : "text-card-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
