"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

type Category = {
  id: number;
  name: string;
  color: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
};

const categoryColorOptions = [
  { name: "Blue", value: "#2563eb" },
  { name: "Sky Blue", value: "#0ea5e9" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Steel Blue", value: "#1e40af" },
  { name: "Slate", value: "#475569" },
  { name: "Dark Slate", value: "#334155" },
  { name: "Gray", value: "#64748b" },
  { name: "Light Gray", value: "#94a3b8" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );

  const [name, setName] = useState("");
  const [color, setColor] = useState("#2563eb");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(function () {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await apiRequest("/categories");
      setCategories(response.categories);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load categories");
      }
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingCategoryId(null);
    setName("");
    setColor("#2563eb");
    setError("");
  }

  function handleEdit(category: Category) {
    setEditingCategoryId(category.id);
    setName(category.name);
    setColor(category.color || "#2563eb");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      if (editingCategoryId) {
        const response = await apiRequest(`/categories/${editingCategoryId}`, {
          method: "PUT",
          body: JSON.stringify({
            name: name,
            color: color,
            icon: null,
          }),
        });

        setCategories(function (currentCategories) {
          return currentCategories
            .map(function (category) {
              if (category.id === editingCategoryId) {
                return response.category;
              }

              return category;
            })
            .sort(function (a, b) {
              return a.name.localeCompare(b.name);
            });
        });

        resetForm();
      } else {
        const response = await apiRequest("/categories", {
          method: "POST",
          body: JSON.stringify({
            name: name,
            color: color,
            icon: null,
          }),
        });

        setCategories(function (currentCategories) {
          return [...currentCategories, response.category].sort(function (
            a,
            b
          ) {
            return a.name.localeCompare(b.name);
          });
        });

        resetForm();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          editingCategoryId
            ? "Failed to update category"
            : "Failed to create category"
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(categoryId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeleteLoadingId(categoryId);

    try {
      await apiRequest(`/categories/${categoryId}`, {
        method: "DELETE",
      });

      setCategories(function (currentCategories) {
        return currentCategories.filter(function (category) {
          return category.id !== categoryId;
        });
      });

      if (editingCategoryId === categoryId) {
        resetForm();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete category");
      }
    } finally {
      setDeleteLoadingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-8 text-foreground">
        Loading categories...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="mt-2 text-muted">
              Organize your subscriptions by category.
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
              {editingCategoryId ? "Edit Category" : "Add Category"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {editingCategoryId
                ? "Update the selected category."
                : "Create a category for your subscriptions."}
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
                  placeholder="Entertainment"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-muted">
                  Color
                </label>

                <div className="grid grid-cols-4 gap-3">
                  {categoryColorOptions.map(function (colorOption) {
                    const isSelected = color === colorOption.value;

                    return (
                      <button
                        key={colorOption.value}
                        type="button"
                        onClick={function () {
                          setColor(colorOption.value);
                        }}
                        title={colorOption.name}
                        className={`h-11 cursor-pointer rounded-lg border transition ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/40"
                            : "border-border hover:border-primary"
                        }`}
                        style={{
                          backgroundColor: colorOption.value,
                        }}
                      />
                    );
                  })}
                </div>

                <p className="mt-2 text-xs text-muted">Selected: {color}</p>
              </div>

              <div className="rounded-xl border border-border bg-muted-background p-4">
                <p className="mb-3 text-sm font-semibold text-card-foreground">
                  Preview
                </p>

                <div className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{
                      backgroundColor: color || "#2563eb",
                    }}
                  />

                  <div>
                    <p className="font-semibold text-card-foreground">
                      {name || "Category name"}
                    </p>
                    <p className="text-sm text-muted">
                      Category color: {color || "#2563eb"}
                    </p>
                  </div>
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
                    : editingCategoryId
                    ? "Update Category"
                    : "Save Category"}
                </button>

                {editingCategoryId && (
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
                All Categories
              </h2>
              <p className="mt-1 text-sm text-muted">
                {categories.length} categories available.
              </p>
            </div>

            <div className="divide-y divide-border">
              {categories.length === 0 ? (
                <div className="px-6 py-8 text-center text-muted">
                  No categories found.
                </div>
              ) : (
                categories.map(function (category) {
                  return (
                    <div
                      key={category.id}
                      className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-4 w-4 rounded-full"
                          style={{
                            backgroundColor: category.color || "#2563eb",
                          }}
                        />

                        <div>
                          <p className="font-semibold text-card-foreground">
                            {category.name}
                          </p>
                          <p className="text-sm text-muted">
                            Category color: {category.color || "#2563eb"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={function () {
                            handleEdit(category);
                          }}
                          className="cursor-pointer rounded-lg border border-border bg-muted-background px-4 py-2 text-sm font-semibold text-card-foreground hover:bg-border"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={function () {
                            handleDelete(category.id);
                          }}
                          disabled={deleteLoadingId === category.id}
                          className="cursor-pointer rounded-lg bg-danger-background px-4 py-2 text-sm font-semibold text-danger hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deleteLoadingId === category.id
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
