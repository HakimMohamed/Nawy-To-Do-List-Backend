const constants = require('../constants');
const { asyncHandler } = require('../Utils/asyncHandler');
const CategoryService = require('../services/Category')

module.exports = {
    addCategoryToUser: asyncHandler(async (req, res) => {
        const { path, icon, text, category } = req.body;

        if (!category || !path || !icon || !text) {
            return res.status(constants.STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "category, path, icon and text is required",
                data: ""
            });
        }

        const userHasCategory = await CategoryService.findUserCategoryByText(category, req.user.categories || []);

        if (userHasCategory || constants.MAIN_CATEGORIES[category.toLowerCase()]) {
            return res.status(constants.STATUS_CODES.CONFLICT).json({
                success: false,
                message: "Category Already Exists",
                data: ""
            });
        }

        await CategoryService.addCategoryToUser(req.user._id, path, icon, text, category);

        return res.status(constants.STATUS_CODES.OK).json({
            success: true,
            message: "Category Added Successfully",
            data: ''
        });
    }),


    fetchCategories: asyncHandler(async (req, res) => {
        return res.status(constants.STATUS_CODES.OK).json({
            success: true,
            message: "Categories Retrieved Successfully",
            data: req.user.categories || []
        });
    }),
}