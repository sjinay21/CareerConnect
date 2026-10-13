import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const onboardingSchema = Yup.object({
  summary: Yup.string().required("Summary is required"),
  location: Yup.string().required("Location is required"),
  about: Yup.string().required("About is required"),
  skills: Yup.string().required("Skills are required"),
});

export const updateProfileSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

  summary: Yup.string()
    .trim()
    .max(240, "Summary cannot exceed 240 characters")
    .nullable(),

  location: Yup.string()
    .trim()
    .max(200, "Location cannot exceed 200 characters")
    .nullable(),

  about: Yup.string()
    .trim()
    .max(2600, "About cannot exceed 2600 characters")
    .nullable(),

  skills: Yup.string()
    .trim()
    .max(500, "Skills cannot exceed 500 characters")
    .nullable(),
});

// Settings Page Modals Schemas
export const updateNameSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  location: Yup.string()
    .trim()
    .max(200, "Location cannot exceed 200 characters")
    .nullable(),
});

export const UpdateEmailSchema = (currentEmail = "") =>
  Yup.object({
    email: Yup.string()
      .trim()
      .email("Invalid email address")
      .notOneOf(
        currentEmail ? [currentEmail.trim().toLowerCase(), currentEmail.trim()] : [],
        "New email cannot be the same as your current email"
      )
      .required("Email is required"),
  });

export const updateEmailSchema = UpdateEmailSchema;

export const updatePasswordSchema = Yup.object({
  currentPassword: Yup.string()
    .min(6, "Current password must be at least 6 characters")
    .required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "New password must be at least 6 characters")
    .notOneOf([Yup.ref("currentPassword")], "New password cannot be the same as current password")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
});
