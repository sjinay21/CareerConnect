import { getExperiencesByUserId, addExperience, updateExperience, deleteExperience } from "../models/Experience.js";

export const getExperiences = async (req, res) => {
    try {
        const userId = req.query.userId || req.user.id;
        const experiences = await getExperiencesByUserId(userId);
        res.json({ experiences });
    } catch (error) {
        console.error("Error fetching experiences:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createExperience = async (req, res) => {
    try {
        const { job_title, company_name, location, start_date, end_date, is_current, description } = req.body;
        const userId = req.user.id;

        if (!job_title || !company_name || !start_date) {
            return res.status(400).json({ message: "Job title, company name, and start date are required" });
        }

        const newExperience = await addExperience(userId, job_title, company_name, location, start_date, end_date, is_current, description);
        res.status(201).json({ experience: newExperience });
    } catch (error) {
        console.error("Error adding experience:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const editExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const { job_title, company_name, location, start_date, end_date, is_current, description } = req.body;

        const updatedExperience = await updateExperience(id, job_title, company_name, location, start_date, end_date, is_current, description);
        if (!updatedExperience) {
            return res.status(404).json({ message: "Experience not found" });
        }
        res.json({ experience: updatedExperience });
    } catch (error) {
        console.error("Error updating experience:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const removeExperience = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteExperience(id);
        res.json({ message: "Experience deleted successfully" });
    } catch (error) {
        console.error("Error deleting experience:", error);
        res.status(500).json({ message: "Server error" });
    }
};
