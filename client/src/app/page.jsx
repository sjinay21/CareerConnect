"use client";
import React from 'react';
import PublicRoute from '@/Route/publicroute';
import LandingPage from '@/components/home/landingpage';

export default function Home() {
  return (
    <PublicRoute>
      <LandingPage />
    </PublicRoute>
  );
}
