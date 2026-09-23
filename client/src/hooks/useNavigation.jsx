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
    goToProfile: (id) => router.push(`/profile/${id}`),
  };
};
