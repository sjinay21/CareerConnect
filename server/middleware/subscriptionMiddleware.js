import { getUserActiveSubscriptionWithFeatures } from "../models/Subscription.js";
import { getFeatureByName } from "../models/Feature.js";
export function requireFeature(featureName) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // 1. Resolve required feature record from database
      const feature = await getFeatureByName(featureName);
      if (!feature || !feature.is_active) {
        return res.status(403).json({
          message: `The "${featureName}" feature is currently unavailable.`,
          code: "FEATURE_UNAVAILABLE",
        });
      }

      // 2. Fetch active subscription with assigned features (cached on req)
      if (!req.subscription) {
        req.subscription = await getUserActiveSubscriptionWithFeatures(userId);
      }

      if (!req.subscription) {
        return res.status(403).json({
          message: `Access denied. An active subscription is required to access "${feature.name}".`,
          code: "SUBSCRIPTION_REQUIRED",
          requiredFeature: feature.name,
        });
      }

      // 3. Verify the feature is assigned to the user's plan
      const hasFeature = req.subscription.features.some((f) => f.id === feature.id);
      if (!hasFeature) {
        return res.status(403).json({
          message: `Access denied. The "${feature.name}" feature is not included in your current subscription plan.`,
          code: "FEATURE_LOCKED",
          requiredFeature: feature.name,
        });
      }

      req.currentFeature = feature;
      next();
    } catch (error) {
      console.error("Feature authorization error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
export async function requirePeriodFilter(req, res, next) {
  const rawPeriod = req.query.period;
  if (rawPeriod === undefined || rawPeriod === "") {
    return next();
  }
  return requireFeature("Period Filter")(req, res, next);
}
export const requireProfileViewsGraph = requireFeature("Profile Views Graph");
