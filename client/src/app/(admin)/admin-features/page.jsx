"use client";
import React, { useEffect, useState } from "react";
import { getFeatures, createFeature, deleteFeature } from "@/utils/api";
import { showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Feature Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFeature, setNewFeature] = useState({
    name: "",
    description: "",
    is_active: true,
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    feature: null,
    error: null,
    deleting: false,
  });

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const response = await getFeatures();
      if (response.ok) {
        const data = await response.json();
        setFeatures(data.features || []);
      } else {
        showErrorToast("Failed to fetch features.");
      }
    } catch (error) {
      console.error("Failed to fetch features", error);
      showErrorToast("Network error while fetching features.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const openAddModal = () => {
    setNewFeature({ name: "", description: "", is_active: true });
    setFormError("");
    setIsAddModalOpen(true);
  };

  const handleCreateFeature = async (e) => {
    e.preventDefault();
    setFormError("");

    const trimmedName = newFeature.name.trim();
    if (!trimmedName) {
      setFormError("Feature name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      setFormError("Feature name must not exceed 100 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await createFeature({
        name: trimmedName,
        description: newFeature.description.trim() || null,
        is_active: Boolean(newFeature.is_active),
      });

      const data = await response.json();
      if (response.ok) {
        showSuccessToast("Feature created successfully!");
        setIsAddModalOpen(false);
        setNewFeature({ name: "", description: "", is_active: true });
        fetchFeatures();
      } else {
        setFormError(data.message || "Failed to create feature.");
      }
    } catch (error) {
      console.error("Error creating feature:", error);
      setFormError("Network error while creating feature.");
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (feature) => {
    setDeleteModal({
      isOpen: true,
      feature,
      error: null,
      deleting: false,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.feature) return;

    setDeleteModal((prev) => ({ ...prev, deleting: true, error: null }));
    try {
      const response = await deleteFeature(deleteModal.feature.id);
      const data = await response.json();

      if (response.ok) {
        showSuccessToast("Feature deleted successfully!");
        setDeleteModal({ isOpen: false, feature: null, error: null, deleting: false });
        fetchFeatures();
      } else {
        const errorMessage = data.message || "Failed to delete feature.";
        setDeleteModal((prev) => ({
          ...prev,
          deleting: false,
          error: errorMessage,
        }));
        showErrorToast(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting feature:", error);
      const errorMessage = "Network error during deletion.";
      setDeleteModal((prev) => ({
        ...prev,
        deleting: false,
        error: errorMessage,
      }));
      showErrorToast(errorMessage);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-10">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <TuneIcon className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-extrabold text-gray-900">Feature Management</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage features that can be assigned to subscription plans.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <AddIcon className="w-5 h-5" /> Add Feature
          </button>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fc] border-b border-gray-200 text-xs font-bold text-gray-600">
                <th className="p-4">Sr No.</th>
                <th className="p-4">Name</th>
                <th className="p-4 min-w-[280px]">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created At</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500 font-medium">
                    Loading features...
                  </td>
                </tr>
              ) : features.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500 font-medium">
                    No features found. Click &quot;Add Feature&quot; to create one.
                  </td>
                </tr>
              ) : (
                features.map((feature) => (
                  <tr
                    key={feature.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 text-gray-500 font-sm text-sm">{feature.id}</td>
                    <td className="p-4 font-bold text-gray-900">{feature.name}</td>
                    <td className="p-4 text-gray-600 text-sm">
                      {feature.description ? (
                        feature.description
                      ) : (
                        <span className="text-gray-400 italic">No description</span>
                      )}
                    </td>
                    <td className="p-4">
                      {feature.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {feature.created_at
                        ? new Date(feature.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openDeleteModal(feature)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold text-sm transition cursor-pointer"
                        title="Delete Feature"
                      >
                        <DeleteIcon fontSize="small" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Feature Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-gray-900">Add New Feature</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleCreateFeature} className="p-6">
              {formError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Feature Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newFeature.name}
                  onChange={(e) =>
                    setNewFeature((prev) => ({ ...prev, name: e.target.value }))
                  }
                  maxLength={100}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 outline-none text-gray-900"
                  placeholder="e.g. Profile Views Graph"
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1">Maximum 100 characters.</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newFeature.description}
                  onChange={(e) =>
                    setNewFeature((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 outline-none text-gray-900"
                  placeholder="Describe what this feature grants to subscribed users..."
                ></textarea>
              </div>

              <div className="mb-6 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="feature_is_active"
                  checked={newFeature.is_active}
                  onChange={(e) =>
                    setNewFeature((prev) => ({ ...prev, is_active: e.target.checked }))
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="feature_is_active"
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  Active (available for selection in subscription plans)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-2 text-white font-bold rounded-lg transition-colors cursor-pointer ${
                    submitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {submitting ? "Creating..." : "Create Feature"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.feature && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-full shrink-0 border border-red-100">
                <WarningAmberIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Feature</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-gray-900">
                    &quot;{deleteModal.feature.name}&quot;
                  </span>{" "}
                  (ID #{deleteModal.feature.id})? This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteModal.error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                <p className="font-semibold mb-1">Cannot Delete Feature</p>
                <p>{deleteModal.error}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() =>
                  setDeleteModal({ isOpen: false, feature: null, error: null, deleting: false })
                }
                className="px-4 py-2 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                disabled={deleteModal.deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteModal.deleting}
                className={`px-5 py-2 text-white font-bold rounded-lg transition-colors cursor-pointer ${
                  deleteModal.deleting
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deleteModal.deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
