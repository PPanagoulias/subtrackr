import prisma from "../config/prisma.js";

function getMonthlyMultiplier(billingCycle) {
  if (billingCycle === "weekly") {
    return 4;
  }

  if (billingCycle === "monthly") {
    return 1;
  }

  if (billingCycle === "quarterly") {
    return 1 / 3;
  }

  if (billingCycle === "yearly") {
    return 1 / 12;
  }

  return 1;
}

function getYearlyMultiplier(billingCycle) {
  if (billingCycle === "weekly") {
    return 52;
  }

  if (billingCycle === "monthly") {
    return 12;
  }

  if (billingCycle === "quarterly") {
    return 4;
  }

  if (billingCycle === "yearly") {
    return 1;
  }

  return 12;
}

export async function getDashboardSummary(req, res) {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: req.user.userId,
      },
      include: {
        category: true,
        paymentMethod: true,
      },
      orderBy: {
        nextBillingDate: "asc",
      },
    });

    const activeSubscriptions = subscriptions.filter(function (subscription) {
      return subscription.status === "active";
    });

    const monthlyCost = activeSubscriptions.reduce(function (
      total,
      subscription
    ) {
      const price = Number(subscription.price);
      const multiplier = getMonthlyMultiplier(subscription.billingCycle);

      return total + price * multiplier;
    },
    0);

    const yearlyCost = activeSubscriptions.reduce(function (
      total,
      subscription
    ) {
      const price = Number(subscription.price);
      const multiplier = getYearlyMultiplier(subscription.billingCycle);

      return total + price * multiplier;
    },
    0);

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const upcomingRenewals = activeSubscriptions.filter(function (
      subscription
    ) {
      const nextBillingDate = new Date(subscription.nextBillingDate);

      return nextBillingDate >= today && nextBillingDate <= thirtyDaysFromNow;
    });

    const mostExpensiveSubscription = activeSubscriptions.reduce(function (
      currentMostExpensive,
      subscription
    ) {
      if (!currentMostExpensive) {
        return subscription;
      }

      if (Number(subscription.price) > Number(currentMostExpensive.price)) {
        return subscription;
      }

      return currentMostExpensive;
    },
    null);

    return res.status(200).json({
      summary: {
        totalSubscriptions: subscriptions.length,
        activeSubscriptions: activeSubscriptions.length,
        monthlyCost: Number(monthlyCost.toFixed(2)),
        yearlyCost: Number(yearlyCost.toFixed(2)),
        upcomingRenewalsCount: upcomingRenewals.length,
        mostExpensiveSubscription: mostExpensiveSubscription,
      },
      upcomingRenewals: upcomingRenewals,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getDashboardCharts(req, res) {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: req.user.userId,
      },
      include: {
        category: true,
      },
    });

    const spendingByCategoryMap = {};
    const categoryColorMap = {};
    const subscriptionsByStatusMap = {};
    const subscriptionsByBillingCycleMap = {};

    subscriptions.forEach(function (subscription) {
      const categoryName = subscription.category
        ? subscription.category.name
        : "Uncategorized";

      const categoryColor =
        subscription.category && subscription.category.color
          ? subscription.category.color
          : "#64748b";

      const price = Number(subscription.price);

      if (!spendingByCategoryMap[categoryName]) {
        spendingByCategoryMap[categoryName] = 0;
      }

      spendingByCategoryMap[categoryName] += price;
      categoryColorMap[categoryName] = categoryColor;

      if (!subscriptionsByStatusMap[subscription.status]) {
        subscriptionsByStatusMap[subscription.status] = 0;
      }

      subscriptionsByStatusMap[subscription.status] += 1;

      if (!subscriptionsByBillingCycleMap[subscription.billingCycle]) {
        subscriptionsByBillingCycleMap[subscription.billingCycle] = 0;
      }

      subscriptionsByBillingCycleMap[subscription.billingCycle] += 1;
    });

    const spendingByCategory = Object.keys(spendingByCategoryMap).map(function (
      categoryName
    ) {
      return {
        name: categoryName,
        value: Number(spendingByCategoryMap[categoryName].toFixed(2)),
        color: categoryColorMap[categoryName] || "#64748b",
      };
    });

    const subscriptionsByStatus = Object.keys(subscriptionsByStatusMap).map(
      function (status) {
        return {
          name: status,
          value: subscriptionsByStatusMap[status],
        };
      }
    );

    const subscriptionsByBillingCycle = Object.keys(
      subscriptionsByBillingCycleMap
    ).map(function (billingCycle) {
      return {
        name: billingCycle,
        value: subscriptionsByBillingCycleMap[billingCycle],
      };
    });

    return res.status(200).json({
      spendingByCategory: spendingByCategory,
      subscriptionsByStatus: subscriptionsByStatus,
      subscriptionsByBillingCycle: subscriptionsByBillingCycle,
    });
  } catch (error) {
    console.error("Dashboard charts error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
