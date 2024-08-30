const User = require("../models/User")

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
}

module.exports = new CategoryService()
