import { useRouter } from "next/navigation";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FEEDS: "/feeds",
  NETWORK: "/mynetwork",
  MESSAGES: "/messages",
  NOTIFICATION: "/notification",
  ARTICLE_CREATE: "/article/create",
  ONBOARDING: "/onboarding",
  JOBS: "/jobs",
  JOB_CREATE: "/job_create",
  JOB_TRACKER: "/job_tracker",
  ADMIN_DASHBOARD: "/admin-dashboard",
  ADMIN_PLANS: "/admin-plans",
  PLAN: "/plan",
  SETTINGS: "/settings",
  HELP: "/help",
  PROFILE: (id) => `/profile/${id}`,
  JOB: (id) => `/jobs/${id}`,
  POST: (id) => `/post/${id}`,
};

export const useAppNavigation = () => {
  const router = useRouter();

  return {
    router, // Exposed for dynamic or parameterized routes
    goToHome: () => router.push(ROUTES.HOME),
    goToLogin: () => router.push(ROUTES.LOGIN),
    goToRegister: () => router.push(ROUTES.REGISTER),
    goToFeeds: () => router.push(ROUTES.FEEDS),
    goToNetwork: () => router.push(ROUTES.NETWORK),
    goToMessages: () => router.push(ROUTES.MESSAGES),
    goToNotification: () => router.push(ROUTES.NOTIFICATION),
    goToArticleCreate: () => router.push(ROUTES.ARTICLE_CREATE),
    goToOnboarding: () => router.push(ROUTES.ONBOARDING),
    goToProfile: (id) => router.push(ROUTES.PROFILE(id)),
    goToJobs: () => router.push(ROUTES.JOBS),
    goToJob: (id) => router.push(ROUTES.JOB(id)),
    goToPost: (id) => router.push(ROUTES.POST(id)),
    goToJobCreate: () => router.push(ROUTES.JOB_CREATE),
    goToJobTracker: () => router.push(ROUTES.JOB_TRACKER),
    goToAdminDashboard: () => router.push(ROUTES.ADMIN_DASHBOARD),
    goToAdminPlans: () => router.push(ROUTES.ADMIN_PLANS),
    goToPlan: () => router.push(ROUTES.PLAN),
    goToSettings: () => router.push(ROUTES.SETTINGS),
    goToHelp: () => router.push(ROUTES.HELP),
  };
};
