"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

type PaymentMethod = {
  id: number;
  userId: number;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
};

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [editingPaymentMethodId, setEditingPaymentMethodId] = useState<
    number | null
  >(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("Card");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(function () {
    fetchPaymentMethods();
  }, []);

  async function fetchPaymentMethods() {
    try {
      const response = await apiRequest("/payment-methods");
      setPaymentMethods(response.paymentMethods);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load payment methods");
      }
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingPaymentMethodId(null);
    setName("");
    setType("Card");
    setError("");
  }

  function handleEdit(paymentMethod: PaymentMethod) {
    setEditingPaymentMethodId(paymentMethod.id);
    setName(paymentMethod.name);
    setType(paymentMethod.type);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      if (editingPaymentMethodId) {
        const response = await apiRequest(
          `/payment-methods/${editingPaymentMethodId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              name: name,
              type: type,
            }),
          }
        );

        setPaymentMethods(function (currentPaymentMethods) {
          return currentPaymentMethods
            .map(function (paymentMethod) {
              if (paymentMethod.id === editingPaymentMethodId) {
                return response.paymentMethod;
              }

              return paymentMethod;
            })
            .sort(function (a, b) {
              return a.name.localeCompare(b.name);
            });
        });

        resetForm();
      } else {
        const response = await apiRequest("/payment-methods", {
          method: "POST",
          body: JSON.stringify({
            name: name,
            type: type,
          }),
        });

        setPaymentMethods(function (currentPaymentMethods) {
          return [...currentPaymentMethods, response.paymentMethod].sort(
            function (a, b) {
              return a.name.localeCompare(b.name);
            }
          );
        });

        resetForm();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          editingPaymentMethodId
            ? "Failed to update payment method"
            : "Failed to create payment method"
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(paymentMethodId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment method?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeleteLoadingId(paymentMethodId);

    try {
      await apiRequest(`/payment-methods/${paymentMethodId}`, {
        method: "DELETE",
      });

      setPaymentMethods(function (currentPaymentMethods) {
        return currentPaymentMethods.filter(function (paymentMethod) {
          return paymentMethod.id !== paymentMethodId;
        });
      });

      if (editingPaymentMethodId === paymentMethodId) {
        resetForm();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete payment method");
      }
    } finally {
      setDeleteLoadingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-8 text-foreground">
        Loading payment methods...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payment Methods</h1>
            <p className="mt-2 text-muted">
              Manage cards, wallets and bank accounts used by your subscriptions.
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
              {editingPaymentMethodId
                ? "Edit Payment Method"
                : "Add Payment Method"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {editingPaymentMethodId
                ? "Update the selected payment method."
                : "Create a payment method for your subscriptions."}
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={function (event) {
                    setName(event.target.value);
                  }}
                  className="form-input"
                  placeholder="Revolut"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-muted">
                  Type
                </label>
                <select
                  value={type}
                  onChange={function (event) {
                    setType(event.target.value);
                  }}
                  className="form-input"
                >
                  <option value="Card">Card</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Bank Account">Bank Account</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash">Cash</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="rounded-xl border border-border bg-muted-background p-4">
                <p className="mb-3 text-sm font-semibold text-card-foreground">
                  Preview
                </p>

                <div>
                  <p className="font-semibold text-card-foreground">
                    {name || "Payment method name"}
                  </p>
                  <p className="text-sm text-muted">Type: {type}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full cursor-pointer rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingPaymentMethodId
                    ? "Update Payment Method"
                    : "Save Payment Method"}
                </button>

                {editingPaymentMethodId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full cursor-pointer rounded-lg border border-border bg-card px-4 py-3 font-semibold text-card-foreground hover:bg-muted-background"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-xl font-bold text-card-foreground">
                All Payment Methods
              </h2>
              <p className="mt-1 text-sm text-muted">
                {paymentMethods.length} payment methods available.
              </p>
            </div>

            <div className="divide-y divide-border">
              {paymentMethods.length === 0 ? (
                <div className="px-6 py-8 text-center text-muted">
                  No payment methods found.
                </div>
              ) : (
                paymentMethods.map(function (paymentMethod) {
                  return (
                    <div
                      key={paymentMethod.id}
                      className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-card-foreground">
                          {paymentMethod.name}
                        </p>
                        <p className="text-sm text-muted">
                          Type: {paymentMethod.type}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={function () {
                            handleEdit(paymentMethod);
                          }}
                          className="cursor-pointer rounded-lg border border-border bg-muted-background px-4 py-2 text-sm font-semibold text-card-foreground hover:bg-border"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={function () {
                            handleDelete(paymentMethod.id);
                          }}
                          disabled={deleteLoadingId === paymentMethod.id}
                          className="cursor-pointer rounded-lg bg-danger-background px-4 py-2 text-sm font-semibold text-danger hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deleteLoadingId === paymentMethod.id
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
        </section>
      </div>
    </main>
  );
}