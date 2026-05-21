import prisma from "../config/prisma.js";

export async function getSubscriptions(req, res) {
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

    return res.status(200).json({
      subscriptions: subscriptions,
    });
  } catch (error) {
    console.error("Get subscriptions error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getSubscriptionById(req, res) {
  try {
    const { id } = req.params;

    const subscriptionId = Number(id);

    if (!subscriptionId) {
      return res.status(400).json({
        message: "Invalid subscription id",
      });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: req.user.userId,
      },
      include: {
        category: true,
        paymentMethod: true,
      },
    });

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    return res.status(200).json({
      subscription: subscription,
    });
  } catch (error) {
    console.error("Get subscription by id error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function createSubscription(req, res) {
  try {
    const {
      categoryId,
      paymentMethodId,
      name,
      description,
      price,
      currency,
      billingCycle,
      startDate,
      nextBillingDate,
      status,
      websiteUrl,
      notes,
      autoRenew,
      reminderDaysBefore,
      managementUrl,
      cancelInstructions,
      plannedCancelDate,
    } = req.body;

    if (!name || !price || !billingCycle || !startDate || !nextBillingDate) {
      return res.status(400).json({
        message:
          "Name, price, billing cycle, start date and next billing date are required",
      });
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user.userId,
        categoryId: categoryId ? Number(categoryId) : null,
        paymentMethodId: paymentMethodId ? Number(paymentMethodId) : null,
        name: name,
        description: description || null,
        price: price,
        currency: currency || "EUR",
        billingCycle: billingCycle,
        startDate: new Date(startDate),
        nextBillingDate: new Date(nextBillingDate),
        status: status || "active",
        websiteUrl: websiteUrl || null,
        notes: notes || null,
        autoRenew: typeof autoRenew === "boolean" ? autoRenew : true,
        reminderDaysBefore: reminderDaysBefore ? Number(reminderDaysBefore) : 3,
        managementUrl: managementUrl || null,
        cancelInstructions: cancelInstructions || null,
        plannedCancelDate: plannedCancelDate
          ? new Date(plannedCancelDate)
          : null,
      },
      include: {
        category: true,
        paymentMethod: true,
      },
    });

    return res.status(201).json({
      message: "Subscription created successfully",
      subscription: subscription,
    });
  } catch (error) {
    console.error("Create subscription error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function updateSubscription(req, res) {
  try {
    const { id } = req.params;

    const subscriptionId = Number(id);

    if (!subscriptionId) {
      return res.status(400).json({
        message: "Invalid subscription id",
      });
    }

    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: req.user.userId,
      },
    });

    if (!existingSubscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    const {
      categoryId,
      paymentMethodId,
      name,
      description,
      price,
      currency,
      billingCycle,
      startDate,
      nextBillingDate,
      status,
      websiteUrl,
      notes,
      autoRenew,
      reminderDaysBefore,
      managementUrl,
      cancelInstructions,
      plannedCancelDate,
    } = req.body;

    if (!name || !price || !billingCycle || !startDate || !nextBillingDate) {
      return res.status(400).json({
        message:
          "Name, price, billing cycle, start date and next billing date are required",
      });
    }

    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscriptionId,
      },
      data: {
        categoryId: categoryId ? Number(categoryId) : null,
        paymentMethodId: paymentMethodId ? Number(paymentMethodId) : null,
        name: name,
        description: description || null,
        price: price,
        currency: currency || "EUR",
        billingCycle: billingCycle,
        startDate: new Date(startDate),
        nextBillingDate: new Date(nextBillingDate),
        status: status || "active",
        websiteUrl: websiteUrl || null,
        notes: notes || null,
        autoRenew: typeof autoRenew === "boolean" ? autoRenew : true,
        reminderDaysBefore: reminderDaysBefore ? Number(reminderDaysBefore) : 3,
        managementUrl: managementUrl || null,
        cancelInstructions: cancelInstructions || null,
        plannedCancelDate: plannedCancelDate
          ? new Date(plannedCancelDate)
          : null,
      },
      include: {
        category: true,
        paymentMethod: true,
      },
    });

    return res.status(200).json({
      message: "Subscription updated successfully",
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error("Update subscription error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function deleteSubscription(req, res) {
  try {
    const { id } = req.params;

    const subscriptionId = Number(id);

    if (!subscriptionId) {
      return res.status(400).json({
        message: "Invalid subscription id",
      });
    }

    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: req.user.userId,
      },
    });

    if (!existingSubscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    await prisma.subscription.delete({
      where: {
        id: subscriptionId,
      },
    });

    return res.status(200).json({
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    console.error("Delete subscription error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
