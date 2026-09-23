"use client";
import React, { useEffect, useState } from "react";
import { useAppNavigation } from "@/hooks/useNavigation";
import Navbar2 from "@/components/layout/navbar2";
import { isAuthenticated } from "@/utils/api";
import { usePathname } from "next/navigation";

export default function PrivateRoute({ children }) {
  const { goToLogin, goToOnboarding, goToFeeds } = useAppNavigation();
  const [isLogin, setIsLogin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const auth = isAuthenticated();
    if (!auth) {
      goToLogin();
    } else {
      const isProfileComplete = localStorage.getItem("profileComplete");
      if (isProfileComplete == "false" && pathname != "/onboarding") {
        goToOnboarding();
      } else if (isProfileComplete == "true" && pathname == "/onboarding") {
        goToFeeds();
      } else {
        setIsLogin(true);
      }
    }
  }, [goToLogin, goToOnboarding, goToFeeds, pathname]);

  if (!isLogin) return null;

  return (
    <>
      {pathname !== "/onboarding" && <Navbar2 />}
      {children}
    </>
  );
}
