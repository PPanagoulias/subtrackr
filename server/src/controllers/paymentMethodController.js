import prisma from "../config/prisma.js";

export async function getPaymentMethods(req, res) {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      paymentMethods: paymentMethods,
    });
  } catch (error) {
    console.error("Get payment methods error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function createPaymentMethod(req, res) {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Name and type are required",
      });
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: req.user.userId,
        name: name,
        type: type,
      },
    });

    return res.status(201).json({
      message: "Payment method created successfully",
      paymentMethod: paymentMethod,
    });
  } catch (error) {
    console.error("Create payment method error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function updatePaymentMethod(req, res) {
  try {
    const { id } = req.params;
    const { name, type } = req.body;

    const paymentMethodId = Number(id);

    if (!paymentMethodId) {
      return res.status(400).json({
        message: "Invalid payment method id",
      });
    }

    if (!name || !type) {
      return res.status(400).json({
        message: "Name and type are required",
      });
    }

    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId: req.user.userId,
      },
    });

    if (!existingPaymentMethod) {
      return res.status(404).json({
        message: "Payment method not found",
      });
    }

    const updatedPaymentMethod = await prisma.paymentMethod.update({
      where: {
        id: paymentMethodId,
      },
      data: {
        name: name,
        type: type,
      },
    });

    return res.status(200).json({
      message: "Payment method updated successfully",
      paymentMethod: updatedPaymentMethod,
    });
  } catch (error) {
    console.error("Update payment method error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function deletePaymentMethod(req, res) {
  try {
    const { id } = req.params;

    const paymentMethodId = Number(id);

    if (!paymentMethodId) {
      return res.status(400).json({
        message: "Invalid payment method id",
      });
    }

    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId: req.user.userId,
      },
    });

    if (!existingPaymentMethod) {
      return res.status(404).json({
        message: "Payment method not found",
      });
    }

    await prisma.paymentMethod.delete({
      where: {
        id: paymentMethodId,
      },
    });

    return res.status(200).json({
      message: "Payment method deleted successfully",
    });
  } catch (error) {
    console.error("Delete payment method error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}