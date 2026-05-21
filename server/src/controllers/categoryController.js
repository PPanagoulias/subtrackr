import prisma from "../config/prisma.js";

export async function getCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      categories: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function createCategory(req, res) {
  try {
    const { name, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const category = await prisma.category.create({
      data: {
        name: name,
        color: color || null,
        icon: icon || null,
      },
    });

    return res.status(201).json({
      message: "Category created successfully",
      category: category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, color, icon } = req.body;

    const categoryId = Number(id);

    if (!categoryId) {
      return res.status(400).json({
        message: "Invalid category id",
      });
    }

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: name,
        color: color || null,
        icon: icon || null,
      },
    });

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const categoryId = Number(id);

    if (!categoryId) {
      return res.status(400).json({
        message: "Invalid category id",
      });
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}