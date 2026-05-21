"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import {
  getSubscriptionCompanyDefaults,
  getSubscriptionCompanySuggestions,
  type SubscriptionCompanyDefaults,
} from "@/lib/subscriptionCompanyDefaults";

type Category = {
  id: number;
  name: string;
};

type PaymentMethod = {
  id: number;
  name: string;
  type: string;
};

export default function NewSubscriptionPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [nextBillingDate, setNextBillingDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [status, setStatus] = useState("active");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [autoRenew, setAutoRenew] = useState(true);
  const [reminderDaysBefore, setReminderDaysBefore] = useState("3");

  const [managementUrl, setManagementUrl] = useState("");
  const [cancelInstructions, setCancelInstructions] = useState("");
  const [plannedCancelDate, setPlannedCancelDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const [autoFilledDefaults, setAutoFilledDefaults] =
    useState<SubscriptionCompanyDefaults | null>(null);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);

  const serviceSuggestions = getSubscriptionCompanySuggestions(name);

  useEffect(function () {
    async function fetchData() {
      try {
        const categoriesResponse = await apiRequest("/categories");
        const paymentMethodsResponse = await apiRequest("/payment-methods");

        setCategories(categoriesResponse.categories);
        setPaymentMethods(paymentMethodsResponse.paymentMethods);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load form data");
        }
      } finally {
        setPageLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(
    function () {
      const defaults = getSubscriptionCompanyDefaults(name);

      if (!defaults) {
        return;
      }

      if (autoFilledDefaults?.key === defaults.key) {
        return;
      }

      const canReplaceWebsiteUrl =
        !websiteUrl ||
        websiteUrl === autoFilledDefaults?.websiteUrl ||
        websiteUrl === defaults.websiteUrl;

      const canReplaceManagementUrl =
        !managementUrl ||
        managementUrl === autoFilledDefaults?.managementUrl ||
        managementUrl === defaults.managementUrl;

      const canReplaceCancelInstructions =
        !cancelInstructions ||
        cancelInstructions === autoFilledDefaults?.cancelInstructions ||
        cancelInstructions === defaults.cancelInstructions;

      if (canReplaceWebsiteUrl) {
        setWebsiteUrl(defaults.websiteUrl);
      }

      if (canReplaceManagementUrl) {
        setManagementUrl(defaults.managementUrl);
      }

      if (canReplaceCancelInstructions) {
        setCancelInstructions(defaults.cancelInstructions);
      }

      setAutoFilledDefaults(defaults);
    },
    [name, websiteUrl, managementUrl, cancelInstructions, autoFilledDefaults]
  );

  function handleSelectServiceSuggestion(
    suggestion: SubscriptionCompanyDefaults
  ) {
    setName(suggestion.names[0]);
    setWebsiteUrl(suggestion.websiteUrl);
    setManagementUrl(suggestion.managementUrl);
    setCancelInstructions(suggestion.cancelInstructions);
    setAutoFilledDefaults(suggestion);
    setShowServiceSuggestions(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await apiRequest("/subscriptions", {
        method: "POST",
        body: JSON.stringify({
          categoryId: categoryId ? Number(categoryId) : null,
          paymentMethodId: paymentMethodId ? Number(paymentMethodId) : null,
          name: name,
          description: description,
          price: price,
          currency: currency,
          billingCycle: billingCycle,
          startDate: startDate,
          nextBillingDate: nextBillingDate,
          status: status,
          websiteUrl: websiteUrl,
          notes: notes,
          autoRenew: autoRenew,
          reminderDaysBefore: Number(reminderDaysBefore),
          managementUrl: managementUrl,
          cancelInstructions: cancelInstructions,
          plannedCancelDate: plannedCancelDate || null,
        }),
      });

      window.location.href = "/subscriptions";
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create subscription");
      }
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-background p-8 text-foreground">
        Loading form...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Add Subscription</h1>
            <p className="mt-2 text-muted">Create a new recurring payment.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />

            <Link
              href="/subscriptions"
              className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Subscriptions
            </Link>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl"
        >
          {error && (
            <div className="mb-6 rounded-lg bg-danger-background px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <section>
            <h2 className="text-xl font-bold">Subscription Details</h2>
            <p className="mt-1 text-sm text-muted">
              Basic information about the recurring payment.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="block">
                <span className="mb-1 block text-sm font-medium text-muted">
                  Name
                </span>

                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={function (event) {
                      setName(event.target.value);
                      setShowServiceSuggestions(true);
                    }}
                    onFocus={function () {
                      setShowServiceSuggestions(true);
                    }}
                    onBlur={function () {
                      setTimeout(function () {
                        setShowServiceSuggestions(false);
                      }, 150);
                    }}
                    className="form-input"
                    placeholder="Netflix"
                    required
                  />

                  {showServiceSuggestions && serviceSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                      {serviceSuggestions.map(function (suggestion) {
                        return (
                          <button
                            key={suggestion.key}
                            type="button"
                            onMouseDown={function (event) {
                              event.preventDefault();
                              handleSelectServiceSuggestion(suggestion);
                            }}
                            className="flex w-full cursor-pointer flex-col px-4 py-3 text-left hover:bg-muted-background"
                          >
                            <span className="font-semibold text-card-foreground">
                              {suggestion.names[0]}
                            </span>
                            <span className="mt-1 text-xs text-muted">
                              {suggestion.websiteUrl}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <FormField label="Price">
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={function (event) {
                    setPrice(event.target.value);
                  }}
                  className="form-input"
                  placeholder="10.99"
                  required
                />
              </FormField>

              <FormField label="Currency">
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
              </FormField>

              <FormField label="Billing Cycle">
                <select
                  value={billingCycle}
                  onChange={function (event) {
                    setBillingCycle(event.target.value);
                  }}
                  className="form-input"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </FormField>

              <FormField label="Start Date">
                <input
                  type="date"
                  value={startDate}
                  onChange={function (event) {
                    setStartDate(event.target.value);
                  }}
                  className="form-input"
                  required
                />
              </FormField>

              <FormField label="Next Billing Date">
                <input
                  type="date"
                  value={nextBillingDate}
                  onChange={function (event) {
                    setNextBillingDate(event.target.value);
                  }}
                  className="form-input"
                  required
                />
              </FormField>

              <FormField label="Category">
                <select
                  value={categoryId}
                  onChange={function (event) {
                    setCategoryId(event.target.value);
                  }}
                  className="form-input"
                >
                  <option value="">Uncategorized</option>
                  {categories.map(function (category) {
                    return (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </FormField>

              <FormField label="Payment Method">
                <select
                  value={paymentMethodId}
                  onChange={function (event) {
                    setPaymentMethodId(event.target.value);
                  }}
                  className="form-input"
                >
                  <option value="">None</option>
                  {paymentMethods.map(function (paymentMethod) {
                    return (
                      <option key={paymentMethod.id} value={paymentMethod.id}>
                        {paymentMethod.name} ({paymentMethod.type})
                      </option>
                    );
                  })}
                </select>
              </FormField>

              <FormField label="Status">
                <select
                  value={status}
                  onChange={function (event) {
                    setStatus(event.target.value);
                  }}
                  className="form-input"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                  <option value="trial">Trial</option>
                </select>
              </FormField>

              <FormField label="Reminder Days Before">
                <input
                  type="number"
                  value={reminderDaysBefore}
                  onChange={function (event) {
                    setReminderDaysBefore(event.target.value);
                  }}
                  className="form-input"
                  min="0"
                />
              </FormField>

              <FormField label="Website URL">
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={function (event) {
                    setWebsiteUrl(event.target.value);
                  }}
                  className="form-input"
                  placeholder="https://example.com"
                />
              </FormField>

              <div className="flex items-center gap-3 pt-7">
                <input
                  id="autoRenew"
                  type="checkbox"
                  checked={autoRenew}
                  onChange={function (event) {
                    setAutoRenew(event.target.checked);
                  }}
                  className="h-4 w-4 cursor-pointer accent-blue-600"
                />
                <label htmlFor="autoRenew" className="cursor-pointer text-sm">
                  Auto renew enabled
                </label>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-border bg-muted-background p-5">
            <h2 className="text-xl font-bold">Subscription Assistant</h2>
            <p className="mt-1 text-sm text-muted">
              Optional helper fields for managing, planning or cancelling this
              subscription later.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <FormField label="Management URL">
                <input
                  type="url"
                  value={managementUrl}
                  onChange={function (event) {
                    setManagementUrl(event.target.value);
                  }}
                  className="form-input"
                  placeholder="https://www.example.com/account"
                />
              </FormField>

              <FormField label="Planned Cancel Date">
                <input
                  type="date"
                  value={plannedCancelDate}
                  onChange={function (event) {
                    setPlannedCancelDate(event.target.value);
                  }}
                  className="form-input"
                />
              </FormField>
            </div>

            <div className="mt-5">
              <FormField label="Cancel Instructions">
                <textarea
                  value={cancelInstructions}
                  onChange={function (event) {
                    setCancelInstructions(event.target.value);
                  }}
                  className="form-input min-h-28"
                  placeholder="Example: Go to Account > Billing > Cancel subscription."
                />
              </FormField>
            </div>
          </section>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/subscriptions"
              className="cursor-pointer rounded-lg border border-border px-5 py-3 text-center font-semibold text-card-foreground hover:bg-muted-background"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Subscription"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
