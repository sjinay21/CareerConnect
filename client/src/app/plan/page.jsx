"use client";
import React, { useEffect, useState } from "react";
import PrivateRoute from "@/Route/privateroute";
import { getActivePlans, createSubscription, createPayment, getMySubscription, cancelMySubscription } from "@/utils/api";
import { v4 as uuidv4 } from "uuid";
import CheckIcon from '@mui/icons-material/Check';
import LockIcon from '@mui/icons-material/Lock';
import { showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";

function PlanPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Active Subscription State
  const [activeSub, setActiveSub] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  
  // Plan Selection State
  const [processingId, setProcessingId] = useState(null);
  
  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [currentIdempotencyKey, setCurrentIdempotencyKey] = useState(null);

  const fetchPlansAndSubscription = async () => {
    setLoading(true);
    setError(null);
    try {
      const [plansRes, subRes] = await Promise.all([
        getActivePlans(),
        getMySubscription().catch(() => null)
      ]);
      
      if (plansRes && plansRes.ok) {
        const data = await plansRes.json();
        setPlans(data.plans || data || []);
      } else {
        const errData = plansRes ? await plansRes.json().catch(() => ({})) : {};
        setError(errData.message || "Failed to fetch subscription plans.");
      }
      
      if (subRes && subRes.ok) {
        const subData = await subRes.json();
        if (subData.data && subData.data.status === 'active') {
          setActiveSub(subData.data);
        } else {
          setActiveSub(null);
        }
      } else {
        setActiveSub(null);
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlansAndSubscription();
  }, []);

  const handleSelectPlan = async (plan) => {
    // If the user already has this plan active, do nothing
    if (activeSub && Number(activeSub.plan_id) === Number(plan.id)) {
      return;
    }
    
    setProcessingId(plan.id);
    try {
      const response = await createSubscription(plan.id);
      const data = await response.json();
      if (response.ok) {
        const subscription = data.data?.subscription || data.subscription || data;
        setSelectedSubscription(subscription);
        setSelectedPlanDetails(plan);
        setCurrentIdempotencyKey(uuidv4());
        setPaymentMethod("credit_card");
        setPaymentResult(null);
        setPaymentModalOpen(true);
      } else {
        showErrorToast(data.message || "Failed to initiate subscription.");
      }
    } catch (err) {
      showErrorToast("An error occurred while selecting the plan.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedSubscription || !selectedSubscription.id) {
      setPaymentResult({
        success: false,
        message: "Invalid or missing subscription ID. Please try selecting the plan again."
      });
      return;
    }

    setPaymentProcessing(true);
    setPaymentResult(null);
    try {
      const payload = {
        subscription_id: selectedSubscription.id,
        payment_method: paymentMethod,
        idempotency_key: currentIdempotencyKey
      };
      
      const response = await createPayment(payload);
      const data = await response.json();
      
      if (response.ok && data.payment) {
        if (data.payment.status === 'failed') {
          setPaymentResult({ 
            success: false, 
            message: "Payment could not be processed. Your subscription was not activated." 
          });
          setCurrentIdempotencyKey(uuidv4());
        } else {
          setPaymentResult({ 
            success: true, 
            message: "Payment successful! Your subscription is now active." 
          });
          showSuccessToast("Payment successful! Your plan is now active.");
          await fetchPlansAndSubscription();
        }
      } else {
        setPaymentResult({ 
          success: false, 
          message: data.message || "Payment processing failed. Please try again." 
        });
        setCurrentIdempotencyKey(uuidv4());
      }
    } catch (err) {
      setPaymentResult({ 
        success: false, 
        message: "A network error occurred while processing your payment. Please try again." 
      });
      setCurrentIdempotencyKey(uuidv4());
    } finally {
      setPaymentProcessing(false);
    }
  };

  const closePaymentModal = () => {
    if (!paymentProcessing) {
      setPaymentModalOpen(false);
      setPaymentResult(null);
      setCurrentIdempotencyKey(null);
    }
  };

  const confirmCancelSubscription = async () => {
    setCancelling(true);
    try {
      const response = await cancelMySubscription();
      const data = await response.json();
      
      if (response.ok) {
        showSuccessToast("Subscription cancelled successfully.");
        setIsCancelModalOpen(false);
        await fetchPlansAndSubscription();
      } else {
        showErrorToast(data.message || "Failed to cancel subscription.");
      }
    } catch (err) {
      showErrorToast("A network error occurred.");
    } finally {
      setCancelling(false);
    }
  };

  const freePlan = plans.find((p) => Number(p.price) === 0 || p.name?.toLowerCase() === "free");
  const effectiveCurrentPlan = activeSub || (freePlan ? {
    id: freePlan.id,
    plan_id: freePlan.id,
    plan_name: freePlan.name,
    plan_price: freePlan.price,
    plan_currency: freePlan.currency,
    plan_billing_period: freePlan.billing_period,
    status: "active",
    starts_at: null,
    expires_at: null
  } : null);
  const effectiveCurrentPlanId = effectiveCurrentPlan ? Number(effectiveCurrentPlan.plan_id || effectiveCurrentPlan.id) : null;

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex flex-col pt-4 md:pt-8">
      <main className="flex-grow flex flex-col items-center p-4">
        
        {/* Current / Active Subscription Banner */}
        {effectiveCurrentPlan && (
          <div className="w-full max-w-4xl bg-white border border-blue-600 rounded-xl p-6 mb-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
              {Number(effectiveCurrentPlan.plan_price) > 0 ? "Active Premium" : "Current Plan"}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Current Plan: {effectiveCurrentPlan.plan_name}</h2>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-gray-600 space-y-1">
                <p>Status: <span className="font-semibold text-blue-600">{effectiveCurrentPlan.status}</span></p>
                {effectiveCurrentPlan.starts_at && (
                  <p>Started: {new Date(effectiveCurrentPlan.starts_at).toLocaleDateString()}</p>
                )}
                <p>
                  Expires: {
                    effectiveCurrentPlan.plan_billing_period === 'lifetime' || !effectiveCurrentPlan.expires_at 
                      ? 'Never (Lifetime Plan)' 
                      : new Date(effectiveCurrentPlan.expires_at).toLocaleDateString()
                  }
                </p>
              </div>
              {Number(effectiveCurrentPlan.plan_price) > 0 && (
                <button 
                  onClick={() => setIsCancelModalOpen(true)}
                  disabled={cancelling}
                  className="px-6 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="text-center mb-8 md:mb-12 mt-4 md:mt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose the right plan for you</h1>
          <p className="text-gray-600 text-lg">Unlock your full potential with Premium.</p>
        </div>

        <div className="w-full max-w-6xl pb-16">
          {loading && (
            <div className="text-center text-gray-600 text-lg">Loading plans...</div>
          )}
          
          {error && (
            <div className="text-center text-red-600 text-lg mb-6">{error}</div>
          )}

          {!loading && !error && plans.length === 0 && (
            <div className="text-center text-gray-600 text-lg">No active plans available at the moment.</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 justify-center">
            {plans.map((plan) => {
              const isCurrentActivePlan = effectiveCurrentPlanId && Number(plan.id) === Number(effectiveCurrentPlanId);
              const isFeatured = (plan.billing_period === 'monthly' || plan.name?.toLowerCase().includes('popular')) && !isCurrentActivePlan;

              return (
                <div 
                  key={plan.id}
                  className={`bg-white border rounded-2xl p-6 lg:p-8 flex flex-col relative transition-all ${
                    isCurrentActivePlan 
                      ? "border-blue-600 ring-2 ring-blue-600/30 shadow-md" 
                      : isFeatured 
                        ? "border-blue-700 shadow-lg transform md:-translate-y-4 border-2" 
                        : "border-gray-200 hover:shadow-md"
                  }`}
                >
                  {isCurrentActivePlan ? (
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm flex items-center gap-1">
                      <CheckIcon sx={{ fontSize: 16 }} /> Current Plan
                    </div>
                  ) : isFeatured ? (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-900 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm whitespace-nowrap">
                      Most Popular
                    </div>
                  ) : null}
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                  <p className="text-gray-500 mb-6 min-h-[48px]">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.currency === 'USD' ? '$' : plan.currency === 'INR' ? '₹' : plan.currency + ' '}
                      {plan.price}
                    </span>
                    <span className="text-gray-500 ml-1">
                      {plan.billing_period === 'monthly' ? 'per month' : plan.billing_period === 'yearly' ? 'per year' : 'lifetime'}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isCurrentActivePlan || processingId === plan.id}
                    className={`w-full py-2.5 px-4 font-semibold rounded-full mb-8 transition-colors ${
                      isCurrentActivePlan 
                        ? "bg-blue-50 text-blue-700 border border-blue-600 cursor-default"
                        : isFeatured 
                          ? "bg-blue-600 hover:bg-blue-700 text-white" 
                          : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {isCurrentActivePlan 
                      ? "Current Plan" 
                      : processingId === plan.id 
                        ? "Initializing..." 
                        : (activeSub && Number(activeSub.plan_price) > 0)
                          ? "Switch Plan" 
                          : "Upgrade Plan"}
                  </button>

                  <div className="flex-grow">
                    <p className="text-sm font-bold text-gray-900 mb-4 tracking-wider">Features</p>
                    <ul className="flex flex-col gap-3 text-sm text-gray-600">
                      {Array.isArray(plan.features) && plan.features.length > 0 ? (
                        plan.features.map((feature) => (
                          <li key={feature.id} className="flex items-start gap-2 text-left">
                            <CheckIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" /> 
                            <div>
                              <span className="font-medium text-gray-900">{feature.name}</span>
                              {feature.description && (
                                <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                              )}
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-2 text-gray-400 italic">No features listed</li>
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-gray-500 text-sm mt-10 text-center">
            Illustrative plans and pricing. Test environment.
          </div>
        </div>
      </main>

      {/* Mock Payment Modal */}
      {paymentModalOpen && selectedPlanDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Payment</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-medium">Plan</span>
                <span className="font-bold text-gray-900">{selectedPlanDetails.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-medium">Billing Period</span>
                <span className="text-gray-900 capitalize">{selectedPlanDetails.billing_period}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-gray-800 font-bold">Total Payable</span>
                <span className="text-lg font-bold text-blue-700">
                  {selectedPlanDetails.currency} {selectedPlanDetails.price}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Method
              </label>
              <select 
                disabled={paymentProcessing}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setPaymentResult(null);
                }}
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="upi">UPI</option>
                <option value="net_banking">Net Banking</option>
              </select>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <LockIcon className="text-blue-600" sx={{ fontSize: 16 }} />
                Mock payment simulation environment.
              </p>
            </div>

            {paymentResult && (
              <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${
                paymentResult.success 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {paymentResult.message}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {(!paymentResult || !paymentResult.success) ? (
                <button
                  onClick={handleProcessPayment}
                  disabled={paymentProcessing}
                  className={`w-full py-3 rounded-full font-bold text-white transition-colors ${
                    paymentProcessing 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow'
                  }`}
                >
                  {paymentProcessing 
                    ? 'Processing Payment...' 
                    : Number(selectedPlanDetails.price) === 0 
                      ? 'Activate Free Plan' 
                      : `Pay ${selectedPlanDetails.currency} ${selectedPlanDetails.price}`}
                </button>
              ) : (
                <button
                  onClick={closePaymentModal}
                  className="w-full py-3 rounded-full font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow"
                >
                  Done / View Current Plan
                </button>
              )}
              
              <button
                onClick={closePaymentModal}
                disabled={paymentProcessing}
                className="w-full py-2.5 rounded-full font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {paymentResult && paymentResult.success ? 'Close' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Cancel Subscription</h2>
              <button 
                onClick={() => setIsCancelModalOpen(false)}
                className="text-red-500 hover:text-red-700 font-bold text-xl cursor-pointer"
                disabled={cancelling}
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <p className="text-lg text-center text-black font-medium mb-8 pb-6">
                Are you sure you want to cancel your premium subscription? You will lose access immediately.
              </p>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  disabled={cancelling}
                  className="px-6 py-2 bg-gray-50 border border-black rounded-md text-black font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCancelSubscription}
                  disabled={cancelling}
                  className="px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WrappedPlanPage() {
  return (
    <PrivateRoute>
      <PlanPage />
    </PrivateRoute>
  );
}
