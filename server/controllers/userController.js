import { updateProfile, getAllUsersList, findById, searchUsers as searchUsersModel } from "../models/User.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getProfileViewCountService } from "../services/userService.js";
 
export const getMe = async (req, res) => {
  try {
    const profileViews = await getProfileViewCountService(req.user.id);
    
    res.status(200).json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        about: req.user.about,
        summary: req.user.summary,
        location: req.user.location,
        skills: req.user.skills,
        profile_picture_url: req.user.profile_picture_url,
        banner_url: req.user.banner_url,
        role: req.user.role,
      },
      profileViews
    });
  } catch (error) {
    console.error("Error fetching own profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, about, summary, location, skills } = req.body;
    
    // Fallback to the existing name if it's not provided in the update payload
    const finalName = name || req.user.name;

    // Handle Image Uploads
    let profilePictureUrl = null;
    let bannerUrl = null;

    if (req.files) {
      if (req.files.profilePicture && req.files.profilePicture[0]) {
        const cloudinaryResponse = await uploadOnCloudinary(req.files.profilePicture[0].path);
        if (cloudinaryResponse) {
          profilePictureUrl = cloudinaryResponse.secure_url;
        }
      }
      
      if (req.files.banner && req.files.banner[0]) {
        const cloudinaryResponse = await uploadOnCloudinary(req.files.banner[0].path);
        if (cloudinaryResponse) {
          bannerUrl = cloudinaryResponse.secure_url;
        }
      }
    }

    const updatedUser = await updateProfile(userId, { 
      name: finalName, 
      about, 
      summary, 
      location, 
      skills,
      profile_picture_url: profilePictureUrl,
      banner_url: bannerUrl
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        about: updatedUser.about,
        summary: updatedUser.summary,
        location: updatedUser.location,
        skills: updatedUser.skills,
        profile_picture_url: updatedUser.profile_picture_url,
        banner_url: updatedUser.banner_url,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    if (limit < 1 || offset < 0) {
      return res.status(400).json({ message: "Limit must be positive and offset cannot be negative" });
    }

    const { users, total } = await searchUsersModel(search, limit, offset);
    const hasNextPage = offset + users.length < total;

    res.status(200).json({
      data: users,
      pagination: { limit, offset, totalUsers: total, hasNextPage }
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersList();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const profileOwnerId = parseInt(id, 10);
    
    if (isNaN(profileOwnerId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await findById(profileOwnerId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the updated view count
    const profileViews = await getProfileViewCountService(profileOwnerId);

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        about: user.about,
        summary: user.summary,
        location: user.location,
        skills: user.skills,
        profile_picture_url: user.profile_picture_url,
        banner_url: user.banner_url,
      },
      profileViews
    });
  } catch (error) {
    console.error("Error fetching user by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

