"use client";
import React, { useEffect, useState } from "react";
import { useAppNavigation } from "@/hooks/useNavigation";
import Navbar1 from "@/components/layout/navbar1";
import { isAuthenticated } from "@/utils/api";

export default function PublicRoute({ children }) {
  const { goToFeeds } = useAppNavigation();
  const [isLogin, setIsLogin] = useState(true);
  
  useEffect(() => {
    const auth = isAuthenticated();
    if (auth) {
      goToFeeds();
    } else {
      setIsLogin(false);
    }
  }, [goToFeeds]);

  if (isLogin) return null;

  return (
    <>
      <Navbar1 />
      {children}
    </>
  );
}
