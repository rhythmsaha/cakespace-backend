const asyncHandler = require("express-async-handler");
const { Category, SubCategory } = require("../../models/categories.model");
const AppError = require("../../utils/AppError");

exports.addSubCategory = asyncHandler(async (req, res) => {
    const { role, type } = req?.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN") throw new AppError("Access Denied!", 403, "authorization");

    const { name, enabled, categoryId } = req.body;

    const subCategory = new SubCategory({ name: name, enabled: enabled, categoryId: categoryId });
    const saveSubCategory = await subCategory.save();

    if (!saveSubCategory) throw new AppError("Couldn't save new Sub category!", 500);

    const updateCategory = await Category.updateOne(
        { _id: categoryId },
        { $push: { subCategories: saveSubCategory._id } }
    );

    if (!updateCategory) throw new AppError("Something went wrong!", 500);

    return res.json({
        message: "Subcategory Created!",
        subCategory: saveSubCategory,
    });
});

exports.updateSubCategory = asyncHandler(async (req, res) => {
    const { role, type } = req?.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN") throw new AppError("Access Denied!", 403, "authorization");

    const { id } = req.params;
    const { name, enabled } = req.body;

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) throw new AppError("SubCategory not found!", 404);

    if (name) subCategory.name = name;
    subCategory.enabled = enabled || false;

    const updateSubCategory = await subCategory.save();

    if (!SubCategory) throw new AppError("Couldn't update subcategory!", 500);

    res.json({
        message: "Saved Subcategory!",
        subCategory: updateSubCategory,
    });
});

exports.deleteSubCategory = asyncHandler(async (req, res) => {
    const { role, type } = req?.user;
    if (type !== "AUTH_TOKEN" && role !== "ADMIN") throw new AppError("Access Denied!", 403, "authorization");

    const { id } = req.params;

    if (!id) throw new AppError("id is required!", 400);

    const deleteItem = await SubCategory.findByIdAndDelete(id);
    if (!deleteItem) throw new AppError("Failed to delete!", 500);
    await Category.findOneAndUpdate({ _id: deleteItem.categoryId }, { $pull: { subCategories: id } });

    // console.log(id);

    res.json({ message: "Successfully deleted!", subCategory: deleteItem });
});
