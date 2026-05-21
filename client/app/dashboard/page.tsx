"use client";

import { useEffect, useState } from "react";
import { apiRequest, removeToken } from "@/lib/api";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";

type Summary = {
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyCost: number;
  yearlyCost: number;
  upcomingRenewalsCount: number;
  mostExpensiveSubscription: {
    name: string;
    price: string;
    currency: string;
    billingCycle: string;
  } | null;
};

type UpcomingRenewal = {
  id: number;
  name: string;
  price: string;
  currency: string;
  billingCycle: string;
  nextBillingDate: string;
  reminderDaysBefore: number;
};

type DashboardResponse = {
  summary: Summary;
  upcomingRenewals: UpcomingRenewal[];
};

type Budget = {
  id: number;
  monthlyLimit: string;
  currency: string;
} | null;

type BudgetResponse = {
  budget: Budget;
};

type ChartItem = {
  name: string;
  value: number;
  color?: string;
};

type ChartsResponse = {
  spendingByCategory: ChartItem[];
  subscriptionsByStatus: ChartItem[];
  subscriptionsByBillingCycle: ChartItem[];
};

type AnimatedCategoryBarProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  index?: number;
  activeIndex: number | null;
};

type AnimatedPieSectorProps = {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
};

function getStatusChartColor(status: string) {
  const normalizedStatus = status.toLowerCase();

  const statusColors: Record<string, string> = {
    active: "#2563eb",
    paused: "#64748b",
    cancelled: "#334155",
    expired: "#94a3b8",
    trial: "#0ea5e9",
  };

  return statusColors[normalizedStatus] || "#64748b";
}

function getCycleChartColor(cycle: string) {
  const normalizedCycle = cycle.toLowerCase();

  const cycleColors: Record<string, string> = {
    weekly: "#64748b",
    monthly: "#2563eb",
    quarterly: "#94a3b8",
    yearly: "#334155",
  };

  return cycleColors[normalizedCycle] || "#64748b";
}

function getMonthlyEquivalent(price: number, billingCycle: string) {
  if (billingCycle === "weekly") {
    return price * 4;
  }

  if (billingCycle === "monthly") {
    return price;
  }

  if (billingCycle === "quarterly") {
    return price / 3;
  }

  if (billingCycle === "yearly") {
    return price / 12;
  }

  return price;
}

function getYearlyImpact(price: number, billingCycle: string) {
  if (billingCycle === "weekly") {
    return price * 52;
  }

  if (billingCycle === "monthly") {
    return price * 12;
  }

  if (billingCycle === "quarterly") {
    return price * 4;
  }

  if (billingCycle === "yearly") {
    return price;
  }

  return price * 12;
}

function getDaysUntilDate(dateValue: string) {
  const today = new Date();
  const targetDate = new Date(dateValue);

  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const differenceInMs = targetDate.getTime() - today.getTime();

  return Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
}

function getRenewalLabel(renewal: UpcomingRenewal) {
  const daysUntilRenewal = getDaysUntilDate(renewal.nextBillingDate);
  const reminderDays = renewal.reminderDaysBefore ?? 3;

  if (daysUntilRenewal <= reminderDays) {
    return "Reminder active";
  }

  if (daysUntilRenewal <= 7) {
    return "Renews soon";
  }

  return "Upcoming";
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [charts, setCharts] = useState<ChartsResponse | null>(null);
  const [budget, setBudget] = useState<Budget>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState<
    number | null
  >(null);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<
    number | null
  >(null);

  const [hoveredStatusIndex, setHoveredStatusIndex] = useState<number | null>(
    null
  );
  const [selectedStatusIndex, setSelectedStatusIndex] = useState<number | null>(
    null
  );

  const [hoveredCycleIndex, setHoveredCycleIndex] = useState<number | null>(
    null
  );
  const [selectedCycleIndex, setSelectedCycleIndex] = useState<number | null>(
    null
  );

  useEffect(function () {
    async function fetchDashboard() {
      try {
        const summaryResponse = await apiRequest("/dashboard/summary");
        const chartsResponse = await apiRequest("/dashboard/charts");
        const budgetResponse: BudgetResponse = await apiRequest("/budgets");

        setData(summaryResponse);
        setCharts(chartsResponse);
        setBudget(budgetResponse.budget || null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load dashboard");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  function handleLogout() {
    removeToken();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-6 text-foreground">
        Loading dashboard...
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background p-6 text-foreground">
        <div className="rounded-xl bg-danger-background p-4 text-danger">
          {error}
        </div>
      </main>
    );
  }

  const activeCategoryIndex =
    selectedCategoryIndex !== null
      ? selectedCategoryIndex
      : hoveredCategoryIndex;

  const activeStatusIndex =
    selectedStatusIndex !== null ? selectedStatusIndex : hoveredStatusIndex;

  const activeCycleIndex =
    selectedCycleIndex !== null ? selectedCycleIndex : hoveredCycleIndex;

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">SubTrackr Dashboard</h1>
            <p className="mt-2 text-muted">
              Overview of your recurring subscriptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />

            <Link
              href="/subscriptions"
              className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Subscriptions
            </Link>

            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-lg border border-border bg-card px-4 py-2 font-semibold text-card-foreground hover:bg-muted-background"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Monthly Cost"
            value={`${data?.summary.monthlyCost ?? 0} €`}
          />

          <DashboardCard
            title="Yearly Cost"
            value={`${data?.summary.yearlyCost ?? 0} €`}
          />

          <DashboardCard
            title="Active Subscriptions"
            value={String(data?.summary.activeSubscriptions ?? 0)}
          />

          <DashboardCard
            title="Upcoming Renewals"
            value={String(data?.summary.upcomingRenewalsCount ?? 0)}
          />
        </section>

        <section className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-3">
          <ChartCard title="Spending by Category">
            <div className="h-[280px] w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={charts?.spendingByCategory || []}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 35,
                  }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="currentColor"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    stroke="currentColor"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <Tooltip content={<ChartTooltip />} cursor={false} />

                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    onMouseEnter={function (_data, index) {
                      setHoveredCategoryIndex(index);
                    }}
                    onMouseLeave={function () {
                      setHoveredCategoryIndex(null);
                    }}
                    onClick={function (_data, index) {
                      setSelectedCategoryIndex(function (currentIndex) {
                        return currentIndex === index ? null : index;
                      });
                    }}
                    shape={function (props: unknown) {
                      return (
                        <AnimatedCategoryBar
                          {...(props as AnimatedCategoryBarProps)}
                          activeIndex={activeCategoryIndex}
                        />
                      );
                    }}
                  >
                    {(charts?.spendingByCategory || []).map(function (
                      entry,
                      index
                    ) {
                      return (
                        <Cell
                          key={`category-bar-${index}`}
                          fill={entry.color || "#64748b"}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Subscriptions by Status">
            <div className="h-[280px] w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts?.subscriptionsByStatus || []}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={75}
                    label
                    stroke="var(--pie-stroke)"
                    strokeWidth={2}
                    activeIndex={activeStatusIndex ?? undefined}
                    activeShape={function (props: unknown) {
                      return (
                        <AnimatedPieSector
                          {...(props as AnimatedPieSectorProps)}
                        />
                      );
                    }}
                    onMouseEnter={function (_data, index) {
                      setHoveredStatusIndex(index);
                    }}
                    onMouseLeave={function () {
                      setHoveredStatusIndex(null);
                    }}
                    onClick={function (_data, index) {
                      setSelectedStatusIndex(function (currentIndex) {
                        return currentIndex === index ? null : index;
                      });
                    }}
                  >
                    {(charts?.subscriptionsByStatus || []).map(function (
                      entry,
                      index
                    ) {
                      return (
                        <Cell
                          key={`status-cell-${index}`}
                          fill={getStatusChartColor(entry.name)}
                        />
                      );
                    })}
                  </Pie>

                  <Tooltip content={<ChartTooltip />} />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={function (value) {
                      return (
                        <span className="text-sm capitalize text-card-foreground">
                          {value}
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Billing Cycles">
            <div className="h-[280px] w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts?.subscriptionsByBillingCycle || []}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={75}
                    label
                    stroke="var(--pie-stroke)"
                    strokeWidth={2}
                    activeIndex={activeCycleIndex ?? undefined}
                    activeShape={function (props: unknown) {
                      return (
                        <AnimatedPieSector
                          {...(props as AnimatedPieSectorProps)}
                        />
                      );
                    }}
                    onMouseEnter={function (_data, index) {
                      setHoveredCycleIndex(index);
                    }}
                    onMouseLeave={function () {
                      setHoveredCycleIndex(null);
                    }}
                    onClick={function (_data, index) {
                      setSelectedCycleIndex(function (currentIndex) {
                        return currentIndex === index ? null : index;
                      });
                    }}
                  >
                    {(charts?.subscriptionsByBillingCycle || []).map(function (
                      entry,
                      index
                    ) {
                      return (
                        <Cell
                          key={`cycle-cell-${index}`}
                          fill={getCycleChartColor(entry.name)}
                        />
                      );
                    })}
                  </Pie>

                  <Tooltip content={<ChartTooltip />} />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={function (value) {
                      return (
                        <span className="text-sm capitalize text-card-foreground">
                          {value}
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        <section className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-3">
          <MostExpensiveSubscriptionCard
            subscription={data?.summary.mostExpensiveSubscription || null}
          />

          <BudgetUsageCard
            budget={budget}
            monthlyCost={data?.summary.monthlyCost || 0}
          />

          <UpcomingRenewalsCard renewals={data?.upcomingRenewals || []} />
        </section>

        <section className="mt-6 lg:mt-8">
          <div className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold sm:text-xl">Settings</h2>
                <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
                  Manage categories, payment methods and app preferences.
                </p>
              </div>

              <Link
                href="/settings"
                className="cursor-pointer rounded-lg bg-primary px-4 py-3 text-center font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                Open Settings
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-6">
      <p className="text-sm font-medium text-muted">{title}</p>
      <p className="mt-3 text-2xl font-bold sm:text-3xl">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-6">
      <h2 className="mb-4 text-base font-bold sm:text-lg">{title}</h2>
      {children}
    </div>
  );
}

function MostExpensiveSubscriptionCard({
  subscription,
}: {
  subscription: Summary["mostExpensiveSubscription"];
}) {
  if (!subscription) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-6">
        <h2 className="text-lg font-bold sm:text-xl">
          Most Expensive Subscription
        </h2>

        <div className="mt-5 rounded-xl border border-border bg-muted-background p-4 text-sm text-muted">
          No subscriptions yet.
        </div>
      </div>
    );
  }

  const price = Number(subscription.price);
  const monthlyEquivalent = getMonthlyEquivalent(
    price,
    subscription.billingCycle
  );
  const yearlyImpact = getYearlyImpact(price, subscription.billingCycle);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-6">
      <h2 className="text-lg font-bold sm:text-xl">
        Most Expensive Subscription
      </h2>

      <div className="mt-4">
        <p className="text-2xl font-bold">{subscription.name}</p>
        <p className="mt-2 text-muted">
          {subscription.price} {subscription.currency} /{" "}
          {subscription.billingCycle}
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="rounded-xl border border-border bg-muted-background p-4">
          <p className="text-sm font-medium text-muted">Monthly equivalent</p>
          <p className="mt-2 text-xl font-bold text-card-foreground">
            {monthlyEquivalent.toFixed(2)} {subscription.currency}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted-background p-4">
          <p className="text-sm font-medium text-muted">Yearly impact</p>
          <p className="mt-2 text-xl font-bold text-card-foreground">
            {yearlyImpact.toFixed(2)} {subscription.currency}
          </p>
        </div>
      </div>
    </div>
  );
}

function BudgetUsageCard({
  budget,
  monthlyCost,
}: {
  budget: Budget;
  monthlyCost: number;
}) {
  const monthlyLimit = budget ? Number(budget.monthlyLimit) : 0;
  const currency = budget?.currency || "EUR";

  const usagePercentage =
    monthlyLimit > 0 ? Math.min((monthlyCost / monthlyLimit) * 100, 100) : 0;

  const remaining = monthlyLimit - monthlyCost;
  const isOverBudget = monthlyLimit > 0 && monthlyCost > monthlyLimit;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold sm:text-xl">Budget Usage</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Track your monthly subscription spending.
          </p>
        </div>

        <Link
          href="/budget"
          className="shrink-0 cursor-pointer rounded-lg border border-border bg-muted-background px-3 py-2 text-sm font-semibold text-card-foreground hover:bg-border"
        >
          Manage
        </Link>
      </div>

      {!budget ? (
        <div className="rounded-xl border border-border bg-muted-background p-4">
          <p className="text-sm text-muted">
            No monthly budget has been set yet.
          </p>

          <Link
            href="/budget"
            className="mt-4 inline-block cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Set Budget
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-2xl font-bold">
            {monthlyCost.toFixed(2)} / {monthlyLimit.toFixed(2)} {currency}
          </p>

          <p className="mt-1 text-sm text-muted">
            {usagePercentage.toFixed(0)}% used
          </p>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted-background">
            <div
              className={`h-full rounded-full ${
                isOverBudget ? "bg-slate-700" : "bg-primary"
              }`}
              style={{
                width: `${usagePercentage}%`,
              }}
            />
          </div>

          <div className="mt-5 rounded-xl border border-border bg-muted-background p-4">
            <p className="text-sm font-medium text-muted">
              {isOverBudget ? "Over budget" : "Remaining"}
            </p>

            <p
              className={`mt-2 text-xl font-bold ${
                isOverBudget ? "text-danger" : "text-card-foreground"
              }`}
            >
              {Math.abs(remaining).toFixed(2)} {currency}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function UpcomingRenewalsCard({ renewals }: { renewals: UpcomingRenewal[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold sm:text-xl">Upcoming Renewals</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Active subscriptions renewing in the next 30 days.
          </p>
        </div>

        <Link
          href="/subscriptions"
          className="shrink-0 cursor-pointer rounded-lg border border-border bg-muted-background px-3 py-2 text-sm font-semibold text-card-foreground hover:bg-border"
        >
          View all
        </Link>
      </div>

      {renewals.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted-background p-4 text-sm text-muted">
          No upcoming renewals in the next 30 days.
        </div>
      ) : (
        <div className="space-y-3">
          {renewals
            .slice()
            .sort(function (a, b) {
              return (
                new Date(a.nextBillingDate).getTime() -
                new Date(b.nextBillingDate).getTime()
              );
            })
            .slice(0, 2)
            .map(function (renewal) {
              const daysUntilRenewal = getDaysUntilDate(
                renewal.nextBillingDate
              );
              const label = getRenewalLabel(renewal);

              return (
                <div
                  key={renewal.id}
                  className="rounded-xl border border-border bg-muted-background p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-card-foreground">
                        {renewal.name}
                      </p>
                      <p className="mt-1 text-sm capitalize text-muted">
                        {renewal.billingCycle} · {renewal.price}{" "}
                        {renewal.currency}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-card-foreground">
                        {new Date(renewal.nextBillingDate).toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {daysUntilRenewal <= 0
                          ? "Renews today"
                          : `In ${daysUntilRenewal} days`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      {label}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Reminder: {renewal.reminderDaysBefore ?? 3} days before
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 text-card-foreground shadow-xl">
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-sm text-muted">Value: {payload[0].value}</p>
    </div>
  );
}

function AnimatedCategoryBar(props: AnimatedCategoryBarProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    fill = "#64748b",
    index,
    activeIndex,
  } = props;

  const isActive = index === activeIndex;

  const extraWidth = isActive ? 8 : 0;
  const extraHeight = isActive ? 12 : 0;

  return (
    <rect
      x={x - extraWidth / 2}
      y={y - extraHeight}
      width={width + extraWidth}
      height={height + extraHeight}
      rx={8}
      ry={8}
      fill={fill}
      opacity={isActive ? 1 : 0.9}
      style={{
        cursor: "pointer",
        filter: isActive
          ? "drop-shadow(0px 10px 14px rgba(0, 0, 0, 0.35))"
          : "none",
        transition: "all 180ms ease",
      }}
    />
  );
}

function AnimatedPieSector(props: AnimatedPieSectorProps) {
  const {
    cx = 0,
    cy = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle = 0,
    endAngle = 0,
    fill = "#64748b",
  } = props;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 10}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      style={{
        cursor: "pointer",
        filter: "drop-shadow(0px 10px 14px rgba(0, 0, 0, 0.35))",
        transition: "all 180ms ease",
      }}
    />
  );
}
