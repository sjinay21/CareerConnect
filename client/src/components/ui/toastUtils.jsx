"use client";
import { Toaster, toast } from "react-hot-toast";

// Centralized message dictionary
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: "Welcome back!",
  LOGIN_ERROR: "Invalid email or password",
  NEW_USER_WELCOME: "Welcome! Let's set up your profile.",

  REGISTER_SUCCESS: "Registration successful! Please log in.",
  REGISTER_ERROR: "Registration failed",
  
  LOGOUT_SUCCESS: "Logged out successfully",

  POST_CREATED: "Post created successfully!",
  POST_CREATE_ERROR: "Failed to create post",

  POST_UPDATED: "Post updated successfully",
  POST_UPDATE_ERROR: "Failed to update post",

  POST_DELETED: "Post deleted",
  POST_DELETE_ERROR: "Failed to delete post",

  PROFILE_UPDATED: "Profile updated successfully",
  PROFILE_UPDATE_ERROR: "Failed to update profile",

  ONBOARDING_SUCCESS: "Profile setup complete! Welcome!",
  ONBOARDING_ERROR: "Failed to save profile setup",

  NETWORK_ERROR: "Network error occurred.",
};

// Custom Toaster component with premium styling
export function CustomToaster() {
  console.log("[toastUtils] CustomToaster is mounting!");
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          fontSize: "15px",
          borderRadius: "12px",
          padding: "16px 24px",
          zIndex: 999999,
          color: "#fff", 
        },
        success: {
          style: {
            background: "#10b981", 
          },
          iconTheme: {
            primary: "#ffffff",
            secondary: "#10b981",
          },
        },
        error: {
          style: {
            background: "#ef4444", // Red for errors
          },
          iconTheme: {
            primary: "#ffffff",
            secondary: "#ef4444",
          },
        }
      }}
    />
  );
}

// Optional helper functions if you prefer calling them instead of direct toast()
export const showSuccessToast = (message) => {
  console.log("[toastUtils] showSuccessToast called with:", message);
  toast.success(message);
};
export const showErrorToast = (message) => {
  console.log("[toastUtils] showErrorToast called with:", message);
  toast.error(message);
};
export const showDeleteToast = (message) => {
  console.log("[toastUtils] showDeleteToast called with:", message);
  toast.success(message, {
    style: {
      background: "#ef4444", 
      color: "#fff",
    },
    iconTheme: {
      primary: "#ffffff",
      secondary: "#ef4444",
    },
  });
};
