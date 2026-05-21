import prisma from "../config/prisma.js";

export async function getBudget(req, res) {
  try {
    const budget = await prisma.budget.findFirst({
      where: {
        userId: req.user.userId,
      },
    });

    return res.status(200).json({
      budget: budget,
    });
  } catch (error) {
    console.error("Get budget error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function createBudget(req, res) {
  try {
    const userId = req.user.userId;
    const { monthlyLimit, currency } = req.body;

    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId: userId,
      },
    });

    if (existingBudget) {
      return res.status(400).json({
        message: "Budget already exists",
      });
    }

    const budget = await prisma.budget.create({
      data: {
        userId: userId,
        monthlyLimit: monthlyLimit,
        currency: currency || "EUR",
      },
    });

    return res.status(201).json({
      message: "Budget created successfully",
      budget: budget,
    });
  } catch (error) {
    console.error("Create budget error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function updateBudget(req, res) {
  try {
    const userId = req.user.userId;
    const budgetId = Number(req.params.id);
    const { monthlyLimit, currency } = req.body;

    const existingBudget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId: userId,
      },
    });

    if (!existingBudget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    const budget = await prisma.budget.update({
      where: {
        id: budgetId,
      },
      data: {
        monthlyLimit: monthlyLimit,
        currency: currency || "EUR",
      },
    });

    return res.status(200).json({
      message: "Budget updated successfully",
      budget: budget,
    });
  } catch (error) {
    console.error("Update budget error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
