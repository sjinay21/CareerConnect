"use client";
import React, { useEffect, useState } from "react";
import PrivateRoute from "@/Route/privateroute";
import { getActivePlans, createSubscription, createPayment, getMySubscription, cancelMySubscription } from "@/utils/api";
import { v4 as uuidv4 } from "uuid";
import CheckIcon from '@mui/icons-material/Check';

function PlanPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Active Subscription State
  const [activeSub, setActiveSub] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  
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
    try {
      const [plansRes, subRes] = await Promise.all([
        getActivePlans(),
        getMySubscription().catch(() => null)
      ]);
      
      if (plansRes.ok) {
        const data = await plansRes.json();
        setPlans(data.plans || data || []);
      } else {
        setError("Failed to fetch subscription plans.");
      }
      
      if (subRes && subRes.ok) {
        const subData = await subRes.json();
        if (subData.data && subData.data.status === 'active') {
          setActiveSub(subData.data);
        } else {
          setActiveSub(null);
        }
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
    if (activeSub && activeSub.plan_id === plan.id) {
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
        setPaymentModalOpen(true);
        setPaymentResult(null);
      } else {
        alert(data.message || "Failed to initiate subscription.");
      }
    } catch (err) {
      alert("An error occurred while selecting the plan.");
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
            message: "Payment declined by provider. Your subscription remains pending." 
          });
          setCurrentIdempotencyKey(uuidv4());
        } else {
          setPaymentResult({ 
            success: true, 
            message: "Payment successful! Your subscription is now active." 
          });
          // Refresh data to show active sub
          await fetchPlansAndSubscription();
        }
      } else {
        setPaymentResult({ 
          success: false, 
          message: data.message || "Payment processing failed." 
        });
      }
    } catch (err) {
      setPaymentResult({ 
        success: false, 
        message: "A network error occurred while processing your payment." 
      });
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

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your premium subscription? You will lose access immediately.")) {
      return;
    }
    
    setCancelling(true);
    try {
      const response = await cancelMySubscription();
      const data = await response.json();
      
      if (response.ok) {
        alert("Subscription cancelled successfully.");
        await fetchPlansAndSubscription();
      } else {
        alert(data.message || "Failed to cancel subscription.");
      }
    } catch (err) {
      alert("A network error occurred.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex flex-col pt-4 md:pt-8">
      <main className="flex-grow flex flex-col items-center p-4">
        
        {activeSub && (
          <div className="w-full max-w-4xl bg-white border border-green-500 rounded-xl p-6 mb-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">Active Premium</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Current Plan: {activeSub.plan_name}</h2>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-gray-600">
                <p>Status: <span className="font-semibold text-green-600 capitalize">{activeSub.status}</span></p>
                <p>Started: {new Date(activeSub.starts_at).toLocaleDateString()}</p>
                <p>Expires: {activeSub.expires_at ? new Date(activeSub.expires_at).toLocaleDateString() : 'Never (Lifetime)'}</p>
              </div>
              <button 
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="px-6 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
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
            <div className="text-center text-red-600 text-lg">{error}</div>
          )}

          {!loading && !error && plans.length === 0 && (
            <div className="text-center text-gray-600 text-lg">No active plans available at the moment.</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 justify-center">
            
            {/* Hardcoded Free Plan */}
            <div className="bg-white border border-gray-200 hover:shadow-md rounded-2xl p-6 lg:p-8 flex flex-col relative transition-shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
              <p className="text-gray-500 mb-6 min-h-[48px]">Get started with the basics.</p>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">₹0</span>
                <span className="text-gray-500 ml-1">forever</span>
              </div>
              
              <button 
                disabled
                className={`w-full py-2.5 px-4 font-semibold rounded-full mb-8 transition-colors ${!activeSub ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                {!activeSub ? 'Current Plan' : 'Free Tier'}
              </button>

              <div className="flex-grow">
                <p className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Features</p>
                <ul className="flex flex-col gap-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><CheckIcon className="w-5 h-5 text-green-500" /> Create and manage your profile</li>
                  <li className="flex items-center gap-2"><CheckIcon className="w-5 h-5 text-green-500" /> Send connection requests</li>
                  <li className="flex items-center gap-2"><CheckIcon className="w-5 h-5 text-green-500" /> Browse jobs</li>
                  <li className="flex items-center gap-2"><CheckIcon className="w-5 h-5 text-green-500" /> Basic profile visibility</li>
                </ul>
              </div>
            </div>

            {plans.map((plan) => {
              const isFeatured = plan.billing_period === 'monthly' || plan.name.toLowerCase().includes('popular');
              const isCurrentActivePlan = activeSub && activeSub.plan_id === plan.id;

              return (
                <div 
                  key={plan.id}
                  className={`bg-white border rounded-2xl p-6 lg:p-8 flex flex-col relative transition-shadow ${
                    isFeatured ? "border-blue-700 shadow-lg transform md:-translate-y-4 border-2" : "border-gray-200 hover:shadow-md"
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-900 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm whitespace-nowrap">
                      Most Popular
                    </div>
                  )}
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                  <p className="text-gray-500 mb-6 min-h-[48px]">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">
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
                        ? "bg-green-600 text-white cursor-default"
                        : isFeatured 
                          ? "bg-blue-600 hover:bg-blue-700 text-white" 
                          : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {isCurrentActivePlan 
                      ? "Current Plan" 
                      : processingId === plan.id 
                        ? "Initializing..." 
                        : activeSub 
                          ? "Switch Plan" 
                          : "Upgrade Plan"}
                  </button>

                  <div className="flex-grow">
                    <p className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Features</p>
                    <ul className="flex flex-col gap-3 text-sm text-gray-600">
                      {plan.features ? plan.features.split('\n').map((feature, idx) => feature.trim() && (
                        <li key={idx} className="flex items-start gap-2 text-left">
                          <CheckIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" /> 
                          <span>{feature.trim()}</span>
                        </li>
                      )) : (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Payment</h2>
            
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
                Select Payment Method
              </label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="upi">UPI</option>
                <option value="net_banking">Net Banking</option>
              </select>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Payments are securely processed.
              </p>
            </div>

            {paymentResult && (
              <div className={`p-4 rounded-lg mb-6 ${paymentResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {paymentResult.message}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {(!paymentResult || !paymentResult.success) && (
                <button
                  onClick={handleProcessPayment}
                  disabled={paymentProcessing}
                  className={`w-full py-3 rounded-full font-bold text-white transition-colors ${
                    paymentProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {paymentProcessing ? 'Processing...' : `Pay ${selectedPlanDetails.currency} ${selectedPlanDetails.price}`}
                </button>
              )}
              
              <button
                onClick={closePaymentModal}
                disabled={paymentProcessing}
                className="w-full py-3 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {paymentResult && paymentResult.success ? 'Return to Dashboard' : 'Cancel'}
              </button>
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
