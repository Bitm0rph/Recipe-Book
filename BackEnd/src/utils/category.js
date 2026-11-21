import Category from "../models/category.model.js";

export const ensureCategoriesExist = async (names) => {
    const uniqueNames = [...new Set(
        names
            .filter((name) => typeof name === "string")
            .map((name) => name.trim())
            .filter(Boolean)
    )];

    if (uniqueNames.length === 0) return;

    await Category.bulkWrite(
        uniqueNames.map((name) => ({
            updateOne: {
                filter: { name },
                update: { $setOnInsert: { name } },
                upsert: true
            }
        }))
    );
};
