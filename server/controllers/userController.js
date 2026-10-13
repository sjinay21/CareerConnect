import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { updateProfile, getAllUsersList, findById, searchUsers, findByEmail } from "../models/User.js";
import { getProfileViewCountService, recordProfileViewService, getProfileViewersService } from "../services/userService.js";
import bcrypt from "bcryptjs";
 
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
    const { name, about, summary, location, skills, email, password, currentPassword } = req.body;

    const updates = {};

    // 1. Name validation
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      updates.name = name.trim();
    }

    // 2. Email validation and duplicate check
    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ message: "Invalid email address" });
      }

      const existingUser = await findByEmail(normalizedEmail);
      if (existingUser && Number(existingUser.id) !== Number(userId)) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      updates.email = normalizedEmail;
    }

    // 3. Password verification and hashing
    if (password !== undefined) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }

      const userRecord = await findById(userId);
      if (!userRecord || !(await bcrypt.compare(currentPassword, userRecord.password))) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }

      updates.password = await bcrypt.hash(password, 10);
    }

    // 4. Handle file uploads (Cloudinary)
    if (req.files) {
      if (req.files.profilePicture?.[0]) {
        const cloudinaryResponse = await uploadOnCloudinary(req.files.profilePicture[0].path);
        if (cloudinaryResponse) {
          updates.profile_picture_url = cloudinaryResponse.secure_url;
        }
      }

      if (req.files.banner?.[0]) {
        const cloudinaryResponse = await uploadOnCloudinary(req.files.banner[0].path);
        if (cloudinaryResponse) {
          updates.banner_url = cloudinaryResponse.secure_url;
        }
      }
    }

    // 5. Optional profile fields
    if (about !== undefined) updates.about = about || null;
    if (summary !== undefined) updates.summary = summary || null;
    if (location !== undefined) updates.location = location || null;
    if (skills !== undefined) updates.skills = skills || null;

    // 6. Update user in DB
    const updatedUser = await updateProfile(userId, updates);

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.code === "23505") {
      return res.status(400).json({ message: "Email is already in use" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchTheUsers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    if (limit < 1 || offset < 0) {
      return res.status(400).json({ message: "Limit must be positive and offset cannot be negative" });
    }

    const { users, total } = await searchUsers(search, limit, offset);
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

    // Record profile view if authenticated visitor is viewing someone else's profile
    const viewerId = req.user?.id;
    const isOwner = viewerId && Number(viewerId) == profileOwnerId;

    if (viewerId && !isOwner) {
      await recordProfileViewService(viewerId, profileOwnerId);
    }

    // Only fetch profile view count if the authenticated user is viewing their own profile
    const profileViews = isOwner ? await getProfileViewCountService(profileOwnerId) : null;

    const responsePayload = {
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
    };

    if (isOwner) {
      responsePayload.profileViews = profileViews;
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    console.error("Error fetching user by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfileViewers = async (req, res) => {
  try {
    const profileOwnerId = req.user.id;
    const viewers = await getProfileViewersService(profileOwnerId);

    res.status(200).json({
      viewers
    });
  } catch (error) {
    console.error("Error fetching profile viewers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

