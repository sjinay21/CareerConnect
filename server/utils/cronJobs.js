import cron from "node-cron";
import { processExpiredRequests } from "../services/connectionService.js";

const initializeCronJobs = () => {
    cron.schedule("* * * * *", async () => {
        try {
            await processExpiredRequests();
        } catch (error) {
            console.error("Cron job failed:", error);
        }
    });
    console.log("Cron jobs initialized.");
};
export default initializeCronJobs;
