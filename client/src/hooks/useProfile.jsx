"use client";
import { useState, useEffect } from "react";
import { getUserProfile } from "@/utils/api";

export function useProfile() {
  const [profile, setProfile] = useState({
    id: null,
    name: "",
    summary: "",
    location: "",
    about: "",
    skills: "",
    profile_picture_url: null,
    banner_url: null,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getUserProfile();
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        }
      } catch (err) {
        console.error("Failed to load profile data", err);
      }
    }
    fetchProfile();
  }, []);

  return { profile, setProfile };
}
