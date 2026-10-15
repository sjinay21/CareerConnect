// ==============================================================================
// TEMPORARILY COMMENTED OUT: Tier-based subscription logic
// Preparing for migration to feature-based subscription access checks.
// ==============================================================================

/*
import { getUserActiveSubscription } from "../models/Subscription.js";

export const PLAN_TIERS = {
  FREE: "free",
  PREMIUM: "premium",
  SUPER_PREMIUM: "super_premium",
};

export function resolveUserTier(activeSub) {
  if (!activeSub) {
    return PLAN_TIERS.FREE;
  }

  const tier = activeSub.tier;

  if (tier === "super_premium") {
    return PLAN_TIERS.SUPER_PREMIUM;
  }

  if (tier === "premium") {
    return PLAN_TIERS.PREMIUM;
  }
  return PLAN_TIERS.FREE;
}

export async function getUserPlanTier(userId) {
  const activeSub = await getUserActiveSubscription(userId);
  const tier = resolveUserTier(activeSub);

  return {
    tier: tier,
    subscription: activeSub || null,
  };
}

export async function attachSubscriptionTier(req, res, next) {
  try {
    const planData = await getUserPlanTier(req.user.id);
    const tier = planData.tier;
    const subscription = planData.subscription;

    req.userTier = tier;
    req.activeSubscription = subscription;
    return next();
  } catch (error) {
    console.error("Error resolving subscription tier:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function requireSuperPremium(req, res, next) {
  try {
    if (!req.userTier) {
      const planData = await getUserPlanTier(req.user.id);
      const tier = planData.tier;
      const subscription = planData.subscription;

      req.userTier = tier;
      req.activeSubscription = subscription;
    }

    if (req.userTier !== PLAN_TIERS.SUPER_PREMIUM) {
      return res.status(403).json({
        message: "Access denied. The Profile Views graph is only available on the Super Premium plan.",
        code: "FEATURE_LOCKED",
        requiredPlan: "Super Premium",
      });
    }

    return next();
  } catch (error) {
    console.error("Error in requireSuperPremium middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function requirePremiumForFilter(req, res, next) {
  try {
    const rawPeriod = req.query.period;
    const userTier = req.userTier;

    if (userTier === PLAN_TIERS.FREE && rawPeriod !== undefined && rawPeriod !== "") {
      return res.status(403).json({
        message: "Period filtering is only available on Premium plans. Upgrade to filter by 7, 30, or 90 days.",
        code: "PERIOD_FILTER_LOCKED",
        requiredPlan: "Premium",
      });
    }

    return next();
  } catch (error) {
    console.error("Error in requirePremiumForFilter middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function requirePremium(req, res, next) {
  try {
    if (!req.userTier) {
      const planData = await getUserPlanTier(req.user.id);
      const tier = planData.tier;
      const subscription = planData.subscription;

      req.userTier = tier;
      req.activeSubscription = subscription;
    }

    if (req.userTier === PLAN_TIERS.FREE) {
      return res.status(403).json({
        message: "Access denied. Premium subscription required.",
        code: "FEATURE_LOCKED",
        requiredPlan: "Premium",
      });
    }

    return next();
  } catch (error) {
    console.error("Error in requirePremium middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
*/
