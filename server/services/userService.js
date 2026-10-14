import { searchUsers as searchUsersModel } from "../models/User.js";
import { getViewCount, recordProfileView as recordProfileViewModel, getProfileViewers as getProfileViewersModel } from "../models/ProfileView.js";
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
        const counts = await getViewCount(profileOwnerId);
        return counts.last30Days;
    } catch (error) {
        console.error("Error fetching profile view count:", error);
        return 0; // fallback to 0 if there's a db error
    }
}

export async function recordProfileViewService(viewerId, profileOwnerId) {
    if (!viewerId || !profileOwnerId || Number(viewerId) == Number(profileOwnerId)) {
        return null;
    }

    try {
        return await recordProfileViewModel(viewerId, profileOwnerId);
    } catch (error) {
        console.error("Error recording profile view:", error);
        return null;
    }
}

export async function getProfileViewersService(profileOwnerId, period = 30) {
    if (!profileOwnerId) {
        throw new Error("Profile owner ID is required");
    }

    try {
        const counts = await getViewCount(profileOwnerId);
        const viewers = await getProfileViewersModel(profileOwnerId, period);
        return { counts, viewers };
    } catch (error) {
        console.error("Error fetching profile viewers:", error);
        throw error;
    }
}
