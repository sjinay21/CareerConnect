import {
  getAllFeatures,
  getFeatureById,
  getFeatureByName,
  createFeature,
  updateFeature,
  countPlanFeaturesByFeatureId,
  deleteFeature,
} from "../models/Feature.js";

export async function getAllFeaturesHandler(req, res) {
  try {
    const features = await getAllFeatures();
    return res.status(200).json({ features });
  } catch (error) {
    console.error("Error fetching all features:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFeatureByIdHandler(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid feature ID" });
    }

    const feature = await getFeatureById(id);
    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }

    return res.status(200).json({ feature });
  } catch (error) {
    console.error("Error fetching feature by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createFeatureHandler(req, res) {
  try {
    const { name, description, is_active } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Feature name is required" });
    }

    const trimmedName = name.trim();
    if (trimmedName.length > 100) {
      return res.status(400).json({ message: "Feature name must not exceed 100 characters" });
    }

    const existingFeature = await getFeatureByName(trimmedName);
    if (existingFeature) {
      return res.status(400).json({ message: "A feature with this name already exists" });
    }

    const newFeature = await createFeature({
      name: trimmedName,
      description: description !== undefined && description !== null ? String(description).trim() : null,
      is_active: is_active !== undefined ? Boolean(is_active) : undefined,
    });

    return res.status(201).json({
      message: "Feature created successfully",
      feature: newFeature,
    });
  } catch (error) {
    console.error("Error creating feature:", error);
    if (error.code === "23505") {
      return res.status(400).json({ message: "A feature with this name already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
export async function updateFeatureHandler(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid feature ID" });
    }

    const existingFeature = await getFeatureById(id);
    if (!existingFeature) {
      return res.status(404).json({ message: "Feature not found" });
    }

    const { name, description, is_active } = req.body;
    if (name === undefined && description === undefined && is_active === undefined) {
      return res.status(400).json({
        message: "At least one field (name, description, is_active) must be provided to update",
      });
    }

    const updateData = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Feature name cannot be empty" });
      }
      const trimmedName = name.trim();
      if (trimmedName.length > 100) {
        return res.status(400).json({ message: "Feature name must not exceed 100 characters" });
      }

      const duplicate = await getFeatureByName(trimmedName);
      if (duplicate && Number(duplicate.id) !== id) {
        return res.status(400).json({ message: "A feature with this name already exists" });
      }
      updateData.name = trimmedName;
    }

    if (description !== undefined) {
      updateData.description = description !== null ? String(description).trim() : null;
    }

    if (is_active !== undefined) {
      updateData.is_active = Boolean(is_active);
    }

    const updatedFeature = await updateFeature(id, updateData);

    return res.status(200).json({
      message: "Feature updated successfully",
      feature: updatedFeature,
    });
  } catch (error) {
    console.error("Error updating feature:", error);
    if (error.code === "23505") {
      return res.status(400).json({ message: "A feature with this name already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
export async function deleteFeatureHandler(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid feature ID" });
    }

    const existingFeature = await getFeatureById(id);
    if (!existingFeature) {
      return res.status(404).json({ message: "Feature not found" });
    }

    // Safety guard: prevent cascade deletion if feature is assigned to subscription plans
    const assignedCount = await countPlanFeaturesByFeatureId(id);
    if (assignedCount > 0) {
      return res.status(400).json({
        message: `Cannot delete feature: it is currently assigned to ${assignedCount} subscription plan(s). Remove the assignments before deleting this feature.`,
        code: "FEATURE_ASSIGNED_TO_PLANS",
        assignedPlansCount: assignedCount,
      });
    }

    const deletedFeature = await deleteFeature(id);

    return res.status(200).json({
      message: "Feature deleted successfully",
      feature: deletedFeature,
    });
  } catch (error) {
    console.error("Error deleting feature:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
