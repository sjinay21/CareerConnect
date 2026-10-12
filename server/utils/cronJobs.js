import cron from "node-cron";
import { processExpiredRequests } from "../services/connectionService.js";
import { logCronJobExecution } from "../services/cronJobService.js";
import { expireActiveSubscriptions } from "../models/Subscription.js";

const initializeCronJobs = () => {
    // Original connections expiry
    cron.schedule("* * * * *", async () => {
        try {
            const expiredCount = await processExpiredRequests();
            await logCronJobExecution("expire_friend_requests", expiredCount || 0, 0);
        } catch (error) {
            console.error("Cron job failed while processing expired friend requests:", error);
            await logCronJobExecution("expire_friend_requests", 0, 1);
        }
    });

    // Phase 7: Subscription Expiry
    cron.schedule("* * * * *", async () => {
        try {
            await expireActiveSubscriptions();
        } catch (error) {
            console.error("Cron job failed while processing expired subscriptions:", error);
        }
    });

    console.log("Cron jobs initialized.");
};
export default initializeCronJobs;
