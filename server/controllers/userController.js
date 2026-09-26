import { updateProfile } from "../models/User.js";
import { searchUsersService } from "../services/userService.js";

export const getMe = (req, res) => {
  // req.user is populated by authMiddleware
  res.status(200).json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      about: req.user.about,
      summary: req.user.summary,
      location: req.user.location,
      skills: req.user.skills,
    },
  });
};

export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, about, summary, location, skills } = req.body;
    
    // Fallback to the existing name if it's not provided in the update payload
    const finalName = name || req.user.name;

    const updatedUser = await updateProfile(userId, { name: finalName, about, summary, location, skills });

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
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const result = await searchUsersService(
      req.query.search,
      req.query.page,
      req.query.limit
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching users:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message || "Internal server error" });
  }
};
