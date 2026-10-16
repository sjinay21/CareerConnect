"use client";
import React, { useEffect, useState } from "react";
import { getAllPlansAdmin, getActivePlans, getFeatures } from "@/utils/api";
import Link from "next/link";
import { ROUTES } from "@/hooks/useNavigation";
import LayersIcon from '@mui/icons-material/Layers';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    inactivePlans: 0,
    totalFeatures: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        let allPlans = [];
        
        // Fetch all plans (active & inactive)
        try {
          const plansRes = await getAllPlansAdmin();
          if (plansRes.ok) {
            const data = await plansRes.json();
            allPlans = Array.isArray(data) ? data : data.plans || [];
          } else {
            // Fallback to active plans if /all fails
            const activeRes = await getActivePlans();
            if (activeRes.ok) {
              const activeData = await activeRes.json();
              allPlans = Array.isArray(activeData) ? activeData : activeData.plans || [];
            }
          }
        } catch {
          const activeRes = await getActivePlans();
          if (activeRes.ok) {
            const activeData = await activeRes.json();
            allPlans = Array.isArray(activeData) ? activeData : activeData.plans || [];
          }
        }

        // Fetch features
        let featuresCount = 0;
        try {
          const featuresRes = await getFeatures();
          if (featuresRes.ok) {
            const featuresData = await featuresRes.json();
            featuresCount = (featuresData.features || []).length;
          }
        } catch (err) {
          console.error("Failed to fetch features stats", err);
        }

        const activeCount = allPlans.filter(p => p.is_active !== false).length;
        const inactiveCount = allPlans.filter(p => p.is_active === false).length;

        setStats({
          totalPlans: allPlans.length,
          activePlans: activeCount,
          inactivePlans: inactiveCount,
          totalFeatures: featuresCount,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your platform settings and subscription plans.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-5">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-full">
            <LayersIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-500 text-xs font-bold mb-1">Total Plans</div>
            <div className="text-2xl font-bold text-gray-900">{loading ? "-" : stats.totalPlans}</div>
            <div className="text-xs text-gray-400 mt-0.5">All subscription plans</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-5">
          <div className="bg-green-50 text-green-600 p-4 rounded-full border border-green-100">
            <CheckIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-500 text-xs font-bold mb-1">Active Plans</div>
            <div className="text-2xl font-bold text-gray-900">{loading ? "-" : stats.activePlans}</div>
            <div className="text-xs text-gray-400 mt-0.5">Available for purchase</div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-5">
          <div className="bg-red-50 text-red-500 p-4 rounded-full border border-red-100">
            <CloseIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-500 text-xs font-bold mb-1">Inactive Plans</div>
            <div className="text-2xl font-bold text-gray-900">{loading ? "-" : stats.inactivePlans}</div>
            <div className="text-xs text-gray-400 mt-0.5">Deactivated plans</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-5">
          <div className="bg-purple-50 text-purple-600 p-4 rounded-full border border-purple-100">
            <TuneIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-500 text-xs font-bold mb-1">Total Features</div>
            <div className="text-2xl font-bold text-gray-900">{loading ? "-" : stats.totalFeatures}</div>
            <div className="text-xs text-gray-400 mt-0.5">Configured features</div>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between items-start gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Manage Subscription Plans</h2>
            <p className="text-gray-500 text-sm mt-1">View, create, edit, or deactivate plans for your users.</p>
          </div>
          <Link href={ROUTES.ADMIN_PLANS} className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
            View Plans <ArrowForwardIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between items-start gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Feature Management</h2>
            <p className="text-gray-500 text-sm mt-1">View, create, or delete features that can be assigned to plans.</p>
          </div>
          <Link href={ROUTES.ADMIN_FEATURES} className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
            Manage Features <ArrowForwardIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
