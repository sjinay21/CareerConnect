import { searchUsers as searchUsersModel } from "../models/User.js";
import { getViewCount } from "../models/ProfileView.js";
import { PAGINATION_LIMITS } from "../config/paginationConfig.js";

export async function searchUsersService(search = "", rawLimit, rawOffset) {
    const limit = Number(rawLimit) || PAGINATION_LIMITS.USERS;
    const offset = Number(rawOffset) || 0;

    if (limit < 1 || offset < 0) {
        const error = new Error("Limit must be positive and offset cannot be negative");
        error.statusCode = 400;
        throw error;
    }

    const { users, total } = await searchUsersModel(search, limit, offset);
    const hasNextPage = offset + users.length < total;

    return {data: users,pagination: {limit,offset,totalUsers: total,hasNextPage}};
}

export async function getProfileViewCountService(profileOwnerId) {
    try {
        return await getViewCount(profileOwnerId);
    } catch (error) {
        console.error("Error fetching profile view count:", error);
        return 0; // fallback to 0 if there's a db error
    }
}
