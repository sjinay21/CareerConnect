import { searchUsers as searchUsersModel } from "../models/User.js";

export async function searchUsersService(search = "", rawPage, rawLimit) {
    const page = Number(rawPage) || 1;
    let limit = Number(rawLimit) || 10;

    if (page < 1 || limit < 1) {
        const error = new Error("Page and limit must be positive integers");
        error.statusCode = 400;
        throw error;
    }
    const offset = (page - 1) * limit;

    const { users, total } = await searchUsersModel(search, limit, offset);
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;

    return {users,pagination: {page,limit,total,totalPages,hasNextPage}};
}
