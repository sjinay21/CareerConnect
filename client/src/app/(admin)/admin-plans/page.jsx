"use client";
import React, { useEffect, useState } from "react";
import { getActivePlans, createPlan, updatePlan, deletePlan, getFeatures } from "@/utils/api";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { Formik, Form, Field } from "formik";
import { planSchema } from "@/schemas/planSchema";
import { showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState([]);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "INR",
    billing_period: "monthly",
    tier: "premium",
    featureIds: [],
  });
  const [formProcessing, setFormProcessing] = useState(false);

  // Delete Confirmation Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await getActivePlans();
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || data || []);
      }
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableFeatures = async () => {
    try {
      const response = await getFeatures();
      if (response.ok) {
        const data = await response.json();
        setAvailableFeatures(data.features || []);
      }
    } catch (error) {
      console.error("Failed to fetch features", error);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchAvailableFeatures();
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      name: "",
      description: "",
      price: "",
      currency: "INR",
      billing_period: "monthly",
      tier: "premium",
      featureIds: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (plan) => {
    setModalMode("edit");
    setCurrentPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || "",
      price: plan.price,
      currency: plan.currency,
      billing_period: plan.billing_period,
      tier: plan.tier || "premium",
      featureIds: Array.isArray(plan.features) ? plan.features.map(f => Number(f.id)) : [],
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values, { setSubmitting, setStatus }) => {
    setFormProcessing(true);
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description ? values.description.trim() : null,
        price: Number(values.price),
        currency: values.currency,
        billing_period: values.billing_period,
        featureIds: Array.isArray(values.featureIds) ? values.featureIds.map(Number) : [],
      };

      let response;
      if (modalMode === "add") {
        response = await createPlan(payload);
      } else {
        response = await updatePlan(currentPlan.id, payload);
      }

      if (response.ok) {
        setIsModalOpen(false);
        showSuccessToast(modalMode === "add" ? "Plan created successfully" : "Plan updated successfully");
        await fetchPlans();
      } else {
        const errData = await response.json();
        setStatus(errData.message || "Operation failed.");
      }
    } catch (err) {
      setStatus("Network error occurred.");
    } finally {
      setFormProcessing(false);
      setSubmitting(false);
    }
  };

  // Delete plan functions
  const openDeleteModal = (plan) => {
    setPlanToDelete(plan);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (!deleting) {
      setDeleteModalOpen(false);
      setPlanToDelete(null);
      setDeleteError(null);
    }
  };

  const confirmDeletePlan = async () => {
    if (!planToDelete || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const response = await deletePlan(planToDelete.id);
      const data = await response.json();
      if (response.ok) {
        showSuccessToast(data.message || "Plan deleted successfully");
        setDeleteModalOpen(false);
        setPlanToDelete(null);
        await fetchPlans();
      } else {
        const errorMsg = data.message || "Failed to delete plan.";
        setDeleteError(errorMsg);
        showErrorToast(errorMsg);
      }
    } catch (err) {
      const networkMsg = "Network error during deletion.";
      setDeleteError(networkMsg);
      showErrorToast(networkMsg);
    } finally {
      setDeleting(false);
    }
  };

  const activeFeatures = availableFeatures.filter((f) => f.is_active);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-10">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Subscription Plans</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage subscription plans with feature assignments.</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <AddIcon className="w-5 h-5" /> Add Plan
          </button>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fc] border-b border-gray-200 text-xs font-bold text-gray-600 ">
                <th className="p-4">Sr No.</th>
                <th className="p-4">Name</th>
                <th className="p-4 min-w-[200px]">Description</th>
                <th className="p-4 min-w-[220px]">Features</th>
                <th className="p-4">Price</th>
                <th className="p-4">Currency</th>
                <th className="p-4">Billing Period</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right min-w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="p-10 text-center text-gray-500 font-medium">Loading plans...</td></tr>
              ) : plans.length === 0 ? (
                <tr><td colSpan="9" className="p-10 text-center text-gray-500 font-medium">No active plans found.</td></tr>
              ) : (
                plans.map(plan => (
                  <tr key={plan.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-gray-500 font-mono text-sm">{plan.id}</td>
                    <td className="p-4 font-bold text-gray-900">{plan.name}</td>
                    <td className="p-4 text-gray-600 text-sm truncate max-w-xs">{plan.description}</td>
                    <td className="p-4 text-gray-600 text-sm max-w-xs">
                      {Array.isArray(plan.features) && plan.features.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {plan.features.map(f => (
                            <span
                              key={f.id}
                              className="inline-block text-gray-800 text-xs px-2 py-0.5 font-medium"
                              title={f.description || f.name}
                            >
                              {f.name}
                            </span>
                          ))}
                        </div>
                      ) : typeof plan.features === "string" && plan.features ? (
                        <span className="text-gray-800 text-xs font-medium">{plan.features}</span>
                      ) : (
                        <span className="text-gray-800 italic text-xs">No features</span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-gray-900">{plan.price}</td>
                    <td className="p-4 text-gray-500 font-medium">{plan.currency}</td>
                    <td className="p-4 text-gray-600 font-medium">{plan.billing_period}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(plan)}
                          className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-100 cursor-pointer text-blue-600 font-semibold text-sm transition rounded"
                        >
                          <EditIcon fontSize="small" />
                          <span>Edit</span>
                        </button>
                        <button
                          className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-100 cursor-pointer text-red-600 font-semibold text-sm transition rounded"
                          onClick={() => openDeleteModal(plan)}
                        >
                          <DeleteIcon fontSize="small" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Form Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-gray-900">
                {modalMode === "add" ? "Add New Plan" : "Edit Plan"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer">&times;</button>
            </div>

            <Formik
              initialValues={formData}
              validationSchema={planSchema}
              onSubmit={handleFormSubmit}
              enableReinitialize
            >
              {({ errors, touched, isSubmitting, status, values, setFieldValue }) => (
                <Form className="p-6 overflow-y-auto">
                  {status && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                      {status}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Plan Name <span className="text-red-500">*</span></label>
                      <Field type="text" name="name" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Standard" />
                      {errors.name && touched.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                      <Field type="number" name="price" min="0" step="0.01" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="0.00" />
                      {errors.price && touched.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                    <Field as="textarea" name="description" rows="2" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Enter plan description..."></Field>
                    {errors.description && touched.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  {/* Features Checkbox Section */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-bold text-gray-700">
                        Features <span className="text-xs text-gray-500 font-normal">(Select features to assign)</span>
                      </label>
                      <span className="text-xs text-blue-600 font-semibold">
                        {values.featureIds?.length || 0} selected
                      </span>
                    </div>

                    {activeFeatures.length === 0 ? (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 italic">
                        No active features available. Please create features first in Feature Management.
                      </div>
                    ) : (
                      <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 divide-y divide-gray-100 bg-white">
                        {activeFeatures.map((feature) => {
                          const isChecked = Array.isArray(values.featureIds) && values.featureIds.map(Number).includes(Number(feature.id));
                          return (
                            <label
                              key={feature.id}
                              className="flex items-start gap-3 py-2 cursor-pointer hover:bg-gray-50/80 px-1 rounded transition select-none"
                            >
                              <input
                                type="checkbox"
                                name="featureIds"
                                value={feature.id}
                                checked={isChecked}
                                onChange={(e) => {
                                  const currentIds = Array.isArray(values.featureIds) ? values.featureIds.map(Number) : [];
                                  const featureId = Number(feature.id);
                                  if (e.target.checked) {
                                    setFieldValue("featureIds", [...new Set([...currentIds, featureId])]);
                                  } else {
                                    setFieldValue(
                                      "featureIds",
                                      currentIds.filter((id) => id !== featureId)
                                    );
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1 cursor-pointer"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-gray-900">{feature.name}</div>
                                {feature.description && (
                                  <div className="text-xs text-gray-500 mt-0.5">{feature.description}</div>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Currency <span className="text-red-500">*</span></label>
                      <Field as="select" name="currency" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 outline-none">
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </Field>
                      {errors.currency && touched.currency && <p className="text-red-500 text-sm mt-1">{errors.currency}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Billing Period <span className="text-red-500">*</span></label>
                      <Field as="select" name="billing_period" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 outline-none">
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="lifetime">Lifetime</option>
                      </Field>
                      {errors.billing_period && touched.billing_period && <p className="text-red-500 text-sm mt-1">{errors.billing_period}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 shrink-0">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting || formProcessing} className={`px-6 py-2 text-white font-bold rounded-lg transition-colors cursor-pointer ${(isSubmitting || formProcessing) ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                      {(isSubmitting || formProcessing) ? "Saving..." : (modalMode === "add" ? "Create Plan" : "Save Changes")}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && planToDelete && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-black">Delete Subscription Plan</h2>
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-4 md:p-6">
              <p className="text-lg text-center text-black font-medium mb-4">
                Are you sure you want to delete this subscription plan?
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 text-center text-sm text-gray-700">
                <span className="font-bold text-gray-900">{planToDelete.name}</span>
                <span className="text-gray-500 ml-2">
                  ({planToDelete.currency} {planToDelete.price} / {planToDelete.billing_period})
                </span>
              </div>

              {deleteError && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm text-center">
                  {deleteError}
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="px-6 py-2 bg-gray-50 border border-black rounded-md text-black font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeletePlan}
                  disabled={deleting}
                  className="px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
