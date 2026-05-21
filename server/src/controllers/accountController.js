import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

export async function changePassword(req, res) {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const storedPassword =
      user.password || user.passwordHash || user.hashedPassword;

    if (!storedPassword) {
      return res.status(500).json({
        message: "Password field was not found on user model",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      storedPassword
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updateData = {};

    if (user.password !== undefined) {
      updateData.password = hashedNewPassword;
    } else if (user.passwordHash !== undefined) {
      updateData.passwordHash = hashedNewPassword;
    } else if (user.hashedPassword !== undefined) {
      updateData.hashedPassword = hashedNewPassword;
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
