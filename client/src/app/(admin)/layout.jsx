"use client";
import React, { useEffect, useState } from "react";
import PrivateRoute from "@/Route/privateroute";
import { useProfile } from "@/hooks/useProfile";
import { usePathname } from "next/navigation";
import { useAppNavigation, ROUTES } from "@/hooks/useNavigation";
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';
import LayersIcon from '@mui/icons-material/Layers';

export default function AdminLayout({ children }) {
  const { goToFeeds } = useAppNavigation();
  const pathname = usePathname();
  const { profile } = useProfile();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (profile.id !== null) {
      if (profile.role === 'admin') {
        setIsAuthorized(true);
      } else {
        goToFeeds();
      }
      setChecking(false);
    }
  }, [profile, goToFeeds]);

  if (checking) return <div className="min-h-screen flex items-center justify-center">Checking authorization...</div>;
  if (!isAuthorized) return null;

  return (
    <PrivateRoute>
      <div className="min-h-[calc(100vh-52px)] bg-[#f8f9fc] flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0">
          <nav className="flex flex-col gap-2">
            <Link 
              href={ROUTES.ADMIN_DASHBOARD}
              className={`px-4 py-3 rounded-lg font-semibold flex items-center gap-3 transition-colors ${
                pathname === ROUTES.ADMIN_DASHBOARD 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              Dashboard
            </Link>
            <Link 
              href={ROUTES.ADMIN_PLANS}
              className={`px-4 py-3 rounded-lg font-semibold flex items-center gap-3 transition-colors ${
                pathname === ROUTES.ADMIN_PLANS 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayersIcon className="w-5 h-5" />
              Subscription Plans
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-x-auto w-full">
          {children}
        </main>
      </div>
    </PrivateRoute>
  );
}
