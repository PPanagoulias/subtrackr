"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiRequest, removeToken } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

type Category = {
  id: number;
  name: string;
  color: string | null;
  icon: string | null;
};

type PaymentMethod = {
  id: number;
  name: string;
  type: string;
};

type Subscription = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  billingCycle: string;
  nextBillingDate: string;
  status: string;
  autoRenew: boolean;
  reminderDaysBefore: number;
  managementUrl: string | null;
  cancelInstructions: string | null;
  plannedCancelDate: string | null;
  category: Category | null;
  paymentMethod: PaymentMethod | null;
};

type CancelGuide = {
  name: string;
  instructions: string;
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cycleFilter, setCycleFilter] = useState("all");

  const [cancelGuide, setCancelGuide] = useState<CancelGuide | null>(null);

  useEffect(function () {
    async function fetchSubscriptions() {
      try {
        const response = await apiRequest("/subscriptions");
        setSubscriptions(response.subscriptions);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load subscriptions");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = useMemo(
    function () {
      const normalizedSearch = searchTerm.trim().toLowerCase();

      return subscriptions.filter(function (subscription) {
        const categoryName = subscription.category?.name || "";
        const paymentMethodName = subscription.paymentMethod?.name || "";
        const cancelInstructions = subscription.cancelInstructions || "";
        const managementUrl = subscription.managementUrl || "";

        const matchesSearch =
          normalizedSearch === "" ||
          subscription.name.toLowerCase().includes(normalizedSearch) ||
          categoryName.toLowerCase().includes(normalizedSearch) ||
          paymentMethodName.toLowerCase().includes(normalizedSearch) ||
          subscription.status.toLowerCase().includes(normalizedSearch) ||
          subscription.billingCycle.toLowerCase().includes(normalizedSearch) ||
          cancelInstructions.toLowerCase().includes(normalizedSearch) ||
          managementUrl.toLowerCase().includes(normalizedSearch);

        const matchesStatus =
          statusFilter === "all" || subscription.status === statusFilter;

        const matchesCycle =
          cycleFilter === "all" || subscription.billingCycle === cycleFilter;

        return matchesSearch && matchesStatus && matchesCycle;
      });
    },
    [subscriptions, searchTerm, statusFilter, cycleFilter]
  );

  function handleLogout() {
    removeToken();
    window.location.href = "/login";
  }

  function resetFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setCycleFilter("all");
  }

  function openCancelGuide(subscription: Subscription) {
    if (!subscription.cancelInstructions) {
      return;
    }

    setCancelGuide({
      name: subscription.name,
      instructions: subscription.cancelInstructions,
    });
  }

  function closeCancelGuide() {
    setCancelGuide(null);
  }

  async function handleDelete(subscriptionId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subscription?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeleteLoadingId(subscriptionId);

    try {
      await apiRequest(`/subscriptions/${subscriptionId}`, {
        method: "DELETE",
      });

      setSubscriptions(function (currentSubscriptions) {
        return currentSubscriptions.filter(function (subscription) {
          return subscription.id !== subscriptionId;
        });
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete subscription");
      }
    } finally {
      setDeleteLoadingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-8 text-foreground">
        Loading subscriptions...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subscriptions</h1>
            <p className="mt-2 text-muted">
              Manage and monitor your recurring payments.
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

            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-lg border border-border bg-card px-4 py-2 font-semibold text-card-foreground hover:bg-muted-background"
            >
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-xl bg-danger-background p-4 text-danger">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex flex-col gap-4 border-b border-border px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-card-foreground">
                All Subscriptions
              </h2>
              <p className="mt-1 text-sm text-muted">
                View, edit, manage or plan cancellations for your subscriptions.
              </p>
            </div>

            <Link
              href="/subscriptions/new"
              className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2 text-center font-semibold text-primary-foreground hover:bg-primary-hover sm:w-auto"
            >
              Add Subscription
            </Link>
          </div>

          <div className="border-b border-border bg-card px-6 py-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto] lg:items-end">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted">
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={function (event) {
                    setSearchTerm(event.target.value);
                  }}
                  className="form-input"
                  placeholder="Search by name, category, payment..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-muted">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={function (event) {
                    setStatusFilter(event.target.value);
                  }}
                  className="form-input"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                  <option value="trial">Trial</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-muted">
                  Billing cycle
                </label>
                <select
                  value={cycleFilter}
                  onChange={function (event) {
                    setCycleFilter(event.target.value);
                  }}
                  className="form-input"
                >
                  <option value="all">All cycles</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="cursor-pointer rounded-lg border border-border bg-muted-background px-4 py-3 font-semibold text-card-foreground hover:bg-border"
              >
                Reset
              </button>
            </div>

            <p className="mt-3 text-sm text-muted">
              Showing {filteredSubscriptions.length} of {subscriptions.length}{" "}
              subscriptions.
            </p>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead className="bg-muted-background text-sm text-muted">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Cycle</th>
                  <th className="px-6 py-4 font-semibold">Next Billing</th>
                  <th className="px-6 py-4 font-semibold">Payment</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Assistant</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border text-sm text-card-foreground">
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-8 text-center text-muted"
                    >
                      No subscriptions found.
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map(function (subscription) {
                    return (
                      <tr
                        key={subscription.id}
                        className="hover:bg-muted-background"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-card-foreground">
                              {subscription.name}
                            </p>

                            {subscription.description && (
                              <p className="text-xs text-muted">
                                {subscription.description}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <CategoryBadge category={subscription.category} />
                        </td>

                        <td className="px-6 py-4 font-semibold">
                          {subscription.price} {subscription.currency}
                        </td>

                        <td className="px-6 py-4 capitalize">
                          {subscription.billingCycle}
                        </td>

                        <td className="px-6 py-4">
                          <div>
                            <p>
                              {new Date(
                                subscription.nextBillingDate
                              ).toLocaleDateString()}
                            </p>

                            {/* <p className="mt-1 text-xs text-muted">
                              Reminder: {subscription.reminderDaysBefore ?? 3}{" "}
                              days before
                            </p> */}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {subscription.paymentMethod?.name || "-"}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={subscription.status} />
                        </td>

                        <td className="px-6 py-4">
                          <AssistantActions
                            subscription={subscription}
                            onOpenCancelGuide={openCancelGuide}
                          />
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/subscriptions/${subscription.id}/edit`}
                              className="cursor-pointer rounded-lg border border-border bg-muted-background px-3 py-2 text-xs font-semibold text-card-foreground hover:bg-border"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={function () {
                                handleDelete(subscription.id);
                              }}
                              disabled={deleteLoadingId === subscription.id}
                              className="cursor-pointer rounded-lg bg-danger-background px-3 py-2 text-xs font-semibold text-danger hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deleteLoadingId === subscription.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="block divide-y divide-border md:hidden">
            {filteredSubscriptions.length === 0 ? (
              <div className="px-6 py-8 text-center text-muted">
                No subscriptions found.
              </div>
            ) : (
              filteredSubscriptions.map(function (subscription) {
                return (
                  <div key={subscription.id} className="p-5">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-card-foreground">
                          {subscription.name}
                        </h3>

                        {subscription.description && (
                          <p className="mt-1 text-sm text-muted">
                            {subscription.description}
                          </p>
                        )}
                      </div>

                      <StatusBadge status={subscription.status} />
                    </div>

                    <div className="grid gap-3 text-sm">
                      <MobileInfoRow
                        label="Category"
                        value={
                          <CategoryBadge category={subscription.category} />
                        }
                      />

                      <MobileInfoRow
                        label="Price"
                        value={`${subscription.price} ${subscription.currency}`}
                      />

                      <MobileInfoRow
                        label="Cycle"
                        value={subscription.billingCycle}
                      />

                      <MobileInfoRow
                        label="Next billing"
                        value={new Date(
                          subscription.nextBillingDate
                        ).toLocaleDateString()}
                      />

                      <MobileInfoRow
                        label="Reminder"
                        value={`${
                          subscription.reminderDaysBefore ?? 3
                        } days before`}
                      />

                      <MobileInfoRow
                        label="Payment"
                        value={subscription.paymentMethod?.name || "-"}
                      />
                    </div>

                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      <AssistantActions
                        subscription={subscription}
                        onOpenCancelGuide={openCancelGuide}
                        mobile
                      />

                      <Link
                        href={`/subscriptions/${subscription.id}/edit`}
                        className="cursor-pointer rounded-lg border border-border bg-muted-background px-3 py-2 text-center text-sm font-semibold text-card-foreground hover:bg-border"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={function () {
                          handleDelete(subscription.id);
                        }}
                        disabled={deleteLoadingId === subscription.id}
                        className="cursor-pointer rounded-lg bg-danger-background px-3 py-2 text-sm font-semibold text-danger hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deleteLoadingId === subscription.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {cancelGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Cancel Guide</h2>
                <p className="mt-1 text-sm text-muted">{cancelGuide.name}</p>
              </div>

              <button
                type="button"
                onClick={closeCancelGuide}
                className="cursor-pointer rounded-lg border border-border bg-muted-background px-3 py-2 text-sm font-semibold text-card-foreground hover:bg-border"
              >
                Close
              </button>
            </div>

            <div className="whitespace-pre-wrap rounded-xl border border-border bg-muted-background p-4 text-sm leading-6 text-card-foreground">
              {cancelGuide.instructions}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function AssistantActions({
  subscription,
  onOpenCancelGuide,
  mobile = false,
}: {
  subscription: Subscription;
  onOpenCancelGuide: (subscription: Subscription) => void;
  mobile?: boolean;
}) {
  const hasManagementUrl = Boolean(subscription.managementUrl);
  const hasCancelInstructions = Boolean(subscription.cancelInstructions);

  if (!hasManagementUrl && !hasCancelInstructions) {
    return <span className="text-xs text-muted">-</span>;
  }

  return (
    <div
      className={mobile ? "grid gap-2 sm:grid-cols-2" : "flex flex-wrap gap-2"}
    >
      {subscription.managementUrl && (
        <a
          href={subscription.managementUrl}
          target="_blank"
          rel="noreferrer"
          className={
            mobile
              ? "cursor-pointer rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
              : "cursor-pointer rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
          }
        >
          Manage
        </a>
      )}

      {subscription.cancelInstructions && (
        <button
          type="button"
          onClick={function () {
            onOpenCancelGuide(subscription);
          }}
          className={
            mobile
              ? "cursor-pointer rounded-lg border border-border bg-muted-background px-3 py-2 text-center text-sm font-semibold text-card-foreground hover:bg-border"
              : "cursor-pointer rounded-lg border border-border bg-muted-background px-3 py-2 text-xs font-semibold text-card-foreground hover:bg-border"
          }
        >
          Cancel Guide
        </button>
      )}
    </div>
  );
}

function CategoryBadge({ category }: { category: Category | null }) {
  const color = category?.color || "#64748b";
  const name = category?.name || "Uncategorized";

  return (
    <div className="flex items-center gap-2">
      <span
        className="h-3 w-3 shrink-0 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />
      <span className="font-medium text-card-foreground">{name}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  const statusClasses: Record<string, string> = {
    active:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    paused:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    expired:
      "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    trial: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  };

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        statusClasses[normalizedStatus] ||
        "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      {status}
    </span>
  );
}

function MobileInfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium capitalize text-card-foreground">
        {value}
      </span>
    </div>
  );
}
