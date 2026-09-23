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
    skill: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getUserProfile();
        if (res.ok) {
          const data = await res.json();
          setProfile((prev) => ({
            ...prev,
            id: data.user.id,
            name: data.user.name || prev.name,
            summary: data.user.summary || prev.summary,
            location: data.user.location || prev.location,
            about: data.user.about || prev.about,
            skill: data.user.skills || prev.skill,
          }));
        }
      } catch (err) {
        console.error("Failed to load profile data", err);
      }
    }
    fetchProfile();
  }, []);

  return { profile, setProfile };
}

