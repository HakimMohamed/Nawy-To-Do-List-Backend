const User = require("../models/User")
const Task = require("../models/Task");
const { default: mongoose } = require("mongoose");

class CategoryService {
    async addCategoryToUser(userId, path, icon, text, category) {
        const match = { _id: userId };
        const update = {
            $push: {
                categories: { path, icon, text, category },
            }
        }

        return User.updateOne(match, update)
    }

    async findUserCategoryByText(text, categories) {
        return categories.map(cat => cat.text).includes(text)
    }

    async deleteCategoryById(categoryId, userId) {
        const match = { _id: userId };
        const update = {
            $pull: {
                categories: { _id: categoryId }
            }
        }

        const promises = [
            User.updateOne(match, update),
            Task.deleteMany({ _category: new mongoose.Types.ObjectId(categoryId) })
        ]

        return Promise.all(promises)
    }

}

module.exports = new CategoryService()
