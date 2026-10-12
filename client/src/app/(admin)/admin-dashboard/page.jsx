"use client";
import React, { useEffect, useState } from "react";
import { getActivePlans } from "@/utils/api";
import Link from "next/link";
import { ROUTES } from "@/hooks/useNavigation";
import LayersIcon from '@mui/icons-material/Layers';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function AdminDashboardPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchPlans();
  }, []);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your platform settings and subscription plans.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center gap-5">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-full">
            <LayersIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Total Plans</div>
            <div className="text-2xl font-extrabold text-gray-900">Unknown</div>
            <div className="text-xs text-gray-400 mt-0.5">All subscription plans</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center gap-5">
          <div className="bg-green-50 text-green-600 p-4 rounded-full border border-green-100">
            <CheckIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Active Plans</div>
            <div className="text-2xl font-extrabold text-gray-900">{loading ? "-" : plans.length}</div>
            <div className="text-xs text-gray-400 mt-0.5">Available for new purchases</div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center gap-5">
          <div className="bg-red-50 text-red-500 p-4 rounded-full border border-red-100">
            <CloseIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Inactive Plans</div>
            <div className="text-2xl font-extrabold text-gray-900">Unknown</div>
            <div className="text-xs text-gray-400 mt-0.5">Not available for purchase</div>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Manage Subscription Plans</h2>
          <p className="text-gray-500 text-sm mt-1">View, create, edit, or deactivate plans for your users.</p>
        </div>
        <Link href={ROUTES.ADMIN_PLANS} className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
          View Plans <ArrowForwardIcon className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
}
