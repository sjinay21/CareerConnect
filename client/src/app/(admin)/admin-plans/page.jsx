"use client";
import React, { useEffect, useState } from "react";
import { getActivePlans, createPlan, updatePlan, deactivatePlan } from "@/utils/api";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, Form, Field } from "formik";
import { planSchema } from "@/schemas/planSchema";
import EditIcon from '@mui/icons-material/Edit';
import { showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";
export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "", description: "", features: "", price: "", currency: "INR", billing_period: "monthly", tier: "premium"
  });
  const [formError, setFormError] = useState("");
  const [formProcessing, setFormProcessing] = useState(false);

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

  useEffect(() => {
    fetchPlans();
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setFormData({ name: "", description: "", features: "", price: "", currency: "INR", billing_period: "monthly", tier: "premium" });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (plan) => {
    setModalMode("edit");
    setCurrentPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      features: plan.features || "",
      price: plan.price,
      currency: plan.currency,
      billing_period: plan.billing_period,
      tier: plan.tier || "premium"
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values, { setSubmitting, setStatus }) => {
    setFormProcessing(true);
    try {
      let response;
      if (modalMode === "add") {
        response = await createPlan(values);
      } else {
        response = await updatePlan(currentPlan.id, values);
      }

      if (response.ok) {
        setIsModalOpen(false);
        fetchPlans();
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

  const handleDeactivate = async (plan) => {
    if (confirm(`Are you sure you want to delete ${plan.name}? It will no longer be available for new purchases.`)) {
      try {
        const response = await deactivatePlan(plan.id);
        if (response.ok) {
          showSuccessToast("Plan deleted successfully");
          fetchPlans();
        } else {
          showErrorToast("Failed to delete plan.");
        }
      } catch (err) {
        showErrorToast("Network error during deletion.");
      }
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-10">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Subscription Plans</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage subscription plans to offer different service tiers to your users.</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <AddIcon className="w-5 h-5" /> Add Plan
          </button>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fc] border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Tier</th>
                <th className="p-4 min-w-[200px]">Description</th>
                <th className="p-4 min-w-[200px]">Features</th>
                <th className="p-4">Price</th>
                <th className="p-4">Currency</th>
                <th className="p-4">Billing Period</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right min-w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" className="p-10 text-center text-gray-500 font-medium">Loading plans...</td></tr>
              ) : plans.length === 0 ? (
                <tr><td colSpan="10" className="p-10 text-center text-gray-500 font-medium">No active plans found.</td></tr>
              ) : (
                plans.map(plan => (
                  <tr key={plan.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-gray-500 font-mono text-sm">{plan.id}</td>
                    <td className="p-4 font-bold text-gray-900">{plan.name}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        plan.tier === "super_premium"
                          ? " text-purple-800 border border-purple-200 font-bold"
                          : " text-blue-800 border border-blue-200 font-bold"
                      }`}>
                        {plan.tier === "super_premium" ? "Super Premium" : "Premium"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-sm truncate max-w-xs">{plan.description}</td>
                    <td className="p-4 text-gray-600 text-sm truncate max-w-xs" title={plan.features}>{plan.features}</td>
                    <td className="p-4 font-bold text-gray-900">{plan.price}</td>
                    <td className="p-4 text-gray-500 font-medium">{plan.currency}</td>
                    <td className="p-4 text-gray-600 capitalize font-medium">{plan.billing_period}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(plan)}
                          className="flex items-center gap-1 px-2 py-3 hover:bg-gray-100 cursor-pointer text-blue-600 font-semibold text-sm transition"
                          >
                            <EditIcon fontSize="small" />
                          <span>Edit </span>
                        </button>
                        <button
                            className="flex items-center gap-1 px-2 py-3 hover:bg-gray-100 cursor-pointer text-red-600 font-semibold text-sm transition"
                           onClick={() => handleDeactivate(plan)}
                          >
                            <DeleteIcon fontSize="small" />
                            <span>Delete </span>
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

      {/* Plan Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-gray-900">
                {modalMode === "add" ? "Add New Plan" : "Edit Plan"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <Formik
              initialValues={formData}
              validationSchema={planSchema}
              onSubmit={handleFormSubmit}
              enableReinitialize
            >
              {({ errors, touched, isSubmitting, status, setStatus }) => (
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

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Features <span className="text-red-500">*</span></label>
                    <Field as="textarea" name="features" rows="3" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Enter features (one per line)"></Field>
                    {errors.features && touched.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
                    <p className="text-xs text-gray-500 mt-1">Place each feature on a new line.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Plan Tier <span className="text-red-500">*</span></label>
                      <Field as="select" name="tier" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 outline-none">
                        <option value="premium">Premium</option>
                        <option value="super_premium">Super Premium</option>
                      </Field>
                      {errors.tier && touched.tier && <p className="text-red-500 text-sm mt-1">{errors.tier}</p>}
                    </div>
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
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting || formProcessing} className={`px-6 py-2 text-white font-bold rounded-lg transition-colors ${(isSubmitting || formProcessing) ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                      {(isSubmitting || formProcessing) ? "Saving..." : (modalMode === "add" ? "Create Plan" : "Save Changes")}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
}
